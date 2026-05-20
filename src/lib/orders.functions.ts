import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const PlaceOrderInput = z.object({
  shippingAddress: z.string().trim().min(5).max(500),
  items: z
    .array(
      z.object({
        productId: z.string().uuid(),
        quantity: z.number().int().min(1).max(99),
      }),
    )
    .min(1)
    .max(50),
});

export const placeOrder = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => PlaceOrderInput.parse(input))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;

    // Linear product lookup using IN clause (single query)
    const ids = data.items.map((i) => i.productId);
    const { data: products, error: prodErr } = await supabase
      .from("products")
      .select("id,name,price_cents,stock")
      .in("id", ids);
    if (prodErr) throw new Error(prodErr.message);
    if (!products || products.length !== ids.length) {
      throw new Error("Some products are unavailable");
    }

    const byId = new Map(products.map((p) => [p.id, p]));
    let total = 0;
    for (const item of data.items) {
      const p = byId.get(item.productId);
      if (!p) throw new Error("Product missing");
      if (p.stock < item.quantity) throw new Error(`${p.name} is out of stock`);
      total += p.price_cents * item.quantity;
    }

    const { data: order, error: orderErr } = await supabase
      .from("orders")
      .insert({
        user_id: userId,
        total_cents: total,
        status: "paid",
        shipping_address: data.shippingAddress,
      })
      .select("id")
      .single();
    if (orderErr || !order) throw new Error(orderErr?.message ?? "Order failed");

    const rows = data.items.map((i) => {
      const p = byId.get(i.productId)!;
      return {
        order_id: order.id,
        product_id: p.id,
        product_name: p.name,
        unit_price_cents: p.price_cents,
        quantity: i.quantity,
      };
    });
    const { error: itemsErr } = await supabase.from("order_items").insert(rows);
    if (itemsErr) throw new Error(itemsErr.message);

    return { orderId: order.id, total };
  });
