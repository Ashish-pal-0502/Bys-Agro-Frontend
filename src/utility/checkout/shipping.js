// utility/checkout/shipping.js
export function calculateDeliveryFee(cartTotal, deliveryPrices) {
  if (!deliveryPrices) return 0;

  const { feeStrategy, feeAmount, freeThreshold } = deliveryPrices;

  if (feeStrategy === "FREE") return 0;
  if (feeStrategy === "CONDITIONAL") return cartTotal >= freeThreshold ? 0 : feeAmount;
  if (feeStrategy === "FIXED") return feeAmount;
  return 0;
}