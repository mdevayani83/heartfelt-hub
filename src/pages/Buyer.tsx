import { Link } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { ShoppingBag, Package, Heart } from "lucide-react";

const Buyer = () => {
  const { products, user } = useApp();

  const regularProducts = products.filter((p) => !p.isDonation);
  const donationProducts = products.filter((p) => p.isDonation);

  return (
    <div className="animate-fade-in">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">Available Products</h1>
          <p className="mt-1 text-muted-foreground">{regularProducts.length} items available for swap</p>
        </div>
        <div className="flex gap-2">
          <Link
            to="/donations"
            className="rounded-lg bg-primary/10 px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
          >
            <Heart className="mr-1 inline h-4 w-4" /> Donations
          </Link>
          <Link
            to="/search"
            className="rounded-lg bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
          >
            Search
          </Link>
        </div>
      </div>

      {regularProducts.length === 0 ? (
        <div className="flex min-h-[40vh] flex-col items-center justify-center text-center">
          <Package className="mb-4 h-16 w-16 text-muted-foreground/50" />
          <h2 className="font-display text-xl font-semibold text-foreground">No products yet</h2>
          <p className="mt-1 text-muted-foreground">Be the first to list an item!</p>
          <Link to="/seller" className="mt-4 rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground">
            Sell an Item
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {regularProducts.map((p) => (
            <Link
              key={p.id}
              to={`/product/${p.id}`}
              className="group overflow-hidden rounded-xl border border-border bg-card shadow-soft transition-all hover:shadow-elevated hover:-translate-y-0.5"
            >
              <div className="flex h-40 items-center justify-center bg-secondary">
                {p.image ? (
                  <img src={p.image} alt={p.name} className="h-full w-full object-cover" />
                ) : (
                  <ShoppingBag className="h-12 w-12 text-muted-foreground/40" />
                )}
              </div>
              <div className="p-4">
                <h3 className="font-display text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                  {p.name}
                </h3>
                <p className="text-sm text-muted-foreground">{p.type} · {p.quality}</p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-lg font-bold text-primary">₹{p.price}</span>
                  <span className="text-xs text-muted-foreground">{p.company}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Donation section preview */}
      {donationProducts.length > 0 && (
        <div className="mt-12">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-primary" />
              <h2 className="font-display text-2xl font-bold text-foreground">Free Donations</h2>
            </div>
            <Link to="/donations" className="text-sm font-medium text-primary hover:underline">View all →</Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {donationProducts.slice(0, 3).map((p) => (
              <Link
                key={p.id}
                to={`/product/${p.id}`}
                className="group overflow-hidden rounded-xl border border-primary/20 bg-card shadow-soft transition-all hover:shadow-elevated hover:-translate-y-0.5"
              >
                <div className="flex h-40 items-center justify-center bg-primary/5">
                  {p.image ? (
                    <img src={p.image} alt={p.name} className="h-full w-full object-cover" />
                  ) : (
                    <Heart className="h-12 w-12 text-primary/30" />
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-display text-lg font-semibold text-foreground group-hover:text-primary transition-colors">{p.name}</h3>
                  <p className="text-sm text-muted-foreground">{p.quality} · by {p.seller}</p>
                  <span className="mt-2 inline-block rounded-full bg-primary/10 px-3 py-0.5 text-xs font-semibold text-primary">FREE</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Buyer;
