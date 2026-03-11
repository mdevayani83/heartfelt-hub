import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { ArrowLeft, ShoppingBag, ShoppingCart, MessageCircle, Phone, Send } from "lucide-react";

const ProductDetail = () => {
  const { id } = useParams();
  const { products, user, addToCart, createPurchaseRequest, getSellerContact } = useApp();
  const navigate = useNavigate();
  const product = products.find((p) => p.id === Number(id));
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [paymentMode, setPaymentMode] = useState<"UPI" | "Cash on Delivery">("Cash on Delivery");
  const [quantity, setQuantity] = useState(1);
  const [requested, setRequested] = useState(false);

  if (!product) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-center">
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground">Product Not Found</h2>
          <Link to="/buyer" className="mt-4 inline-block text-primary hover:underline">← Back to Browse</Link>
        </div>
      </div>
    );
  }

  const sellerContact = user ? getSellerContact(product.seller, product.id) : null;

  const details = [
    { label: "Type", value: product.type },
    { label: "Condition", value: product.condition || product.quality },
    { label: "Size", value: product.size },
    { label: "Quality", value: product.quality },
    { label: "Brand", value: product.company },
    { label: "Location", value: product.location || "N/A" },
    { label: "Seller", value: product.seller },
  ];

  const handleAddToCart = () => {
    addToCart(product.id);
    navigate("/cart");
  };

  const handleBuyNow = () => {
    createPurchaseRequest(product.id, quantity, paymentMode);
    placeOrder(product.id, quantity);
    setRequested(true);
    setShowRequestForm(false);
  };

  return (
    <div className="mx-auto max-w-3xl animate-fade-in">
      <button onClick={() => navigate(-1)} className="mb-6 flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back
      </button>

      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-soft">
        <div className="flex h-64 items-center justify-center bg-secondary sm:h-80">
          {product.image ? (
            <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
          ) : (
            <ShoppingBag className="h-20 w-20 text-muted-foreground/30" />
          )}
        </div>

        <div className="p-6">
          <div className="flex items-center gap-3">
            <h1 className="font-display text-3xl font-bold text-foreground">{product.name}</h1>
            {product.isDonation && <span className="rounded-full bg-primary/10 px-3 py-0.5 text-sm font-semibold text-primary">FREE</span>}
            {product.isSold && <span className="rounded-full bg-destructive/10 px-3 py-0.5 text-sm font-semibold text-destructive">SOLD</span>}
          </div>
          {!product.isDonation && <p className="mt-2 text-3xl font-bold text-primary">₹{product.price}</p>}

          {product.description && (
            <p className="mt-3 text-sm text-muted-foreground">{product.description}</p>
          )}

          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {details.map((d) => (
              <div key={d.label} className="rounded-lg bg-secondary px-4 py-3">
                <span className="block text-xs text-muted-foreground">{d.label}</span>
                <span className="font-medium text-foreground">{d.value}</span>
              </div>
            ))}
          </div>

          {/* Seller contact - shown only after approval */}
          {sellerContact && (
            <div className="mt-4 flex items-center gap-3 rounded-lg border border-primary/20 bg-primary/5 p-4">
              <Phone className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium text-foreground">Seller Contact: {sellerContact}</p>
                <a
                  href={`https://wa.me/91${sellerContact}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 inline-block text-xs font-semibold text-primary hover:underline"
                >
                  💬 Chat on WhatsApp
                </a>
              </div>
            </div>
          )}

          {/* Request success */}
          {requested && (
            <div className="mt-4 rounded-lg bg-primary/10 p-4 text-sm text-primary">
              ✅ Purchase request sent! The seller will review it. You can track it in your dashboard.
            </div>
          )}

          {!product.isSold && (
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              {product.isDonation ? (
                <Link to="/donations"
                  className="flex-1 rounded-lg bg-primary px-4 py-3 text-center text-sm font-semibold text-primary-foreground transition-all hover:opacity-90">
                  Request Donation
                </Link>
              ) : (
                <>
                  <button onClick={handleAddToCart}
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90 active:scale-[0.98]">
                    <ShoppingCart className="h-4 w-4" /> Add to Cart
                  </button>
                  <button onClick={() => setShowRequestForm(!showRequestForm)}
                    className="flex-1 rounded-lg border border-primary bg-primary/5 px-4 py-3 text-center text-sm font-semibold text-primary transition-all hover:bg-primary hover:text-primary-foreground">
                    <Send className="mr-1 inline h-4 w-4" /> Request to Buy
                  </button>
                </>
              )}
              {user && product.seller !== user.username && (
                <Link to={`/chat/${product.seller}/${product.id}`}
                  className="flex items-center justify-center gap-2 rounded-lg bg-secondary px-4 py-3 text-sm font-semibold text-secondary-foreground transition-all hover:bg-primary/10">
                  <MessageCircle className="h-4 w-4" /> Chat with Seller
                </Link>
              )}
            </div>
          )}

          {/* Request to Buy form */}
          {showRequestForm && !product.isSold && (
            <div className="mt-4 rounded-xl border border-border bg-secondary/50 p-4 animate-fade-in">
              <h3 className="mb-3 font-display text-lg font-semibold text-foreground">Purchase Request</h3>
              <div className="space-y-3">
                <div>
                  <label className="mb-1 block text-sm font-medium text-foreground">Quantity</label>
                  <input type="number" min={1} value={quantity} onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-full rounded-lg border border-input bg-background px-4 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-foreground">Payment Mode</label>
                  <select value={paymentMode} onChange={(e) => setPaymentMode(e.target.value as any)}
                    className="w-full rounded-lg border border-input bg-background px-4 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                    <option value="Cash on Delivery">Cash on Delivery (In-person)</option>
                    <option value="UPI">UPI</option>
                  </select>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-card p-3">
                  <span className="text-sm text-muted-foreground">Total</span>
                  <span className="text-lg font-bold text-primary">₹{Number(product.price) * quantity}</span>
                </div>
                <button onClick={handleRequest}
                  className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90">
                  Send Request
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
