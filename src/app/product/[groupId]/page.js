import ProductPageContent from "./productPageContent";

const API_BASE = process.env.NEXT_PUBLIC_SERVER;

async function fetchProductByGroupId(groupId) {
  const url = `${API_BASE}/product/get-by-group-id?groupId=${groupId}`;

  const res = await fetch(url, {
    method: "GET",
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch product");
  }

  const data = await res.json();
  
  return data;
}

export async function generateMetadata({ params }) {
  const { groupId } = await params;

  try {
    const data = await fetchProductByGroupId(groupId);
    const product = data.products[0];

    const rawImg = product?.images?.[0] || product?.image?.[0];
    const imageUrl = rawImg?.startsWith("http")
      ? rawImg
      : `${process.env.NEXT_PUBLIC_CLIENT}${rawImg}`;

    const pageUrl = `${process.env.NEXT_PUBLIC_CLIENT}/product/${groupId}`;
        const metaTitle =
      product.metaTitle?.trim() || `${product.name} | Bys Agro`;

    const metaDescription =
      product.metaDescription?.trim() ||
      product.description?.substring(0, 160) ||
      `Buy ${product.name} - authentic products from Bys Agro`;

    return {
    title: metaTitle,
      description: metaDescription,
      openGraph: {
        title: `${product.name} | Bys Agro`,
        description:
          product.description?.substring(0, 160) || `Buy ${product.name}`,
        url: pageUrl,
        siteName: "Bys Agro",
        type: "website",
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
          },
          {
            url: imageUrl,
            width: 800,
            height: 800,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: product.name,
        description:
          product.description?.substring(0, 160) || `Buy ${product.name}`,
        images: [imageUrl],
      },
       alternates: {
      canonical: `/product/${groupId}`,
    },
    };
  } catch {
    return {
      title: "Product not found",
      description: "Product not found",
      robots: "noindex",
    };
  }
}

export default async function ProductPage({ params, searchParams }) {
  const { groupId } = await params;
    const { visualId } = await searchParams;

  let productsWithDiscount;
  let productSchema;

  try {
    const data = await fetchProductByGroupId(groupId);
    const products = data.products;
    const product = products[0];

    const rawImg = product?.images?.[0] || product?.image?.[0];
    const imageUrl = rawImg?.startsWith("http")
      ? rawImg
      : `${process.env.NEXT_PUBLIC_CLIENT}${rawImg}`;

    productsWithDiscount = products.map((product) => {
      const originalPrice = product.price;
      const discountedPrice =
        product.discount > 0
          ? Math.round(originalPrice - (originalPrice * product.discount) / 100)
          : originalPrice;

      return {
        ...product,
        originalPrice,
        discountedPrice,
      };
    });

    const discountedPrice = productsWithDiscount[0].discountedPrice;
    const cleanDescription = product.description?.substring(0, 160);

    productSchema = {
      "@context": "https://schema.org/",
      "@type": "Product",
      name: product.name,
      image: [imageUrl],
      description: cleanDescription || `Buy ${product.name}`,
      brand: {
        "@type": "Brand",
        name: "Bys Agro Pure",
      },
      offers: {
        "@type": "Offer",
        price: discountedPrice.toString(),
        priceCurrency: "INR",
        availability:
          product?.countInStock?.quantity > 0
            ? "https://schema.org/InStock"
            : "https://schema.org/OutOfStock",
        url: `${process.env.NEXT_PUBLIC_CLIENT}/product/${groupId}`,
        seller: {
          "@type": "Organization",
          name: "Bys Agro",
        },
      },
      sku: product._id || product.visualId,
    };
  } catch (error) {
    console.error("Error fetching product:", error);
    return (
      <div className="min-h-screen flex items-center font-figtree justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <p>The product you&apos;re looking for doesn&apos;t exist.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* \u003c-escaping stops a product name containing </script> from ending the tag early */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productSchema).replace(/</g, "\\u003c"),
        }}
      />
      <div className="min-h-screen">
        <ProductPageContent
          products={productsWithDiscount}
          groupId={groupId}
          initialVisualId={visualId}
        />
      </div>
    </>
  );
}