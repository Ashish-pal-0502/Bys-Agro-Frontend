"use client";
import { useState, useEffect, useCallback } from "react";
import apiClient from './../../api/client';

export function useDeliveryPrices(paymentMethod) {
  const [deliveryPrices, setDeliveryPrices] = useState(null);
  const [extraDiscount, setExtraDiscount] = useState(0);
  const [codHandlingCharge, setCodHandlingCharge] = useState(0);

  const getDeliveryPrices = useCallback(async () => {
    try {
      const response = await apiClient.get("/delivery-fee/get", {
        paymentMethod: paymentMethod === "online payments" ? "PREPAID" : "COD",
      });

      if (response.ok && response.data?.data) {
        setDeliveryPrices(response.data.data);
        setExtraDiscount(response.data.data.extraDiscount || 0);
        setCodHandlingCharge(response.data.data.codHandlingCharge || 0);
      }
    } catch (error) {
      console.error("Error fetching delivery prices:", error);
    }
  }, [paymentMethod]);

  useEffect(() => {
    getDeliveryPrices();
  }, [getDeliveryPrices]);

  return {
    deliveryPrices,
    extraDiscount,
    codHandlingCharge,
    getDeliveryPrices,
  };
}