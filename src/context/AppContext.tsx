import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
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
  status:
    | "pending"
    | "confirmed"
    | "preparing"
    | "shipped"
    | "delivered"
    | "cancelled";
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
  type?: "text" | "image";
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
  type:
    | "order_shipped"
    | "order_confirmed"
    | "order_cancelled"
    | "new_order"
    | "order_cancelled_seller"
    | "order_preparing"
    | "donation";
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
  t: (key: keyof (typeof translations)["en"]) => string;
  blockedUserIds: string[];
  setBlockedUserIds: React.Dispatch<React.SetStateAction<string[]>>;
  createChatIfNotExist: (
    participantId: string,
    participantName: string
  ) => void;
  isDarkMode: boolean;
  setIsDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
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
  {
    id: "1",
    name: "Potato",
    price: 3.5,
    stock: 120,
    image: potatoImg,
    seller: "Farmer Ali",
    sellerId: "seller1",
    source: {
      name: "Ali's Farm",
      type: "Farm",
      location: "Serdang, Selangor",
      distance: 5.1,
    },
    freshness: 5,
    bestBefore: "5 days",
  },
  {
    id: "2",
    name: "Tomato",
    price: 5.0,
    stock: 80,
    image: tomatoImg,
    seller: "Farmer Siti",
    sellerId: "seller2",
    source: {
      name: "Siti Organic Farm",
      type: "Farm",
      location: "Cameron Highlands, Pahang",
      distance: 8.3,
    },
    freshness: 4,
    bestBefore: "3 days",
  },
  {
    id: "3",
    name: "Cucumber",
    price: 4.0,
    stock: 95,
    image: cucumberImg,
    seller: "Farmer Ahmad",
    sellerId: "seller3",
    source: {
      name: "Green Garden Cafe",
      type: "Restaurant",
      location: "Bangsar, Kuala Lumpur",
      distance: 3.2,
    },
    freshness: 3,
    bestBefore: "2 days",
  },
  {
    id: "4",
    name: "Kangkung",
    price: 2.5,
    stock: 200,
    image: kangkungImg,
    seller: "John Farmer",
    sellerId: "user1",
    source: {
      name: "John's Farm",
      type: "Farm",
      location: "Semenyih, Selangor",
      distance: 4.0,
    },
    freshness: 5,
    bestBefore: "4 days",
  },
  {
    id: "5",
    name: "Broccoli",
    price: 8.0,
    stock: 45,
    image: broccoliImg,
    seller: "John Farmer",
    sellerId: "user1",
    source: {
      name: "FreshMart Supermarket",
      type: "Supermarket",
      location: "Mid Valley, KL",
      distance: 6.7,
    },
    freshness: 4,
    bestBefore: "3 days",
  },
  {
    id: "6",
    name: "Chili",
    price: 12.0,
    stock: 60,
    image: chiliImg,
    seller: "Farmer Ali",
    sellerId: "seller1",
    source: {
      name: "Ali's Farm",
      type: "Farm",
      location: "Serdang, Selangor",
      distance: 5.1,
    },
    freshness: 2,
    bestBefore: "1 day",
  },
  {
    id: "7",
    name: "Cabbage",
    price: 3.0,
    stock: 150,
    image: cabbageImg,
    seller: "John Farmer",
    sellerId: "user1",
    source: {
      name: "Community Food Hub",
      type: "Community Donor",
      location: "Cheras, KL",
      distance: 2.5,
    },
    freshness: 4,
    bestBefore: "3 days",
  },
];

const defaultNotifications: Notification[] = [
  {
    id: "n1",
    type: "order_confirmed",
    title: "Order Confirmed",
    message: "Your order #1001 has been confirmed. Click to see details.",
    orderId: "o1",
    timestamp: new Date(Date.now() - 3600000),
    read: false,
  },
  {
    id: "n2",
    type: "order_shipped",
    title: "Order Shipped",
    message: "Your order #1002 has been shipped. Click to see details.",
    orderId: "o2",
    timestamp: new Date(Date.now() - 7200000),
    read: false,
  },
  {
    id: "n3",
    type: "new_order",
    title: "New Order",
    message: "You received a new order for Cabbage. Click to see details.",
    orderId: "o4",
    timestamp: new Date(Date.now() - 600000),
    read: false,
  },
];

const defaultOrders: Order[] = [
  {
    id: "o1",
    listing: defaultListings[0],
    quantity: 5,
    totalPrice: 17.5,
    status: "confirmed",
    buyerId: "user1",
    sellerId: "seller1",
    createdAt: new Date(Date.now() - 86400000),
    address: "123 Farm aroad, Kuala Lumpur",
    buyerName: "John Farmer",
    buyerPhone: "+60123456789",
  },
  {
    id: "o2",
    listing: defaultListings[1],
    quantity: 3,
    totalPrice: 15.0,
    status: "shipped",
    buyerId: "user1",
    sellerId: "seller2",
    trackingNumber: "MY123456789",
    createdAt: new Date(Date.now() - 172800000),
    address: "123 Farm aroad, Kuala Lumpur",
    buyerName: "John Farmer",
    buyerPhone: "+60123456789",
  },
  {
    id: "o3",
    listing: defaultListings[0],
    quantity: 10,
    totalPrice: 35.0,
    status: "pending",
    buyerId: "buyer1",
    sellerId: "user1",
    createdAt: new Date(Date.now() - 900000),
    address: "123 Farm aroad, Kuala Lumpur",
    buyerName: "John Farmer",
    buyerPhone: "+60123456789",
  },
  {
    id: "o4",
    listing: defaultListings[6],
    quantity: 2,
    totalPrice: 6.0,
    status: "pending",
    buyerId: "buyer2",
    sellerId: "user1",
    createdAt: new Date(Date.now() - 600000),
    address: "456 City Road, Kuala Lumpur",
    buyerName: "Sarah Lim",
    buyerPhone: "+60198765432",
  },
];

const defaultChatThreads: ChatThread[] = [
  {
    id: "seller1",
    participantId: "seller1",
    participantName: "Farmer Ali",
    participantAvatar: "👨‍🌾",
    messages: [
      {
        id: "m1",
        senderId: "seller1",
        text: "Hi John, your 5kg of Potatoes are ready for pickup! 🥔",
        timestamp: new Date(Date.now() - 3600000),
        type: "text",
      },
      {
        id: "m2",
        senderId: "user1",
        text: "Great! Are they freshly harvested today?",
        timestamp: new Date(Date.now() - 3000000),
        type: "text",
      },
      {
        id: "m3",
        senderId: "seller1",
        text: "Yes, I just pulled them from the soil this morning. Very fresh!",
        timestamp: new Date(Date.now() - 2500000),
        type: "text",
      },
      {
        id: "m4",
        senderId: "user1",
        text: "Awesome, I will be there in 20 minutes. Thanks Ali!",
        timestamp: new Date(Date.now() - 2000000),
        type: "text",
      },
    ],
  },
  {
    id: "seller2",
    participantId: "seller2",
    participantName: "Farmer Siti",
    participantAvatar: "👩‍🌾",
    messages: [
      {
        id: "s1",
        senderId: "user1",
        text: "Hi Siti, do you still have organic tomatoes available?",
        timestamp: new Date(Date.now() - 7200000),
        type: "text",
      },
      {
        id: "s2",
        senderId: "seller2",
        text: "Hi John! Yes, I still have about 10kg left. They are very ripe and sweet! 🍅",
        timestamp: new Date(Date.now() - 6800000),
        type: "text",
      },
      {
        id: "s3",
        senderId: "user1",
        text: "Perfect! Can I take 3kg? And what's the total price?",
        timestamp: new Date(Date.now() - 6500000),
        type: "text",
      },
      {
        id: "s4",
        senderId: "seller2",
        text: "Sure! For 3kg it will be RM 15.00. I can set them aside for you.",
        timestamp: new Date(Date.now() - 6000000),
        type: "text",
      },
      {
        id: "s5",
        senderId: "user1",
        text: "Thanks Siti! I'll pick them up tomorrow morning.",
        timestamp: new Date(Date.now() - 5500000),
        type: "text",
      },
    ],
  },
  {
    id: "seller3",
    participantId: "seller3",
    participantName: "Farmer Ahmad",
    participantAvatar: "👨‍🌾",
    messages: [
      {
        id: "a1",
        senderId: "seller3",
        text: "Salam John! I saw you were looking for cucumbers. I just harvested a new batch! 🥒",
        timestamp: new Date(Date.now() - 14400000),
        type: "text",
      },
      {
        id: "a2",
        senderId: "user1",
        text: "Waalaikumussalam Ahmad! Yes, I need about 5kg for my restaurant.",
        timestamp: new Date(Date.now() - 14000000),
        type: "text",
      },
      {
        id: "a3",
        senderId: "seller3",
        text: "No problem! I have plenty. They are extra crunchy this time. RM 20.00 for 5kg.",
        timestamp: new Date(Date.now() - 13500000),
        type: "text",
      },
      {
        id: "a4",
        senderId: "user1",
        text: "That sounds great. I'll drop by your farm around 5 PM today.",
        timestamp: new Date(Date.now() - 13000000),
        type: "text",
      },
      {
        id: "a5",
        senderId: "seller3",
        text: "Perfect, see you then! I'll have them packed for you.",
        timestamp: new Date(Date.now() - 12500000),
        type: "text",
      },
    ],
  },
];

const defaultTransactions: Transaction[] = [
  {
    id: "t1",
    type: "topup",
    amount: 5000.0,
    description: "Wallet Top-up via FPX",
    timestamp: new Date(Date.now() - 604800000),
  },
  {
    id: "t2",
    type: "purchase",
    amount: -17.5,
    description: "Payment for Potato order #1001",
    timestamp: new Date(Date.now() - 86400000),
  },
  {
    id: "t3",
    type: "purchase",
    amount: -15.0,
    description: "Payment for Tomato order #1002",
    timestamp: new Date(Date.now() - 172800000),
  },
  {
    id: "t4",
    type: "sale",
    amount: 592.5,
    description: "Earnings from Cabbage sale",
    timestamp: new Date(Date.now() - 43200000),
  },
];

const defaultScanHistory: ScanRecord[] = [
  {
    id: "scan3",
    plantName: "Broccoli",
    result: "Healthy",
    timestamp: new Date(Date.now() - 43200000),
  },
  {
    id: "scan4",
    plantName: "Cabbage",
    result: "Healthy",
    timestamp: new Date(Date.now() - 64800000),
  },
  {
    id: "scan1",
    plantName: "Chili Plant",
    result: "Pest Detected",
    timestamp: new Date(Date.now() - 86400000),
    treatment: {
      nutrient:
        "Add Nitrogen fertilizer: 10g per plant. Mix 2 tablespoons of compost fertilizer with 1 litre of water and apply every 3 days.",
      watering:
        "Water 2 times per day. Add 2 cups (500ml) at 7AM and 6PM directly to the root area.",
      pesticide:
        "Spray organic pesticide every 3 days. Dilute 5ml of neem oil in 1 litre of water and spray on both sides of leaves for 2 weeks.",
    },
  },
];

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile>({
    id: "user1",
    username: "John Farmer",
    phone: "+60123456789",
    email: "john@agrosave.com",
    avatar: "👨‍🌾",
    address: "123 Farm aroad, Kuala Lumpur",
  });
  const [walletBalance, setWalletBalance] = useState(5560.0);
  const [listings, setListings] = useState<Listing[]>(defaultListings);
  const [orders, setOrders] = useState<Order[]>(defaultOrders);
  const [notifications, setNotifications] =
    useState<Notification[]>(defaultNotifications);
  const [chatThreads, setChatThreads] =
    useState<ChatThread[]>(defaultChatThreads);
  const [transactions, setTransactions] =
    useState<Transaction[]>(defaultTransactions);
  const [scanHistory, setScanHistory] =
    useState<ScanRecord[]>(defaultScanHistory);
  const [language, setLanguage] = useState<Language>("en");
  const [blockedUserIds, setBlockedUserIds] = useState<string[]>(["seller4"]); // Pre-blocked Farmer Lee for example
  const [isDarkMode, setIsDarkMode] = useState(
    () => localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  const createChatIfNotExist = (
    participantId: string,
    participantName: string
  ) => {
    setChatThreads((prev) => {
      const exists = prev.find((t) => t.participantId === participantId);
      if (exists) return prev;
      return [
        ...prev,
        {
          id: participantId,
          participantId,
          participantName,
          participantAvatar: "👨‍🌾",
          messages: [],
        },
      ];
    });
  };

  const t = (key: keyof (typeof translations)["en"]) => {
    return translations[language][key] || translations["en"][key];
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        walletBalance,
        setWalletBalance,
        listings,
        setListings,
        orders,
        setOrders,
        notifications,
        setNotifications,
        chatThreads,
        setChatThreads,
        transactions,
        setTransactions,
        scanHistory,
        setScanHistory,
        language,
        setLanguage,
        t,
        blockedUserIds,
        setBlockedUserIds,
        createChatIfNotExist,
        isDarkMode,
        setIsDarkMode,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
