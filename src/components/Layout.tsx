import { Link, useLocation, useNavigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { Leaf, LogOut, ShoppingBag, Upload, Search, Info, Home, ShoppingCart, LayoutDashboard, Bell, Heart } from "lucide-react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { user, logout, getUnreadNotificationCount, cart } = useApp();
  const location = useLocation();
  const navigate = useNavigate();

  const isAuthPage = ["/signup", "/login"].includes(location.pathname);
  if (isAuthPage) return <>{children}</>;

  const unreadCount = getUnreadNotificationCount();
  const cartCount = user ? cart.filter((c) => c.userId === user.username).length : 0;

  const navItems = [
    { to: "/", label: "Home", icon: Home },
    { to: "/seller", label: "Sell", icon: Upload },
    { to: "/buyer", label: "Browse", icon: ShoppingBag },
    { to: "/donations", label: "Donate", icon: Heart },
    { to: "/search", label: "Search", icon: Search },
    { to: "/about", label: "About", icon: Info },
  ];

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="container mx-auto flex items-center justify-between px-4 py-3">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Leaf className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-display text-xl font-bold text-foreground">
              Eco Swap Hub
            </span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => {
              const active = location.pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                    active
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            {user ? (
              <>
                <Link to="/cart" className="relative rounded-md p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
                  <ShoppingCart className="h-5 w-5" />
                  {cartCount > 0 && (
                    <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                      {cartCount}
                    </span>
                  )}
                </Link>
                <Link to="/notifications" className="relative rounded-md p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
                      {unreadCount}
                    </span>
                  )}
                </Link>
                <div className="hidden items-center gap-1 sm:flex">
                  <Link to="/buyer-dashboard" className="rounded-md px-2 py-1.5 text-xs font-medium text-muted-foreground hover:bg-secondary hover:text-foreground">
                    <LayoutDashboard className="mr-1 inline h-3.5 w-3.5" />Buyer
                  </Link>
                  <Link to="/seller-dashboard" className="rounded-md px-2 py-1.5 text-xs font-medium text-muted-foreground hover:bg-secondary hover:text-foreground">
                    <LayoutDashboard className="mr-1 inline h-3.5 w-3.5" />Seller
                  </Link>
                </div>
                <span className="hidden text-sm text-muted-foreground lg:inline">
                  Hi, <span className="font-semibold text-foreground">{user.username}</span>
                </span>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 rounded-md bg-secondary px-3 py-2 text-sm font-medium text-secondary-foreground transition-colors hover:bg-destructive hover:text-destructive-foreground"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="rounded-md bg-secondary px-3 py-2 text-sm font-medium text-secondary-foreground transition-colors hover:bg-secondary/80">
                  Login
                </Link>
                <Link to="/signup" className="rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition-colors hover:opacity-90">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile nav */}
        <nav className="flex gap-1 overflow-x-auto border-t border-border px-4 py-2 md:hidden">
          {navItems.map((item) => {
            const active = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex shrink-0 items-center gap-1 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                  active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary"
                }`}
              >
                <item.icon className="h-3.5 w-3.5" />
                {item.label}
              </Link>
            );
          })}
          {user && (
            <>
              <Link to="/buyer-dashboard" className="flex shrink-0 items-center gap-1 rounded-md px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-secondary">
                <LayoutDashboard className="h-3.5 w-3.5" /> Dashboard
              </Link>
            </>
          )}
        </nav>
      </header>

      <main className="container mx-auto px-4 py-8">{children}</main>

      <footer className="border-t border-border bg-card py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2026 Eco Swap Hub — Promoting Sustainable Living</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
