import { useState } from "react";
import { Link } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { ShoppingCart, Package, MessageCircle, Heart, Clock, CheckCircle, Truck, Box, Send } from "lucide-react";

const statusIcons: Record<string, any> = {
  Requested: Clock, Confirmed: CheckCircle, Shipped: Truck, Delivered: Box,
};

const BuyerDashboard = () => {
  const { user, orders, products, messages, donationRequests, purchaseRequests, cart } = useApp();
  const [tab, setTab] = useState<"requests" | "orders" | "cart" | "messages" | "donations">("requests");

  const myRequests = purchaseRequests.filter((r) => r.buyerId === user?.username);
  const myOrders = orders.filter((o) => o.buyerId === user?.username);
  const myCart = cart.filter((c) => c.userId === user?.username);
  const myMessages = messages.filter((m) => m.senderId === user?.username || m.receiverId === user?.username);
  const myDonations = donationRequests.filter((d) => d.requesterId === user?.username);

  const getProduct = (id: number) => products.find((p) => p.id === id);

  const tabs = [
    { key: "requests", label: "Buy Requests", icon: Send, count: myRequests.length },
    { key: "orders", label: "Orders", icon: Package, count: myOrders.length },
    { key: "cart", label: "Cart", icon: ShoppingCart, count: myCart.length },
    { key: "messages", label: "Messages", icon: MessageCircle, count: myMessages.length },
    { key: "donations", label: "Donations", icon: Heart, count: myDonations.length },
  ] as const;

  return (
    <div className="animate-fade-in">
      <h1 className="mb-6 font-display text-3xl font-bold text-foreground">Buyer Dashboard</h1>

      <div className="mb-6 flex gap-2 overflow-x-auto">
        {tabs.map((t) => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`flex shrink-0 items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
              tab === t.key ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-primary/10"
            }`}>
            <t.icon className="h-4 w-4" />
            {t.label}
            {t.count > 0 && (
              <span className={`rounded-full px-2 py-0.5 text-xs ${tab === t.key ? "bg-primary-foreground/20" : "bg-primary/10 text-primary"}`}>
                {t.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Purchase Requests */}
      {tab === "requests" && (
        <div className="space-y-3">
          {myRequests.length === 0 ? (
            <p className="py-12 text-center text-muted-foreground">No purchase requests. <Link to="/buyer" className="text-primary hover:underline">Browse items</Link></p>
          ) : (
            myRequests.map((req) => {
              const product = getProduct(req.productId);
              return (
                <div key={req.id} className="rounded-xl border border-border bg-card p-4 shadow-soft">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-display font-semibold text-foreground">{product?.name || "Unknown"}</h3>
                      <p className="text-sm text-muted-foreground">Seller: {req.sellerId} · Qty: {req.quantity} · {req.paymentMode}</p>
                      <p className="text-xs text-muted-foreground">{new Date(req.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-bold text-primary">₹{req.totalPrice}</span>
                      <span className={`ml-2 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        req.status === "Approved" ? "bg-primary/10 text-primary" :
                        req.status === "Rejected" ? "bg-destructive/10 text-destructive" :
                        req.status === "Completed" ? "bg-primary/10 text-primary" :
                        "bg-accent/10 text-accent-foreground"
                      }`}>{req.status}</span>
                    </div>
                  </div>
                  {req.status === "Approved" && (
                    <p className="mt-2 text-sm text-primary">✅ Approved! View the product page for seller contact details.</p>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Orders */}
      {tab === "orders" && (
        <div className="space-y-3">
          {myOrders.length === 0 ? (
            <p className="py-12 text-center text-muted-foreground">No orders yet. <Link to="/buyer" className="text-primary hover:underline">Browse items</Link></p>
          ) : (
            myOrders.map((order) => {
              const product = getProduct(order.productId);
              const StatusIcon = statusIcons[order.status] || Clock;
              return (
                <div key={order.id} className="rounded-xl border border-border bg-card p-4 shadow-soft">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-display font-semibold text-foreground">{product?.name || "Unknown"}</h3>
                      <p className="text-sm text-muted-foreground">Order #{order.id} · {new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    <span className="text-lg font-bold text-primary">₹{order.totalPrice}</span>
                  </div>
                  <div className="mt-3 flex items-center gap-4">
                    <div className="flex items-center gap-1.5">
                      <StatusIcon className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium text-foreground">{order.status}</span>
                    </div>
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      order.paymentStatus === "Paid" ? "bg-primary/10 text-primary" : "bg-accent/10 text-accent-foreground"
                    }`}>{order.paymentStatus}</span>
                    {order.paymentStatus === "Pending" && (
                      <Link to={`/payment/${order.id}`} className="text-sm font-medium text-primary hover:underline">Pay Now</Link>
                    )}
                  </div>
                  <div className="mt-4 flex items-center gap-1">
                    {["Requested", "Confirmed", "Shipped", "Delivered"].map((s, i) => {
                      const currentIdx = ["Requested", "Confirmed", "Shipped", "Delivered"].indexOf(order.status);
                      return <div key={s} className={`h-2 flex-1 rounded-full ${i <= currentIdx ? "bg-primary" : "bg-border"}`} />;
                    })}
                  </div>
                  <div className="mt-1 flex justify-between text-[10px] text-muted-foreground">
                    <span>Requested</span><span>Confirmed</span><span>Shipped</span><span>Delivered</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {tab === "cart" && (
        <div>
          {myCart.length === 0 ? (
            <p className="py-12 text-center text-muted-foreground">Cart is empty. <Link to="/buyer" className="text-primary hover:underline">Browse items</Link></p>
          ) : (
            <Link to="/cart" className="inline-block rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground">
              View Full Cart ({myCart.length} items)
            </Link>
          )}
        </div>
      )}

      {tab === "messages" && (
        <div className="space-y-3">
          {myMessages.length === 0 ? (
            <p className="py-12 text-center text-muted-foreground">No messages yet</p>
          ) : (
            myMessages.slice().reverse().map((msg) => {
              const product = getProduct(msg.productId);
              const isSent = msg.senderId === user?.username;
              return (
                <div key={msg.id} className="rounded-xl border border-border bg-card p-4 shadow-soft">
                  <div className="flex items-center justify-between text-sm">
                    <span className={`font-medium ${isSent ? "text-primary" : "text-foreground"}`}>
                      {isSent ? `To: ${msg.receiverId}` : `From: ${msg.senderId}`}
                    </span>
                    <span className="text-xs text-muted-foreground">{new Date(msg.timestamp).toLocaleString()}</span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">Re: {product?.name || "Product"}</p>
                  <p className="mt-2 text-foreground">{msg.message}</p>
                  {!isSent && (
                    <Link to={`/chat/${msg.senderId}/${msg.productId}`} className="mt-2 inline-block text-sm font-medium text-primary hover:underline">Reply</Link>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {tab === "donations" && (
        <div className="space-y-3">
          {myDonations.length === 0 ? (
            <p className="py-12 text-center text-muted-foreground">No donation requests. <Link to="/donations" className="text-primary hover:underline">View donations</Link></p>
          ) : (
            myDonations.map((d) => {
              const product = getProduct(d.productId);
              return (
                <div key={d.id} className="rounded-xl border border-border bg-card p-4 shadow-soft">
                  <h3 className="font-display font-semibold text-foreground">{product?.name || "Unknown"}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{d.message}</p>
                  <span className={`mt-2 inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    d.status === "Approved" ? "bg-primary/10 text-primary" : d.status === "Rejected" ? "bg-destructive/10 text-destructive" : "bg-accent/10 text-accent-foreground"
                  }`}>{d.status}</span>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

export default BuyerDashboard;
