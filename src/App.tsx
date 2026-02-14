import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider, useApp } from "@/context/AppContext";
import Layout from "@/components/Layout";
import Signup from "@/pages/Signup";
import Login from "@/pages/Login";
import HomePage from "@/pages/HomePage";
import Seller from "@/pages/Seller";
import Buyer from "@/pages/Buyer";
import ProductDetail from "@/pages/ProductDetail";
import Buy from "@/pages/Buy";
import SearchPage from "@/pages/SearchPage";
import About from "@/pages/About";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useApp();
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const AppRoutes = () => (
  <Layout>
    <Routes>
      <Route path="/" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
      <Route path="/seller" element={<ProtectedRoute><Seller /></ProtectedRoute>} />
      <Route path="/buyer" element={<ProtectedRoute><Buyer /></ProtectedRoute>} />
      <Route path="/product/:id" element={<ProtectedRoute><ProductDetail /></ProtectedRoute>} />
      <Route path="/buy/:id" element={<ProtectedRoute><Buy /></ProtectedRoute>} />
      <Route path="/search" element={<ProtectedRoute><SearchPage /></ProtectedRoute>} />
      <Route path="/about" element={<ProtectedRoute><About /></ProtectedRoute>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </Layout>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AppProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AppProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
