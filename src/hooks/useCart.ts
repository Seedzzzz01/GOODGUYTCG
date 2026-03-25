"use client";

import { useState, useEffect, useCallback } from "react";
import { TCGSet, CartItem } from "@/types";

const CART_KEY = "goodguytcg_cart";

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(CART_KEY);
    if (stored) {
      try {
        setItems(JSON.parse(stored));
      } catch {
        setItems([]);
      }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(CART_KEY, JSON.stringify(items));
    }
  }, [items, isLoaded]);

  const addItem = useCallback((set: TCGSet, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.set.id === set.id);
      if (existing) {
        return prev.map((item) =>
          item.set.id === set.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { set, quantity }];
    });
  }, []);

  const removeItem = useCallback((setId: string) => {
    setItems((prev) => prev.filter((item) => item.set.id !== setId));
  }, []);

  const updateQuantity = useCallback((setId: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((item) => item.set.id !== setId));
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.set.id === setId ? { ...item, quantity } : item
      )
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + item.set.pricePerBox * item.quantity,
    0
  );

  return {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    totalItems,
    totalPrice,
    isLoaded,
  };
}
