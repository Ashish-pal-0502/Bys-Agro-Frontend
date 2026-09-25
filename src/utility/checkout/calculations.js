
export function calculateItemsFinalPrice(cartItems) {
  return cartItems.reduce((total, item) => {
    let itemFinalPrice = item.finalPrice;

    if (!itemFinalPrice && item.product) {
      const originalPrice = item.product.price || 0;
      const discount = item.product.discount || 0;
      const isFlash = item.product.isFlash && item.product.flash;

      if (isFlash) {
        const flash = item.product.flash;
        if (flash.discountType === "PERCENT") {
          itemFinalPrice = originalPrice - (originalPrice * flash.discountValue) / 100;
        } else if (flash.discountType === "FLAT") {
          itemFinalPrice = originalPrice - flash.discountValue;
        }
      } else if (discount > 0) {
        itemFinalPrice = originalPrice - (originalPrice * discount) / 100;
      } else {
        itemFinalPrice = originalPrice;
      }
      itemFinalPrice = Math.max(itemFinalPrice, 0);
    }

    return total + Math.round(itemFinalPrice || 0) * (item.qty || item.quantity || 1);
  }, 0);
}

export function calculateFinalTotal({
  grandTotal = 0,
  deliveryFee = 0,
  codHandlingCharge = 0,
  extraDiscount = 0,
  couponDiscount = 0,
}) {
  const safe = (n) => (Number.isFinite(+n) ? +n : 0);
  return Math.max(
    0,
    safe(grandTotal) +
      safe(deliveryFee) +
      safe(codHandlingCharge) -
      (safe(grandTotal) * safe(extraDiscount)) / 100 -
      safe(couponDiscount)
  );
}