/** Storefront API GraphQL – products list with first-variant store availability */

export const PRODUCTS_WITH_PICKUP = `
  query ProductsWithPickup($first: Int!) {
    products(first: $first, sortKey: TITLE, query: "status:active") {
      edges {
        node {
          id
          handle
          title
          description
          availableForSale
          featuredImage {
            url
            altText
          }
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          variants(first: 1) {
            nodes {
              id
              availableForSale
              price {
                amount
                currencyCode
              }
              storeAvailability(first: 1) {
                edges {
                  node {
                    available
                    pickUpTime
                    location {
                      name
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

/** Single product by handle with full variant pickup info */

export const PRODUCT_BY_HANDLE_WITH_PICKUP = `
  query ProductByHandle($handle: String!) {
    product(handle: $handle) {
      id
      handle
      title
      description
      descriptionHtml
      availableForSale
      featuredImage {
        url
        altText
      }
      images(first: 8) {
        nodes {
          url
          altText
        }
      }
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
      }
      variants(first: 20) {
        nodes {
          id
          title
          availableForSale
          price {
            amount
            currencyCode
          }
          storeAvailability(first: 3) {
            edges {
              node {
                available
                pickUpTime
                location {
                  name
                }
              }
            }
          }
        }
      }
    }
  }
`;
