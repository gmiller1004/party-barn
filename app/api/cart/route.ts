import { NextRequest, NextResponse } from "next/server";
import { cartCreate, getCart } from "@/lib/shopify/cart";

const CART_ID_COOKIE = "party_barn_cart_id";

export async function GET(request: NextRequest) {
  const cartId = request.cookies.get(CART_ID_COOKIE)?.value ?? request.nextUrl.searchParams.get("cartId");
  if (!cartId) {
    return NextResponse.json({ cart: null });
  }
  try {
    const cart = await getCart(cartId);
    return NextResponse.json({ cart });
  } catch {
    return NextResponse.json({ cart: null });
  }
}

export async function POST() {
  try {
    const cart = await cartCreate();
    const res = NextResponse.json({ cart });
    res.cookies.set(CART_ID_COOKIE, cart.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });
    return res;
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to create cart";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
