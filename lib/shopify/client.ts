const STOREFRONT_API_VERSION = "2024-01";

function getStorefrontConfig() {
  const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN?.trim();
  const token = (
    process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN ||
    process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN
  )?.trim();
  if (!domain || !token) {
    throw new Error(
      "Missing Shopify env: NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN and SHOPIFY_STOREFRONT_ACCESS_TOKEN (or NEXT_PUBLIC_*)"
    );
  }
  return {
    url: `https://${domain.replace(/^https?:\/\//, "")}/api/${STOREFRONT_API_VERSION}/graphql.json`,
    token,
  };
}

export async function storefrontQuery<T>(
  query: string,
  variables?: Record<string, unknown>
): Promise<T> {
  const { url, token } = getStorefrontConfig();
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": token,
    },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: 60 },
  });
  if (!res.ok) {
    const text = await res.text();
    if (res.status === 401) {
      throw new Error(
        "Shopify 401 Unauthorized: Use the Storefront API access token from your Headless channel (Settings → Apps and sales channels → Headless), not the store password or Admin token."
      );
    }
    throw new Error(`Shopify Storefront API error ${res.status}: ${text}`);
  }
  const json = (await res.json()) as { data?: T; errors?: Array<{ message: string }> };
  if (json.errors?.length) {
    throw new Error(json.errors.map((e) => e.message).join("; "));
  }
  if (json.data == null) {
    throw new Error("Shopify API returned no data");
  }
  return json.data as T;
}
