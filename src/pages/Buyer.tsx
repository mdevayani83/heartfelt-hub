import { useState } from "react";
import { Link } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { ShoppingBag, Package, Heart, Filter, MapPin } from "lucide-react";

const CATEGORIES = ["All", "Clothing", "Home", "Accessories", "Fitness", "Electronics", "Books"];

const Buyer = () => {
  const { products } = useApp();
  const [category, setCategory] = useState("All");
  const [location, setLocation] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const regularProducts = products.filter((p) => !p.isDonation && !p.isSold);
  const donationProducts = products.filter((p) => p.isDonation && !p.isSold);

  const filtered = regularProducts.filter((p) => {
    if (category !== "All" && p.type !== category) return false;
    if (location && !p.location?.toLowerCase().includes(location.toLowerCase())) return false;
    const price = Number(p.price);
    if (minPrice && price < Number(minPrice)) return false;
    if (maxPrice && price > Number(maxPrice)) return false;
    return true;
  });

  return (
    <div className="animate-fade-in">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">Available Products</h1>
          <p className="mt-1 text-muted-foreground">{filtered.length} items available</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-1 rounded-lg bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground transition-colors hover:bg-primary hover:text-primary-foreground">
            <Filter className="h-4 w-4" /> Filters
          </button>
          <Link to="/donations"
            className="rounded-lg bg-primary/10 px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary hover:text-primary-foreground">
            <Heart className="mr-1 inline h-4 w-4" /> Donations
          </Link>
        </div>
      </div>

      {/* Filters panel */}
      {showFilters && (
        <div className="mb-6 rounded-xl border border-border bg-card p-4 shadow-soft animate-fade-in">
          <div className="grid gap-3 sm:grid-cols-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">Location</label>
              <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. Mumbai"
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">Min Price (₹)</label>
              <input type="number" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} placeholder="0"
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">Max Price (₹)</label>
              <input type="number" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} placeholder="10000"
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
          </div>
          <button onClick={() => { setCategory("All"); setLocation(""); setMinPrice(""); setMaxPrice(""); }}
            className="mt-3 text-xs font-medium text-primary hover:underline">Clear all filters</button>
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="flex min-h-[40vh] flex-col items-center justify-center text-center">
          <Package className="mb-4 h-16 w-16 text-muted-foreground/50" />
          <h2 className="font-display text-xl font-semibold text-foreground">No products found</h2>
          <p className="mt-1 text-muted-foreground">Try adjusting your filters</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <Link key={p.id} to={`/product/${p.id}`}
              className="group overflow-hidden rounded-xl border border-border bg-card shadow-soft transition-all hover:shadow-elevated hover:-translate-y-0.5">
              <div className="flex h-40 items-center justify-center bg-secondary">
                {p.image ? (
                  <img src={p.image} alt={p.name} className="h-full w-full object-cover" />
                ) : (
                  <ShoppingBag className="h-12 w-12 text-muted-foreground/40" />
                )}
              </div>
              <div className="p-4">
                <h3 className="font-display text-lg font-semibold text-foreground group-hover:text-primary transition-colors">{p.name}</h3>
                <p className="text-sm text-muted-foreground">{p.type} · {p.condition || p.quality}</p>
                {p.location && (
                  <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" /> {p.location}
                  </p>
                )}
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-lg font-bold text-primary">₹{p.price}</span>
                  <span className="text-xs text-muted-foreground">{p.company}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

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
              <Link key={p.id} to={`/product/${p.id}`}
                className="group overflow-hidden rounded-xl border border-primary/20 bg-card shadow-soft transition-all hover:shadow-elevated hover:-translate-y-0.5">
                <div className="flex h-40 items-center justify-center bg-primary/5">
                  {p.image ? (
                    <img src={p.image} alt={p.name} className="h-full w-full object-cover" />
                  ) : (
                    <Heart className="h-12 w-12 text-primary/30" />
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-display text-lg font-semibold text-foreground group-hover:text-primary transition-colors">{p.name}</h3>
                  <p className="text-sm text-muted-foreground">{p.condition || p.quality} · by {p.seller}</p>
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
