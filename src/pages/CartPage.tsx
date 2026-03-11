import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { ShoppingCart, Trash2, Package } from "lucide-react";

const CartPage = () => {
  const { user, cart, products, removeFromCart, clearCart, placeOrder } = useApp();
  const navigate = useNavigate();
  const userCart = cart.filter((c) => c.userId === user?.username);
  const [paymentMode, setPaymentMode] = useState<"UPI" | "Cash on Delivery">("Cash on Delivery");
  const [showCheckout, setShowCheckout] = useState(false);

  const getProduct = (productId: number) => products.find((p) => p.id === productId);
  const total = userCart.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);

  const handleCheckout = () => {
    userCart.forEach((item) => {
      placeOrder(item.productId, item.quantity, paymentMode);
    });
    clearCart();
    navigate("/buyer-dashboard");
  };

  if (userCart.length === 0) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center text-center animate-fade-in">
        <Package className="mb-4 h-16 w-16 text-muted-foreground/40" />
        <h2 className="font-display text-2xl font-bold text-foreground">Your cart is empty</h2>
        <p className="mt-2 text-muted-foreground">Browse items and add them to your cart</p>
        <Link to="/buyer" className="mt-4 rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground">Browse Items</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl animate-fade-in">
      <div className="mb-6 flex items-center gap-3">
        <ShoppingCart className="h-7 w-7 text-primary" />
        <h1 className="font-display text-3xl font-bold text-foreground">Your Cart</h1>
        <span className="rounded-full bg-primary/10 px-3 py-0.5 text-sm font-medium text-primary">{userCart.length} items</span>
      </div>

      <div className="space-y-3">
        {userCart.map((item) => {
          const product = getProduct(item.productId);
          if (!product) return null;
          return (
            <div key={item.id} className="flex items-center justify-between rounded-xl border border-border bg-card p-4 shadow-soft">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-secondary">
                  {product.image ? (
                    <img src={product.image} alt={product.name} className="h-full w-full rounded-lg object-cover" />
                  ) : (
                    <ShoppingCart className="h-6 w-6 text-muted-foreground/40" />
                  )}
                </div>
                <div>
                  <h3 className="font-display font-semibold text-foreground">{product.name}</h3>
                  <p className="text-sm text-muted-foreground">{product.type} · Qty: {item.quantity}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-lg font-bold text-primary">₹{Number(item.price) * item.quantity}</span>
                <button onClick={() => removeFromCart(item.id)} className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 rounded-xl border border-border bg-card p-5 shadow-soft">
        <div className="flex items-center justify-between">
          <span className="text-lg font-medium text-foreground">Total</span>
          <span className="text-2xl font-bold text-primary">₹{total}</span>
        </div>

        {!showCheckout ? (
          <button onClick={() => setShowCheckout(true)}
            className="mt-4 w-full rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90 active:scale-[0.98]">
            Proceed to Checkout
          </button>
        ) : (
          <div className="mt-4 space-y-3 animate-fade-in">
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">Payment Mode</label>
              <select value={paymentMode} onChange={(e) => setPaymentMode(e.target.value as any)}
                className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                <option value="Cash on Delivery">Cash on Delivery (In-person)</option>
                <option value="UPI">UPI</option>
              </select>
            </div>
            <p className="text-xs text-muted-foreground">
              No online payment required. A purchase request will be sent to the seller(s). Payment happens offline ({paymentMode}).
            </p>
            <button onClick={handleCheckout}
              className="w-full rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90 active:scale-[0.98]">
              Send Purchase Request
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
