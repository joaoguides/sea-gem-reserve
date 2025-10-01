-- Add explicit INSERT policy for orders table to prevent direct client access
-- Orders should only be created through the create-checkout-session edge function
-- which uses the service role key and bypasses RLS after proper authentication

CREATE POLICY "Orders can only be created through backend"
ON public.orders
FOR INSERT
TO authenticated
WITH CHECK (false);

-- Similarly, add explicit INSERT policy for order_items
-- Order items should only be created through the edge function along with orders

CREATE POLICY "Order items can only be created through backend"
ON public.order_items
FOR INSERT
TO authenticated
WITH CHECK (false);

-- Add comment for documentation
COMMENT ON POLICY "Orders can only be created through backend" ON public.orders IS 
'Orders must be created through the create-checkout-session edge function for security and validation. Direct client INSERT is not allowed.';