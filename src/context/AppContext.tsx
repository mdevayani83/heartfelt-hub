import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface Product {
  id: number;
  name: string;
  type: string;
  size: string;
  quality: string;
  price: string;
  company: string;
  image: string;
  seller: string;
  isDonation?: boolean;
}

export interface CartItem {
  id: number;
  productId: number;
  userId: string;
  quantity: number;
  price: string;
}

export interface Order {
  id: number;
  productId: number;
  buyerId: string;
  sellerId: string;
  status: "Requested" | "Confirmed" | "Shipped" | "Delivered";
  paymentStatus: "Pending" | "Paid";
  quantity: number;
  totalPrice: string;
  createdAt: string;
}

export interface Message {
  id: number;
  senderId: string;
  receiverId: string;
  productId: number;
  message: string;
  timestamp: string;
}

export interface DonationRequest {
  id: number;
  productId: number;
  requesterId: string;
  sellerId: string;
  message: string;
  status: "Pending" | "Approved" | "Rejected";
  createdAt: string;
}

export interface Payment {
  id: number;
  orderId: number;
  buyerId: string;
  amount: string;
  method: string;
  status: "Paid";
  createdAt: string;
}

export interface Notification {
  id: number;
  userId: string;
  message: string;
  read: boolean;
  type: "order" | "donation" | "chat" | "payment";
  createdAt: string;
}

interface User {
  username: string;
}

interface AppContextType {
  user: User | null;
  products: Product[];
  cart: CartItem[];
  orders: Order[];
  messages: Message[];
  donationRequests: DonationRequest[];
  payments: Payment[];
  notifications: Notification[];
  login: (username: string, password: string) => boolean;
  signup: (username: string, password: string) => boolean;
  logout: () => void;
  addProduct: (product: Omit<Product, "id" | "seller">) => void;
  searchProducts: (keyword: string) => Product[];
  addToCart: (productId: number) => void;
  removeFromCart: (cartItemId: number) => void;
  clearCart: () => void;
  placeOrder: (productId: number, quantity: number) => Order;
  updateOrderStatus: (orderId: number, status: Order["status"]) => void;
  sendMessage: (receiverId: string, productId: number, message: string) => void;
  requestDonation: (productId: number, message: string) => void;
  updateDonationStatus: (requestId: number, status: DonationRequest["status"]) => void;
  makePayment: (orderId: number, method: string) => void;
  markNotificationRead: (notificationId: number) => void;
  markAllNotificationsRead: () => void;
  getUnreadNotificationCount: () => number;
}

const AppContext = createContext<AppContextType | null>(null);

const SAMPLE_PRODUCTS: Product[] = [
  { id: 1, name: "Cotton T-Shirt", type: "Clothing", size: "M", quality: "Good", price: "250", company: "EcoWear", image: "", seller: "demo" },
  { id: 2, name: "Denim Jeans", type: "Clothing", size: "32", quality: "Like New", price: "600", company: "GreenThreads", image: "", seller: "demo" },
  { id: 3, name: "Ceramic Mug", type: "Home", size: "Standard", quality: "Excellent", price: "120", company: "EarthCraft", image: "", seller: "demo" },
  { id: 4, name: "Bamboo Water Bottle", type: "Accessories", size: "750ml", quality: "New", price: "350", company: "NatureSip", image: "", seller: "demo" },
  { id: 5, name: "Yoga Mat", type: "Fitness", size: "6mm", quality: "Good", price: "500", company: "ZenFit", image: "", seller: "demo" },
  { id: 6, name: "Wooden Desk Lamp", type: "Home", size: "30cm", quality: "Excellent", price: "800", company: "LightCraft", image: "", seller: "demo" },
  { id: 7, name: "Kids Storybooks (Set of 5)", type: "Free / Donate", size: "Standard", quality: "Good", price: "0", company: "BookWorm", image: "", seller: "demo", isDonation: true },
  { id: 8, name: "Old Winter Jacket", type: "Free / Donate", size: "L", quality: "Decent", price: "0", company: "WarmUp", image: "", seller: "demo", isDonation: true },
];

function loadState<T>(key: string, fallback: T): T {
  const saved = localStorage.getItem(key);
  return saved ? JSON.parse(saved) : fallback;
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => loadState("eco_user", null));
  const [products, setProducts] = useState<Product[]>(() => loadState("eco_products", SAMPLE_PRODUCTS));
  const [users, setUsers] = useState<Record<string, string>>(() => loadState("eco_users", { demo: "demo123" }));
  const [cart, setCart] = useState<CartItem[]>(() => loadState("eco_cart", []));
  const [orders, setOrders] = useState<Order[]>(() => loadState("eco_orders", []));
  const [messages, setMessages] = useState<Message[]>(() => loadState("eco_messages", []));
  const [donationRequests, setDonationRequests] = useState<DonationRequest[]>(() => loadState("eco_donations", []));
  const [payments, setPayments] = useState<Payment[]>(() => loadState("eco_payments", []));
  const [notifications, setNotifications] = useState<Notification[]>(() => loadState("eco_notifications", []));

  // Persist all state
  useEffect(() => { localStorage.setItem("eco_products", JSON.stringify(products)); }, [products]);
  useEffect(() => { localStorage.setItem("eco_users", JSON.stringify(users)); }, [users]);
  useEffect(() => { if (user) localStorage.setItem("eco_user", JSON.stringify(user)); else localStorage.removeItem("eco_user"); }, [user]);
  useEffect(() => { localStorage.setItem("eco_cart", JSON.stringify(cart)); }, [cart]);
  useEffect(() => { localStorage.setItem("eco_orders", JSON.stringify(orders)); }, [orders]);
  useEffect(() => { localStorage.setItem("eco_messages", JSON.stringify(messages)); }, [messages]);
  useEffect(() => { localStorage.setItem("eco_donations", JSON.stringify(donationRequests)); }, [donationRequests]);
  useEffect(() => { localStorage.setItem("eco_payments", JSON.stringify(payments)); }, [payments]);
  useEffect(() => { localStorage.setItem("eco_notifications", JSON.stringify(notifications)); }, [notifications]);

  const addNotification = (userId: string, message: string, type: Notification["type"]) => {
    const n: Notification = { id: Date.now() + Math.random(), userId, message, read: false, type, createdAt: new Date().toISOString() };
    setNotifications((prev) => [n, ...prev]);
  };

  const login = (username: string, password: string) => {
    if (users[username] && users[username] === password) { setUser({ username }); return true; }
    return false;
  };

  const signup = (username: string, password: string) => {
    if (users[username]) return false;
    setUsers((prev) => ({ ...prev, [username]: password }));
    return true;
  };

  const logout = () => setUser(null);

  const addProduct = (product: Omit<Product, "id" | "seller">) => {
    const isDonation = product.type === "Free / Donate";
    const newProduct: Product = {
      ...product,
      id: Date.now(),
      seller: user?.username || "anonymous",
      isDonation,
      price: isDonation ? "0" : product.price,
    };
    setProducts((prev) => [...prev, newProduct]);
  };

  const searchProducts = (keyword: string) =>
    products.filter((p) => p.name.toLowerCase().includes(keyword.toLowerCase()));

  const addToCart = (productId: number) => {
    if (!user) return;
    const product = products.find((p) => p.id === productId);
    if (!product) return;
    const existing = cart.find((c) => c.productId === productId && c.userId === user.username);
    if (existing) {
      setCart((prev) => prev.map((c) => c.id === existing.id ? { ...c, quantity: c.quantity + 1 } : c));
    } else {
      setCart((prev) => [...prev, { id: Date.now(), productId, userId: user.username, quantity: 1, price: product.price }]);
    }
  };

  const removeFromCart = (cartItemId: number) => {
    setCart((prev) => prev.filter((c) => c.id !== cartItemId));
  };

  const clearCart = () => {
    if (!user) return;
    setCart((prev) => prev.filter((c) => c.userId !== user.username));
  };

  const placeOrder = (productId: number, quantity: number): Order => {
    const product = products.find((p) => p.id === productId)!;
    const order: Order = {
      id: Date.now(),
      productId,
      buyerId: user?.username || "anonymous",
      sellerId: product.seller,
      status: "Requested",
      paymentStatus: "Pending",
      quantity,
      totalPrice: String(Number(product.price) * quantity),
      createdAt: new Date().toISOString(),
    };
    setOrders((prev) => [...prev, order]);
    addNotification(product.seller, `New order for "${product.name}" from ${user?.username}`, "order");
    return order;
  };

  const updateOrderStatus = (orderId: number, status: Order["status"]) => {
    setOrders((prev) => prev.map((o) => {
      if (o.id === orderId) {
        addNotification(o.buyerId, `Your order #${orderId} status updated to "${status}"`, "order");
        return { ...o, status };
      }
      return o;
    }));
  };

  const sendMessage = (receiverId: string, productId: number, message: string) => {
    if (!user) return;
    const msg: Message = {
      id: Date.now(),
      senderId: user.username,
      receiverId,
      productId,
      message,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, msg]);
    addNotification(receiverId, `New message from ${user.username}`, "chat");
  };

  const requestDonation = (productId: number, message: string) => {
    if (!user) return;
    const product = products.find((p) => p.id === productId);
    if (!product) return;
    const req: DonationRequest = {
      id: Date.now(),
      productId,
      requesterId: user.username,
      sellerId: product.seller,
      message,
      status: "Pending",
      createdAt: new Date().toISOString(),
    };
    setDonationRequests((prev) => [...prev, req]);
    addNotification(product.seller, `Donation request for "${product.name}" from ${user.username}`, "donation");
  };

  const updateDonationStatus = (requestId: number, status: DonationRequest["status"]) => {
    setDonationRequests((prev) => prev.map((d) => {
      if (d.id === requestId) {
        addNotification(d.requesterId, `Your donation request was ${status.toLowerCase()}`, "donation");
        return { ...d, status };
      }
      return d;
    }));
  };

  const makePayment = (orderId: number, method: string) => {
    if (!user) return;
    const order = orders.find((o) => o.id === orderId);
    if (!order) return;
    const payment: Payment = {
      id: Date.now(),
      orderId,
      buyerId: user.username,
      amount: order.totalPrice,
      method,
      status: "Paid",
      createdAt: new Date().toISOString(),
    };
    setPayments((prev) => [...prev, payment]);
    setOrders((prev) => prev.map((o) => o.id === orderId ? { ...o, paymentStatus: "Paid", status: "Confirmed" } : o));
    addNotification(order.sellerId, `Payment received for order #${orderId}`, "payment");
  };

  const markNotificationRead = (notificationId: number) => {
    setNotifications((prev) => prev.map((n) => n.id === notificationId ? { ...n, read: true } : n));
  };

  const markAllNotificationsRead = () => {
    if (!user) return;
    setNotifications((prev) => prev.map((n) => n.userId === user.username ? { ...n, read: true } : n));
  };

  const getUnreadNotificationCount = () => {
    if (!user) return 0;
    return notifications.filter((n) => n.userId === user.username && !n.read).length;
  };

  return (
    <AppContext.Provider value={{
      user, products, cart, orders, messages, donationRequests, payments, notifications,
      login, signup, logout, addProduct, searchProducts,
      addToCart, removeFromCart, clearCart, placeOrder, updateOrderStatus,
      sendMessage, requestDonation, updateDonationStatus,
      makePayment, markNotificationRead, markAllNotificationsRead, getUnreadNotificationCount,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
