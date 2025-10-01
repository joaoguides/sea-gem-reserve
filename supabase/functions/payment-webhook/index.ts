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

    const mpAccessToken = Deno.env.get('MERCADO_PAGO_ACCESS_TOKEN');

    if (!mpAccessToken) {
      throw new Error('Mercado Pago access token not configured');
    }

    const { type, data } = await req.json();

    console.log('Webhook received:', { type, data });

    // Only process payment notifications
    if (type !== 'payment') {
      return new Response(JSON.stringify({ status: 'ignored' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get payment details from Mercado Pago
    const paymentId = data.id;
    const mpResponse = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      headers: {
        'Authorization': `Bearer ${mpAccessToken}`,
      },
    });

    if (!mpResponse.ok) {
      throw new Error(`Failed to fetch payment: ${mpResponse.status}`);
    }

    const payment = await mpResponse.json();
    const orderId = payment.external_reference;

    console.log('Payment details:', {
      paymentId,
      orderId,
      status: payment.status,
      statusDetail: payment.status_detail,
    });

    // Update order status based on payment status
    let orderStatus = 'pending';
    let reservationStatus = 'pending';

    if (payment.status === 'approved') {
      orderStatus = 'paid';
      reservationStatus = 'confirmed';
    } else if (payment.status === 'rejected' || payment.status === 'cancelled') {
      orderStatus = 'cancelled';
      reservationStatus = 'cancelled';
    }

    // Update order
    const { error: orderError } = await supabase
      .from('orders')
      .update({
        status: orderStatus,
        payment_id: paymentId.toString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', orderId);

    if (orderError) {
      console.error('Error updating order:', orderError);
      throw orderError;
    }

    // Update reservations
    const { error: resError } = await supabase
      .from('reservations')
      .update({
        status: reservationStatus,
        payment_id: paymentId.toString(),
        updated_at: new Date().toISOString(),
      })
      .eq('order_id', orderId);

    if (resError) {
      console.error('Error updating reservations:', resError);
    }

    console.log('Order and reservations updated successfully');

    return new Response(
      JSON.stringify({ status: 'processed' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    console.error('Error in payment-webhook:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
