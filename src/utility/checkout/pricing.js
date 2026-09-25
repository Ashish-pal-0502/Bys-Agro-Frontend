
export function computeUnitFinalPrice(product) {
  const base = Number(product?.price) || 0;
  const discount = Number(product?.discount) || 0;
  const isFlash = Boolean(product?.isFlash && product?.flash);

  let price = base;

  if (isFlash) {
    const f = product.flash;
    if (f.discountType === "PERCENT") price -= (base * Number(f.discountValue)) / 100;
    else if (f.discountType === "FIXED") price -= Number(f.discountValue);
  } else if (discount > 0) {
    price -= (base * discount) / 100;
  }

  return Math.max(price, 0);
}

// One item → one order line. Used by BOTH shipping quote and order submit.
export function normalizeCheckoutItem(item) {
  const isCartItem = !!item.product;
  const p = isCartItem ? item.product : item;
  const isFlash = Boolean(p?.isFlash && p?.flash);

  return {
    name: p?.name || "Product",
    qty: item?.quantity || 1,
    image: p?.images?.[0] || "/icons/honey-jar.png",
    price: Number(p?.price) || 0,
    finalPrice: Math.round(computeUnitFinalPrice(p)),  // ← rounded, once, here
    product: p?._id,
    flashId: isFlash ? p.flash._id : null,
    isCombo: p?.isCombo || false,
    itemWeight: parseFloat(p?.weight || 0),
    weight: parseFloat(p?.packageWeight || p?.weight || 0),
    height: p?.height || 0,
    length: p?.length || 0,
    width: p?.width || 0,
  };
}

export function buildOrderItems(cartItems) {
  return cartItems.map(normalizeCheckoutItem);
}