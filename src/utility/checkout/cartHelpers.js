// utility/checkout/cartHelpers.js
export function deduplicateCartItems(items) {
  const uniqueMap = new Map();

  items.forEach((item) => {
    const productId = item.product?._id || item._id;
    if (!productId) return;

    if (uniqueMap.has(productId)) {
      const existing = uniqueMap.get(productId);
      const mergedQty = Math.max(existing.quantity || 0, item.quantity || 0);
      uniqueMap.set(productId, {
        ...existing,
        ...item,
        quantity: mergedQty,
        product: existing.product || item.product,
      });
    } else {
      uniqueMap.set(productId, item);
    }
  });

  return Array.from(uniqueMap.values());
}