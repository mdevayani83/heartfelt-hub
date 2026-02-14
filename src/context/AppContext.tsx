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
}

interface User {
  username: string;
}

interface AppContextType {
  user: User | null;
  products: Product[];
  login: (username: string, password: string) => boolean;
  signup: (username: string, password: string) => boolean;
  logout: () => void;
  addProduct: (product: Omit<Product, "id" | "seller">) => void;
  searchProducts: (keyword: string) => Product[];
}

const AppContext = createContext<AppContextType | null>(null);

const SAMPLE_PRODUCTS: Product[] = [
  { id: 1, name: "Cotton T-Shirt", type: "Clothing", size: "M", quality: "Good", price: "250", company: "EcoWear", image: "", seller: "demo" },
  { id: 2, name: "Denim Jeans", type: "Clothing", size: "32", quality: "Like New", price: "600", company: "GreenThreads", image: "", seller: "demo" },
  { id: 3, name: "Ceramic Mug", type: "Home", size: "Standard", quality: "Excellent", price: "120", company: "EarthCraft", image: "", seller: "demo" },
  { id: 4, name: "Bamboo Water Bottle", type: "Accessories", size: "750ml", quality: "New", price: "350", company: "NatureSip", image: "", seller: "demo" },
  { id: 5, name: "Yoga Mat", type: "Fitness", size: "6mm", quality: "Good", price: "500", company: "ZenFit", image: "", seller: "demo" },
  { id: 6, name: "Wooden Desk Lamp", type: "Home", size: "30cm", quality: "Excellent", price: "800", company: "LightCraft", image: "", seller: "demo" },
];

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem("eco_user");
    return saved ? JSON.parse(saved) : null;
  });

  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem("eco_products");
    return saved ? JSON.parse(saved) : SAMPLE_PRODUCTS;
  });

  const [users, setUsers] = useState<Record<string, string>>(() => {
    const saved = localStorage.getItem("eco_users");
    return saved ? JSON.parse(saved) : { demo: "demo123" };
  });

  useEffect(() => {
    localStorage.setItem("eco_products", JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem("eco_users", JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (user) localStorage.setItem("eco_user", JSON.stringify(user));
    else localStorage.removeItem("eco_user");
  }, [user]);

  const login = (username: string, password: string) => {
    if (users[username] && users[username] === password) {
      setUser({ username });
      return true;
    }
    return false;
  };

  const signup = (username: string, password: string) => {
    if (users[username]) return false;
    setUsers((prev) => ({ ...prev, [username]: password }));
    return true;
  };

  const logout = () => setUser(null);

  const addProduct = (product: Omit<Product, "id" | "seller">) => {
    const newProduct: Product = {
      ...product,
      id: Date.now(),
      seller: user?.username || "anonymous",
    };
    setProducts((prev) => [...prev, newProduct]);
  };

  const searchProducts = (keyword: string) => {
    return products.filter((p) =>
      p.name.toLowerCase().includes(keyword.toLowerCase())
    );
  };

  return (
    <AppContext.Provider value={{ user, products, login, signup, logout, addProduct, searchProducts }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
