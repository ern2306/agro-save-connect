import React, { createContext, useContext, useState, ReactNode } from "react";
import { Language, translations } from "@/lib/i18n";

export interface FoodSource {
  name: string;
  type: "Restaurant" | "Farm" | "Supermarket" | "Community Donor";
  location: string;
  distance: number;
}

export type FreshnessLevel = 1 | 2 | 3 | 4 | 5;

export interface Listing {
  id: string;
  name: string;
  price: number;
  stock: number;
  image: string;
  seller: string;
  sellerId: string;
  isSurplus?: boolean;
  source?: FoodSource;
  freshness?: FreshnessLevel;
  bestBefore?: string;
}

export interface Order {
  id: string;
  listing: Listing;
  quantity: number;
  totalPrice: number;
  status: "pending" | "confirmed" | "preparing" | "shipped" | "delivered" | "cancelled";
  buyerId: string;
  sellerId: string;
  trackingNumber?: string;
  createdAt: Date;
  address: string;
  cancelledBy?: "buyer" | "seller";
  refundStatus?: "none" | "requested" | "processed";
  buyerName?: string;
  buyerPhone?: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  timestamp: Date;
}

export interface ChatThread {
  id: string;
  participantId: string;
  participantName: string;
  participantAvatar: string;
  messages: ChatMessage[];
}

export interface Notification {
  id: string;
  type: "order_shipped" | "order_confirmed" | "order_cancelled" | "new_order" | "order_cancelled_seller" | "order_preparing" | "donation";
  title: string;
  message: string;
  orderId: string;
  timestamp: Date;
  read: boolean;
}

export interface Transaction {
  id: string;
  type: "topup" | "purchase" | "transfer" | "refund" | "sale";
  amount: number;
  description: string;
  timestamp: Date;
}

export interface UserProfile {
  id: string;
  username: string;
  phone: string;
  email: string;
  avatar: string;
  address?: string;
}

export interface ScanRecord {
  id: string;
  plantName: string;
  result: "Healthy" | "Pest Detected";
  timestamp: Date;
  treatment?: {
    nutrient: string;
    watering: string;
    pesticide: string;
  };
}

export const generateTrackingNumber = () => {
  const digits = Math.floor(100000000 + Math.random() * 900000000);
  return `TRK${digits}`;
};

interface AppState {
  currentUser: UserProfile;
  setCurrentUser: React.Dispatch<React.SetStateAction<UserProfile>>;
  walletBalance: number;
  setWalletBalance: React.Dispatch<React.SetStateAction<number>>;
  listings: Listing[];
  setListings: React.Dispatch<React.SetStateAction<Listing[]>>;
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  notifications: Notification[];
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
  chatThreads: ChatThread[];
  setChatThreads: React.Dispatch<React.SetStateAction<ChatThread[]>>;
  transactions: Transaction[];
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
  scanHistory: ScanRecord[];
  setScanHistory: React.Dispatch<React.SetStateAction<ScanRecord[]>>;
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof typeof translations["en"]) => string;
}

const AppContext = createContext<AppState | undefined>(undefined);

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
};

import potatoImg from "@/assets/potato.png";
import tomatoImg from "@/assets/tomato.png";
import cucumberImg from "@/assets/cucumber.png";
import kangkungImg from "@/assets/kangkung.png";
import broccoliImg from "@/assets/broccoli.png";
import chiliImg from "@/assets/chili.png";
import cabbageImg from "@/assets/cabbage.png";

const defaultListings: Listing[] = [
  { id: "1", name: "Potato", price: 3.5, stock: 120, image: potatoImg, seller: "Farmer Ali", sellerId: "seller1",
    source: { name: "Ali's Farm", type: "Farm", location: "Serdang, Selangor", distance: 5.1 }, freshness: 5, bestBefore: "5 days" },
  { id: "2", name: "Tomato", price: 5.0, stock: 80, image: tomatoImg, seller: "Farmer Siti", sellerId: "seller2",
    source: { name: "Siti Organic Farm", type: "Farm", location: "Cameron Highlands, Pahang", distance: 8.3 }, freshness: 4, bestBefore: "3 days" },
  { id: "3", name: "Cucumber", price: 4.0, stock: 95, image: cucumberImg, seller: "Farmer Ahmad", sellerId: "seller3",
    source: { name: "Green Garden Cafe", type: "Restaurant", location: "Bangsar, Kuala Lumpur", distance: 3.2 }, freshness: 3, bestBefore: "2 days" },
  { id: "4", name: "Kangkung", price: 2.5, stock: 200, image: kangkungImg, seller: "John Farmer", sellerId: "user1",
    source: { name: "John's Farm", type: "Farm", location: "Semenyih, Selangor", distance: 4.0 }, freshness: 5, bestBefore: "4 days" },
  { id: "5", name: "Broccoli", price: 8.0, stock: 45, image: broccoliImg, seller: "John Farmer", sellerId: "user1",
    source: { name: "FreshMart Supermarket", type: "Supermarket", location: "Mid Valley, KL", distance: 6.7 }, freshness: 4, bestBefore: "3 days" },
  { id: "6", name: "Chili", price: 12.0, stock: 60, image: chiliImg, seller: "Farmer Ali", sellerId: "seller1",
    source: { name: "Ali's Farm", type: "Farm", location: "Serdang, Selangor", distance: 5.1 }, freshness: 2, bestBefore: "1 day" },
  { id: "7", name: "Cabbage", price: 3.0, stock: 150, image: cabbageImg, seller: "John Farmer", sellerId: "user1",
    source: { name: "Community Food Hub", type: "Community Donor", location: "Cheras, KL", distance: 2.5 }, freshness: 4, bestBefore: "3 days" },
];

const defaultNotifications: Notification[] = [
  { id: "n1", type: "order_confirmed", title: "Order Confirmed", message: "Your order #1001 has been confirmed. Click to see details.", orderId: "o1", timestamp: new Date(Date.now() - 3600000), read: false },
  { id: "n2", type: "order_shipped", title: "Order Shipped", message: "Your order #1002 has been shipped. Click to see details.", orderId: "o2", timestamp: new Date(Date.now() - 7200000), read: false },
  { id: "n3", type: "new_order", title: "New Order", message: "You received a new order for Cabbage. Click to see details.", orderId: "o4", timestamp: new Date(Date.now() - 600000), read: false },
];

const defaultOrders: Order[] = [
  {
    id: "o1", listing: defaultListings[0], quantity: 5, totalPrice: 17.5,
    status: "confirmed", buyerId: "user1", sellerId: "seller1",
    createdAt: new Date(Date.now() - 86400000), address: "123 Farm aroad, Kuala Lumpur",
    buyerName: "John Farmer", buyerPhone: "+60123456789",
  },
  {
    id: "o2", listing: defaultListings[1], quantity: 3, totalPrice: 15.0,
    status: "shipped", buyerId: "user1", sellerId: "seller2", trackingNumber: "MY123456789",
    createdAt: new Date(Date.now() - 172800000), address: "123 Farm aroad, Kuala Lumpur",
    buyerName: "John Farmer", buyerPhone: "+60123456789",
  },
  {
    id: "o3", listing: defaultListings[0], quantity: 10, totalPrice: 35.0,
    status: "pending", buyerId: "buyer1", sellerId: "user1",
    createdAt: new Date(Date.now() - 900000), address: "123 Farm aroad, Kuala Lumpur",
    buyerName: "John Farmer", buyerPhone: "+60123456789",
  },
  {
    id: "o4", listing: defaultListings[6], quantity: 2, totalPrice: 6.0,
    status: "pending", buyerId: "buyer2", sellerId: "user1",
    createdAt: new Date(Date.now() - 600000), address: "456 City Road, Kuala Lumpur",
    buyerName: "Sarah Lim", buyerPhone: "+60198765432",
  },
];

const defaultChatThreads: ChatThread[] = [
  {
    id: "c1", participantId: "seller1", participantName: "Farmer Ali",
    participantAvatar: "👨‍🌾",
    messages: [
      { id: "m1", senderId: "seller1", text: "Hi, your potatoes are ready!", timestamp: new Date(Date.now() - 3600000) },
      { id: "m2", senderId: "user1", text: "Great, thanks!", timestamp: new Date(Date.now() - 3000000) },
    ],
  },
  {
    id: "c2", participantId: "buyer1", participantName: "Ahmad",
    participantAvatar: "🧑",
    messages: [
      { id: "m3", senderId: "buyer1", text: "Can I order 10kg of potatoes?", timestamp: new Date(Date.now() - 1800000) },
      { id: "m4", senderId: "user1", text: "Sure, placing order now", timestamp: new Date(Date.now() - 1200000) },
    ],
  },
];

const defaultScanHistory: ScanRecord[] = [
  { id: "scan3", plantName: "Broccoli", result: "Healthy", timestamp: new Date(Date.now() - 43200000) },
  { id: "scan4", plantName: "Cabbage", result: "Healthy", timestamp: new Date(Date.now() - 64800000) },
  { id: "scan1", plantName: "Chili Plant", result: "Pest Detected", timestamp: new Date(Date.now() - 86400000),
    treatment: {
      nutrient: "Add Nitrogen fertilizer: 10g per plant. Mix 2 tablespoons of compost fertilizer with 1 litre of water and apply every 3 days.",
      watering: "Water 2 times per day. Add 2 cups (500ml) at 7AM and 6PM directly to the root area.",
      pesticide: "Spray organic pesticide every 3 days. Dilute 5ml of neem oil in 1 litre of water and spray on both sides of leaves for 2 weeks.",
    },
  },
  { id: "scan2", plantName: "Tomato", result: "Pest Detected", timestamp: new Date(Date.now() - 172800000),
    treatment: {
      nutrient: "Add Nitrogen fertilizer: 10g per plant. Mix 2 tablespoons of compost fertilizer with 1 litre of water and apply every 3 days.",
      watering: "Water 2 times per day. Add 2 cups (500ml) at 7AM and 6PM directly to the root area.",
      pesticide: "Spray organic pesticide every 3 days. Dilute 5ml of neem oil in 1 litre of water and spray on both sides of leaves for 2 weeks.",
    },
  },
];

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile>({
    id: "user1", username: "John Farmer", phone: "+60123456789",
    email: "john@agrosave.com", avatar: "👨‍🌾", address: "123 Farm aroad, Kuala Lumpur",
  });
  const [walletBalance, setWalletBalance] = useState(5560.0);
  const [listings, setListings] = useState<Listing[]>(defaultListings);
  const [orders, setOrders] = useState<Order[]>(defaultOrders);
  const [notifications, setNotifications] = useState<Notification[]>(defaultNotifications);
  const [chatThreads, setChatThreads] = useState<ChatThread[]>(defaultChatThreads);
  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: "t1", type: "topup", amount: 500, description: "Top Up", timestamp: new Date(Date.now() - 86400000 * 3) },
    { id: "t2", type: "purchase", amount: -17.5, description: "Purchase: Potato", timestamp: new Date(Date.now() - 86400000) },
    { id: "t3", type: "sale", amount: 35.0, description: "Sale: Potato x10", timestamp: new Date(Date.now() - 3600000) },
  ]);
  const [scanHistory, setScanHistory] = useState<ScanRecord[]>(defaultScanHistory);
  const [language, setLanguage] = useState<Language>("en");

  const t = (key: keyof typeof translations["en"]) => {
    return translations[language][key] || translations["en"][key];
  };

  return (
    <AppContext.Provider value={{
      currentUser, setCurrentUser, walletBalance, setWalletBalance,
      listings, setListings, orders, setOrders, notifications, setNotifications,
      chatThreads, setChatThreads, transactions, setTransactions,
      scanHistory, setScanHistory, language, setLanguage, t
    }}>
      {children}
    </AppContext.Provider>
  );
};