import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { Heart, ShoppingBag, Send } from "lucide-react";

const DonationsPage = () => {
  const { user, products, requestDonation, donationRequests } = useApp();
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const donationProducts = products.filter((p) => p.isDonation && p.seller !== user?.username);

  const handleRequest = (productId: number) => {
    if (!message.trim()) return;
    requestDonation(productId, message);
    setMessage("");
    setSelectedProduct(null);
    setSent(true);
    setTimeout(() => setSent(false), 2000);
  };

  const hasRequested = (productId: number) =>
    donationRequests.some((d) => d.productId === productId && d.requesterId === user?.username);

  return (
    <div className="animate-fade-in">
      <div className="mb-6 flex items-center gap-3">
        <Heart className="h-7 w-7 text-primary" />
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">Donations</h1>
          <p className="text-muted-foreground">Free items available for those in need</p>
        </div>
      </div>

      {sent && (
        <div className="mb-4 rounded-lg bg-primary/10 p-3 text-sm font-medium text-primary">
          ✓ Donation request sent successfully!
        </div>
      )}

      {donationProducts.length === 0 ? (
        <div className="flex min-h-[40vh] flex-col items-center justify-center text-center">
          <Heart className="mb-4 h-16 w-16 text-muted-foreground/40" />
          <h2 className="font-display text-xl font-semibold text-foreground">No donations available</h2>
          <p className="mt-1 text-muted-foreground">Check back later for free items</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {donationProducts.map((p) => (
            <div key={p.id} className="rounded-xl border border-border bg-card shadow-soft overflow-hidden">
              <div className="flex h-40 items-center justify-center bg-secondary">
                {p.image ? (
                  <img src={p.image} alt={p.name} className="h-full w-full object-cover" />
                ) : (
                  <ShoppingBag className="h-12 w-12 text-muted-foreground/40" />
                )}
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-lg font-semibold text-foreground">{p.name}</h3>
                  <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">FREE</span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{p.quality} · by {p.seller}</p>

                {hasRequested(p.id) ? (
                  <p className="mt-3 text-sm font-medium text-primary">✓ Request sent</p>
                ) : selectedProduct === p.id ? (
                  <div className="mt-3 space-y-2">
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Why do you need this item?"
                      className="w-full rounded-lg border border-input bg-background p-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                      rows={3}
                    />
                    <div className="flex gap-2">
                      <button onClick={() => handleRequest(p.id)} className="flex items-center gap-1 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground">
                        <Send className="h-3 w-3" /> Send Request
                      </button>
                      <button onClick={() => setSelectedProduct(null)} className="rounded-lg bg-secondary px-4 py-2 text-xs font-medium text-secondary-foreground">
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setSelectedProduct(p.id)}
                    className="mt-3 w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90"
                  >
                    Request Donation
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DonationsPage;
