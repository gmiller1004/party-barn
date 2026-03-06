import { NextRequest, NextResponse } from "next/server";
import { cartNoteUpdate, getCart } from "@/lib/shopify/cart";

export async function PATCH(request: NextRequest) {
  const cartId = request.cookies.get("party_barn_cart_id")?.value;
  if (!cartId) {
    return NextResponse.json({ error: "No cart" }, { status: 400 });
  }
  const body = await request.json().catch(() => ({}));
  const note = typeof body.note === "string" ? body.note : "";

  try {
    await cartNoteUpdate(cartId, note || null);
    const cart = await getCart(cartId);
    return NextResponse.json({ cart });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to update note";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
