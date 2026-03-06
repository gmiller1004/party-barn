import { NextRequest, NextResponse } from "next/server";
import { getProductByHandle } from "@/lib/shopify";

type Params = { params: Promise<{ handle: string }> };

export async function GET(request: NextRequest, { params }: Params) {
  const { handle } = await params;
  if (!handle) {
    return NextResponse.json({ error: "handle required" }, { status: 400 });
  }
  try {
    const product = await getProductByHandle(handle);
    if (!product) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(product);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to load product";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
