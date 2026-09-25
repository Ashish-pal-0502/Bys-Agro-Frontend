"use client";
import { useState, useEffect, useCallback } from "react";
import apiClient from "../../api/client";
import { calculateDeliveryFee } from './../../utility/checkout/shipping';
import { calculateTotalWeight } from "../../utility/checkout/weight";

export function useShipping({
  zipCode, cartItems, paymentMethod, subtotal,
  deliveryPrices, grandTotal,
}) {
  const [shippingCharges, setShippingCharges] = useState({});
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [originalShippingCharges, setOriginalShippingCharges] = useState({});

  const handleNoShippingOptions = useCallback(() => {
   let calculatedShipping = subtotal > 500 ? 0 : 50;
    if (calculatedShipping > 0) {
      calculatedShipping = 80;
    }

    setShipping(calculatedShipping);
    setShippingCharges({
      cost: calculatedShipping,
      name: "Standard Shipping",
      delivery_days: "5-7",
      delivery_hours: "Estimated",
    });
  }, [subtotal]);

  const getShippingCharges = useCallback(async () => {
 if (
      !formData?.zipCode ||
      formData.zipCode.length !== 6 ||
      cartItems.length === 0
    ) {
      return;
    }

    const weightInGrams = await calculateTotalWeight(cartItems);
    const weightInKg = weightInGrams / 1000;

    const orderItems = cartItems.map((item) => {
      const isCartItem = !!item.product;
      const productData = isCartItem ? item.product : item;
      const quantity = item?.quantity || 1;

      let finalPrice = productData?.price || 0;
      const originalPrice = productData?.price || 0;

      const discount = productData?.discount || 0;
      const isFlash = productData?.isFlash && productData?.flash;
      const flashId = isFlash ? productData.flash._id : null;

      if (isFlash) {
        const flash = productData.flash;
        if (flash.discountType === "PERCENT") {
          finalPrice = finalPrice - (finalPrice * flash.discountValue) / 100;
        } else if (flash.discountType === "FLAT") {
          finalPrice = finalPrice - flash.discountValue;
        }
      } else if (discount > 0) {
        finalPrice = finalPrice - (finalPrice * discount) / 100;
      }

      finalPrice = Math.max(finalPrice, 0);

      return {
        name: productData?.name || "Product",
        qty: quantity,
        image: productData?.images?.[0] || "/icons/honey-jar.png",
        price: originalPrice,
        finalPrice: finalPrice,
        product: productData?._id,
        flashId: flashId,
        isCombo: productData?.isCombo || false,
        itemWeight: parseFloat(productData?.weight || 0),
        weight: parseFloat(
          productData?.packageWeight || productData?.weight || 0,
        ),
        height: productData?.height || 0,
        length: productData?.length || 0,
        width: productData?.width || 0,
      };
    });

    try {
      const response = await apiClient.post(
        "/shipping/calculate-shipping-cost-for-order",
        {
          orderItems: orderItems,
          deliveryPincode: formData.zipCode,
          total: grandTotal,
          weight: weightInKg.toString(),
          paymentMethod:
            paymentMethod === "online payments" ? "PREPAID" : "COD",
        },
      );

      if (response.ok) {
        const shippingData = response.data;

        setOriginalShippingCharges(shippingData?.totalShippingCost);

        let selectedShipping = null;

        if (shippingData?.cheapest?.cost !== undefined) {
          selectedShipping = shippingData.cheapest;
        } else if (shippingData?.fastest?.cost !== undefined) {
          selectedShipping = shippingData.fastest;
        } else if (shippingData?.recommended?.cost !== undefined) {
          selectedShipping = shippingData.recommended;
        }

        const hasFreeDelivery = selectedShipping?.delivery === true;

        if (selectedShipping) {
          if (hasFreeDelivery) {
            selectedShipping.cost = 0;
          }

          if (selectedShipping.cost > 0) {
            selectedShipping.cost = 80;
          }

          setShippingCharges(selectedShipping);
          setShipping(selectedShipping.cost || 0);
        } else {
          handleNoShippingOptions();
        }
      } else {
        handleNoShippingOptions();
      }
    } catch (error) {
      console.error("Error fetching shipping charges:", error);
      handleNoShippingOptions();
    }
  }, [zipCode, cartItems, paymentMethod, grandTotal, subtotal]);

  useEffect(() => {
    getShippingCharges();
  }, [getShippingCharges]);

  useEffect(() => {
    const fee = calculateDeliveryFee(grandTotal, deliveryPrices);
    setDeliveryFee(fee);
  }, [grandTotal, deliveryPrices]);

  return { shippingCharges, deliveryFee, getShippingCharges };
}