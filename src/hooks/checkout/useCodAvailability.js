"use client";
import { useState, useEffect } from "react";
import apiClient from './../../api/client';
import { calculateTotalWeight } from "../../utility/checkout/weight";

export function useCodAvailability({ zipCode, cartItems, paymentMethod }) {
  const [isCodAvailable, setIsCodAvailable] = useState(false);
  const [checkingCod, setCheckingCod] = useState(false);

  useEffect(() => {
    const check = async () => {
      if (!zipCode || zipCode.length !== 6) {
        setIsCodAvailable(false);
        return;
      }

      setCheckingCod(true);
      const weightInGrams = await calculateTotalWeight(cartItems);
      const weightInKg = weightInGrams / 1000;

      try {
        const response = await apiClient.post("/shipping/check-pincode", {
          deliveryPincode: zipCode,
          weight: weightInKg.toString(),
          paymentMethod: paymentMethod === "online payments" ? "PREPAID" : "COD",
        });
        setIsCodAvailable(response.ok && response.data?.serviceable === true);
      } catch (error) {
        console.error("Error checking COD availability:", error);
        setIsCodAvailable(false);
      } finally {
        setCheckingCod(false);
      }
    };

    check();
  }, [zipCode, cartItems, paymentMethod]);

  return { isCodAvailable, checkingCod };
}