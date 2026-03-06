import { storefrontQuery } from "@/lib/shopify/client";

/**
 * GET /api/shopify-check
 * Runs a minimal Storefront API query to verify the token.
 * Use only in development; remove or protect in production.
 */
export async function GET() {
  const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
  const hasToken =
    !!process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN ||
    !!process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

  if (!domain || !hasToken) {
    return Response.json(
      { ok: false, error: "Missing NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN or Storefront token in env" },
      { status: 500 }
    );
  }

  try {
    const data = await storefrontQuery<{ shop: { name: string } }>(
      `query { shop { name } }`
    );
    return Response.json({
      ok: true,
      shop: data.shop?.name,
      message: "Storefront API token is valid.",
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    const is401 = message.includes("401") || message.includes("Unauthorized");
    return Response.json(
      {
        ok: false,
        error: message,
        hint: is401
          ? "Token rejected. In Shopify: Settings → Apps and sales channels → Headless. Use the 'Storefront API access token' (not Admin API). If you use a Custom app, it must have Storefront API access and you must use that app's Storefront token."
          : undefined,
      },
      { status: 502 }
    );
  }
}
