import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { cartCreate, cartLinesAdd, getCart } from "@/lib/shopify/cart";

const CART_ID_COOKIE = "party_barn_cart_id";

export async function POST(request: NextRequest) {
  let cartId = request.cookies.get(CART_ID_COOKIE)?.value;
  const body = await request.json().catch(() => ({}));
  const variantId = body.variantId as string | undefined;
  const quantity = Math.max(1, Math.min(100, Number(body.quantity) || 1));

  if (!variantId) {
    return NextResponse.json({ error: "variantId required" }, { status: 400 });
  }

  try {
    if (!cartId) {
      const newCart = await cartCreate();
      cartId = newCart.id;
    }

    const cart = await cartLinesAdd(cartId, [{ merchandiseId: variantId, quantity }]);
    const res = NextResponse.json({ cart });
    res.cookies.set(CART_ID_COOKIE, cart.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });
    return res;
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to add to cart";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
