import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    const { cartItems, paymentMethod, customerData } = await req.json();

    if (!cartItems || cartItems.length === 0) {
      throw new Error('Cart is empty');
    }

    // Calculate total
    const total = cartItems.reduce(
      (sum: number, item: any) => sum + item.price * (item.quantity || 1),
      0
    );

    // Create order in database
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: user.id,
        total_amount: total,
        status: 'pending',
        payment_method: paymentMethod,
      })
      .select()
      .single();

    if (orderError) {
      console.error('Order creation error:', orderError);
      throw orderError;
    }

    // Create order items
    const orderItems = cartItems.map((item: any) => ({
      order_id: order.id,
      item_type: item.type || 'accessory',
      product_id: item.type === 'reservation' ? item.product_id : null,
      accessory_id: item.type === 'accessory' ? item.id : null,
      quantity: item.quantity || 1,
      unit_price: item.price,
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) {
      console.error('Order items error:', itemsError);
      throw itemsError;
    }

    // Create reservations if any
    const reservations = cartItems
      .filter((item: any) => item.type === 'reservation')
      .map((item: any) => ({
        user_id: user.id,
        product_id: item.product_id,
        mode: item.mode,
        amount: item.price,
        status: 'pending',
        order_id: order.id,
      }));

    if (reservations.length > 0) {
      const { error: resError } = await supabase
        .from('reservations')
        .insert(reservations);

      if (resError) {
        console.error('Reservations error:', resError);
        throw resError;
      }
    }

    // Create Mercado Pago preference
    const mpAccessToken = Deno.env.get('MERCADO_PAGO_ACCESS_TOKEN');
    
    if (!mpAccessToken) {
      console.error('Mercado Pago access token not configured');
      throw new Error('Payment system not configured');
    }

    const items = cartItems.map((item: any) => ({
      title: item.name,
      quantity: item.quantity || 1,
      unit_price: item.price,
      currency_id: 'BRL',
    }));

    const preference = {
      items,
      payer: {
        name: customerData.name || user.user_metadata?.full_name,
        email: customerData.email || user.email,
        phone: {
          number: customerData.phone || '',
        },
      },
      back_urls: {
        success: `${req.headers.get('origin')}/checkout/sucesso?order_id=${order.id}`,
        failure: `${req.headers.get('origin')}/checkout`,
        pending: `${req.headers.get('origin')}/checkout/sucesso?order_id=${order.id}`,
      },
      auto_return: 'approved',
      external_reference: order.id,
      notification_url: `${Deno.env.get('SUPABASE_URL')}/functions/v1/payment-webhook`,
      payment_methods: {
        excluded_payment_types: paymentMethod === 'pix' 
          ? [{ id: 'credit_card' }, { id: 'debit_card' }]
          : [{ id: 'bank_transfer' }],
      },
    };

    const mpResponse = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${mpAccessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(preference),
    });

    if (!mpResponse.ok) {
      const errorText = await mpResponse.text();
      console.error('Mercado Pago error:', errorText);
      throw new Error(`Mercado Pago error: ${mpResponse.status}`);
    }

    const mpData = await mpResponse.json();

    console.log('Checkout session created successfully:', {
      orderId: order.id,
      preferenceId: mpData.id,
    });

    return new Response(
      JSON.stringify({
        orderId: order.id,
        checkoutUrl: mpData.init_point,
        sandboxUrl: mpData.sandbox_init_point,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    console.error('Error in create-checkout-session:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
