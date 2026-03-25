"use client";

import { createContext, useContext } from "react";
import { UserProfile, Order, ShippingAddress } from "@/types";

// Mock store — replace with Supabase when ready
// This simulates a backend with in-memory + localStorage persistence

const STORE_KEY = "goodguytcg_store";

interface StoreData {
  currentUser: UserProfile | null;
  orders: Order[];
  addresses: ShippingAddress[];
}

function getStore(): StoreData {
  if (typeof window === "undefined") {
    return { currentUser: null, orders: [], addresses: [] };
  }
  const stored = localStorage.getItem(STORE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      // ignore
    }
  }
  return { currentUser: null, orders: [], addresses: [] };
}

function saveStore(data: StoreData) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORE_KEY, JSON.stringify(data));
}

// === Auth ===
export function mockLogin(email: string, password: string): UserProfile | null {
  // Demo accounts
  const accounts: Record<string, { password: string; profile: UserProfile }> = {
    "admin@goodguytcg.com": {
      password: "admin123",
      profile: {
        id: "admin-001",
        email: "admin@goodguytcg.com",
        displayName: "Admin",
        phone: "0812345678",
        lineId: "@goodguytcg",
        avatarUrl: "",
        totalSpent: 0,
        orderCount: 0,
        role: "admin",
        createdAt: "2024-01-01",
      },
    },
    "demo@goodguytcg.com": {
      password: "demo123",
      profile: {
        id: "user-001",
        email: "demo@goodguytcg.com",
        displayName: "Nakama Member",
        phone: "0898765432",
        lineId: "nakama001",
        avatarUrl: "",
        totalSpent: 12500,
        orderCount: 4,
        role: "customer",
        createdAt: "2024-01-15",
      },
    },
  };

  const account = accounts[email];
  if (account && account.password === password) {
    const store = getStore();
    store.currentUser = account.profile;
    saveStore(store);
    return account.profile;
  }

  // Allow any email/password for registration simulation
  return null;
}

export function mockRegister(email: string, password: string, displayName: string): UserProfile {
  const profile: UserProfile = {
    id: `user-${Date.now()}`,
    email,
    displayName,
    phone: "",
    lineId: "",
    avatarUrl: "",
    totalSpent: 0,
    orderCount: 0,
    role: "customer",
    createdAt: new Date().toISOString(),
  };

  const store = getStore();
  store.currentUser = profile;
  saveStore(store);
  return profile;
}

export function mockLogout() {
  const store = getStore();
  store.currentUser = null;
  saveStore(store);
}

export function getCurrentUser(): UserProfile | null {
  return getStore().currentUser;
}

export function updateProfile(updates: Partial<UserProfile>): UserProfile | null {
  const store = getStore();
  if (!store.currentUser) return null;
  store.currentUser = { ...store.currentUser, ...updates };
  saveStore(store);
  return store.currentUser;
}

// === Orders ===
export function createOrder(order: Order): Order {
  const store = getStore();
  store.orders.push(order);
  if (store.currentUser) {
    store.currentUser.orderCount += 1;
    store.currentUser.totalSpent += order.total;
  }
  saveStore(store);
  return order;
}

export function getOrders(userId?: string): Order[] {
  const store = getStore();
  if (userId) {
    return store.orders.filter((o) => o.userId === userId);
  }
  return store.orders;
}

export function getOrder(orderId: string): Order | null {
  const store = getStore();
  return store.orders.find((o) => o.id === orderId) || null;
}

export function updateOrder(orderId: string, updates: Partial<Order>): Order | null {
  const store = getStore();
  const index = store.orders.findIndex((o) => o.id === orderId);
  if (index === -1) return null;
  store.orders[index] = { ...store.orders[index], ...updates, updatedAt: new Date().toISOString() };
  saveStore(store);
  return store.orders[index];
}

// === Addresses ===
export function getAddresses(userId: string): ShippingAddress[] {
  const store = getStore();
  return store.addresses.filter((a) => a.userId === userId);
}

export function addAddress(address: ShippingAddress): ShippingAddress {
  const store = getStore();
  if (address.isDefault) {
    store.addresses.forEach((a) => {
      if (a.userId === address.userId) a.isDefault = false;
    });
  }
  store.addresses.push(address);
  saveStore(store);
  return address;
}

// === Order Number Generator ===
export function generateOrderNumber(): string {
  const date = new Date();
  const y = date.getFullYear().toString().slice(-2);
  const m = (date.getMonth() + 1).toString().padStart(2, "0");
  const d = date.getDate().toString().padStart(2, "0");
  const rand = Math.floor(Math.random() * 10000).toString().padStart(4, "0");
  return `GG${y}${m}${d}-${rand}`;
}
