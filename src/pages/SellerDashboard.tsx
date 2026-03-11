import { useState } from "react";
import { Link } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { Package, ShoppingBag, MessageCircle, Heart, Clock, CheckCircle, Truck, Box, Edit, Trash2, Tag, Send } from "lucide-react";

const SellerDashboard = () => {
  const { user, products, orders, messages, donationRequests, purchaseRequests, updateOrderStatus, updateDonationStatus, updatePurchaseRequestStatus, editProduct, deleteProduct, markProductSold } = useApp();
  const [tab, setTab] = useState<"products" | "requests" | "orders" | "messages" | "donations">("requests");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<any>({});

  const myProducts = products.filter((p) => p.seller === user?.username);
  const myRequests = purchaseRequests.filter((r) => r.sellerId === user?.username);
  const myOrders = orders.filter((o) => o.sellerId === user?.username);
  const myMessages = messages.filter((m) => m.receiverId === user?.username || m.senderId === user?.username);
  const myDonations = donationRequests.filter((d) => d.sellerId === user?.username);

  const getProduct = (id: number) => products.find((p) => p.id === id);

  const statusFlow: Array<"Requested" | "Confirmed" | "Shipped" | "Delivered"> = ["Requested", "Confirmed", "Shipped", "Delivered"];
  const nextStatus = (current: string) => {
    const idx = statusFlow.indexOf(current as any);
    return idx < statusFlow.length - 1 ? statusFlow[idx + 1] : null;
  };

  const startEdit = (p: any) => {
    setEditingId(p.id);
    setEditForm({ name: p.name, price: p.price, description: p.description || "", location: p.location || "" });
  };

  const saveEdit = () => {
    if (editingId) {
      editProduct(editingId, editForm);
      setEditingId(null);
    }
  };

  const tabs = [
    { key: "requests", label: "Buy Requests", icon: Send, count: myRequests.filter((r) => r.status === "Pending").length },
    { key: "orders", label: "Orders", icon: Package, count: myOrders.length },
    { key: "products", label: "Products", icon: ShoppingBag, count: myProducts.length },
    { key: "messages", label: "Messages", icon: MessageCircle, count: myMessages.length },
    { key: "donations", label: "Donations", icon: Heart, count: myDonations.length },
  ] as const;

  return (
    <div className="animate-fade-in">
      <h1 className="mb-6 font-display text-3xl font-bold text-foreground">Seller Dashboard</h1>

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

      {/* Buy Requests */}
      {tab === "requests" && (
        <div className="space-y-3">
          {myRequests.length === 0 ? (
            <p className="py-12 text-center text-muted-foreground">No purchase requests yet</p>
          ) : (
            myRequests.map((req) => {
              const product = getProduct(req.productId);
              return (
                <div key={req.id} className="rounded-xl border border-border bg-card p-4 shadow-soft">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-display font-semibold text-foreground">{product?.name || "Unknown"}</h3>
                      <p className="text-sm text-muted-foreground">Buyer: {req.buyerId} · Qty: {req.quantity} · {req.paymentMode}</p>
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
                  {req.status === "Pending" && (
                    <div className="mt-3 flex gap-2">
                      <button onClick={() => updatePurchaseRequestStatus(req.id, "Approved")}
                        className="rounded-lg bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground">Approve</button>
                      <button onClick={() => updatePurchaseRequestStatus(req.id, "Rejected")}
                        className="rounded-lg bg-destructive px-4 py-1.5 text-xs font-semibold text-destructive-foreground">Reject</button>
                      <Link to={`/chat/${req.buyerId}/${req.productId}`}
                        className="rounded-lg bg-secondary px-4 py-1.5 text-xs font-semibold text-secondary-foreground hover:bg-secondary/80">Chat</Link>
                    </div>
                  )}
                  {req.status === "Approved" && (
                    <div className="mt-3">
                      <button onClick={() => updatePurchaseRequestStatus(req.id, "Completed")}
                        className="rounded-lg bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground">Mark Completed</button>
                    </div>
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
            <p className="py-12 text-center text-muted-foreground">No incoming orders yet</p>
          ) : (
            myOrders.map((order) => {
              const product = getProduct(order.productId);
              const next = nextStatus(order.status);
              return (
                <div key={order.id} className="rounded-xl border border-border bg-card p-4 shadow-soft">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-display font-semibold text-foreground">{product?.name || "Unknown"}</h3>
                      <p className="text-sm text-muted-foreground">Buyer: {order.buyerId} · #{order.id}</p>
                    </div>
                    <span className="text-lg font-bold text-primary">₹{order.totalPrice}</span>
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-3">
                    <span className="flex items-center gap-1 text-sm font-medium text-foreground">
                      <Clock className="h-4 w-4 text-primary" /> {order.status}
                    </span>
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      order.paymentStatus === "Paid" ? "bg-primary/10 text-primary" : "bg-accent/10 text-accent-foreground"
                    }`}>{order.paymentStatus}</span>
                    {next && (
                      <button onClick={() => updateOrderStatus(order.id, next)}
                        className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground transition-all hover:opacity-90">
                        Mark as {next}
                      </button>
                    )}
                  </div>
                  <div className="mt-3 flex items-center gap-1">
                    {statusFlow.map((s, i) => {
                      const currentIdx = statusFlow.indexOf(order.status);
                      return <div key={s} className={`h-1.5 flex-1 rounded-full ${i <= currentIdx ? "bg-primary" : "bg-border"}`} />;
                    })}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Products */}
      {tab === "products" && (
        <div className="space-y-3">
          {myProducts.length === 0 ? (
            <p className="py-12 text-center text-muted-foreground">No products listed. <Link to="/seller" className="text-primary hover:underline">Upload one</Link></p>
          ) : (
            myProducts.map((p) => (
              <div key={p.id} className="rounded-xl border border-border bg-card p-4 shadow-soft">
                {editingId === p.id ? (
                  <div className="space-y-3">
                    <input value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
                    <input type="number" value={editForm.price} onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                      className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
                    <input value={editForm.location} onChange={(e) => setEditForm({ ...editForm, location: e.target.value })} placeholder="Location"
                      className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
                    <textarea value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} placeholder="Description"
                      className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none" rows={2} />
                    <div className="flex gap-2">
                      <button onClick={saveEdit} className="rounded-lg bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground">Save</button>
                      <button onClick={() => setEditingId(null)} className="rounded-lg bg-secondary px-4 py-1.5 text-xs font-semibold text-secondary-foreground">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-display font-semibold text-foreground">{p.name}</h3>
                        {p.isSold && <span className="rounded-full bg-destructive/10 px-2 py-0.5 text-xs font-medium text-destructive">SOLD</span>}
                      </div>
                      <p className="text-sm text-muted-foreground">{p.type} · {p.condition || p.quality} {p.location ? `· ${p.location}` : ""}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-primary">{p.isDonation ? "Free" : `₹${p.price}`}</span>
                      {!p.isSold && (
                        <>
                          <button onClick={() => startEdit(p)} className="rounded-md p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground" title="Edit">
                            <Edit className="h-4 w-4" />
                          </button>
                          <button onClick={() => markProductSold(p.id)} className="rounded-md p-1.5 text-muted-foreground hover:bg-primary/10 hover:text-primary" title="Mark as Sold">
                            <Tag className="h-4 w-4" />
                          </button>
                        </>
                      )}
                      <button onClick={() => deleteProduct(p.id)} className="rounded-md p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive" title="Delete">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
          <Link to="/seller" className="mt-4 inline-block rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground">
            + Upload Product
          </Link>
        </div>
      )}

      {/* Messages */}
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

      {/* Donations */}
      {tab === "donations" && (
        <div className="space-y-3">
          {myDonations.length === 0 ? (
            <p className="py-12 text-center text-muted-foreground">No donation requests</p>
          ) : (
            myDonations.map((d) => {
              const product = getProduct(d.productId);
              return (
                <div key={d.id} className="rounded-xl border border-border bg-card p-4 shadow-soft">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-display font-semibold text-foreground">{product?.name || "Unknown"}</h3>
                      <p className="text-sm text-muted-foreground">From: {d.requesterId}</p>
                    </div>
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      d.status === "Approved" ? "bg-primary/10 text-primary" : d.status === "Rejected" ? "bg-destructive/10 text-destructive" : "bg-accent/10 text-accent-foreground"
                    }`}>{d.status}</span>
                  </div>
                  <p className="mt-2 text-sm text-foreground italic">"{d.message}"</p>
                  {d.status === "Pending" && (
                    <div className="mt-3 flex gap-2">
                      <button onClick={() => updateDonationStatus(d.id, "Approved")} className="rounded-lg bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground">Approve</button>
                      <button onClick={() => updateDonationStatus(d.id, "Rejected")} className="rounded-lg bg-destructive px-4 py-1.5 text-xs font-semibold text-destructive-foreground">Reject</button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

export default SellerDashboard;
