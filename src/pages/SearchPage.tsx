import { useState } from "react";
import { Link } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { Search, Package, MapPin, Filter } from "lucide-react";
import type { Product } from "@/context/AppContext";

const CATEGORIES = ["All", "Clothing", "Home", "Accessories", "Fitness", "Electronics", "Books", "Free / Donate"];

const SearchPage = () => {
  const { products } = useApp();
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("All");
  const [location, setLocation] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [results, setResults] = useState<Product[] | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const filtered = products.filter((p) => {
      if (p.isSold) return false;
      if (keyword && !p.name.toLowerCase().includes(keyword.toLowerCase()) && !p.description?.toLowerCase().includes(keyword.toLowerCase())) return false;
      if (category !== "All" && p.type !== category) return false;
      if (location && !p.location?.toLowerCase().includes(location.toLowerCase())) return false;
      const price = Number(p.price);
      if (minPrice && price < Number(minPrice)) return false;
      if (maxPrice && price > Number(maxPrice)) return false;
      return true;
    });
    setResults(filtered);
  };

  return (
    <div className="mx-auto max-w-3xl animate-fade-in">
      <div className="mb-6">
        <h1 className="font-display text-3xl font-bold text-foreground">Search Products</h1>
        <p className="mt-1 text-muted-foreground">Find exactly what you need</p>
      </div>

      <form onSubmit={handleSearch} className="mb-8 space-y-4">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder="Enter product name or description..."
              className="w-full rounded-lg border border-input bg-background py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <button type="submit" className="rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90">Search</button>
        </div>

        <div className="grid gap-3 sm:grid-cols-4 rounded-xl border border-border bg-card p-4 shadow-soft">
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
      </form>

      {results !== null && (
        <div>
          {results.length === 0 ? (
            <div className="flex flex-col items-center py-16 text-center">
              <Package className="mb-4 h-12 w-12 text-muted-foreground/40" />
              <p className="text-muted-foreground">No products found matching your criteria</p>
            </div>
          ) : (
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-muted-foreground">{results.length} result(s)</h3>
              {results.map((p) => (
                <Link key={p.id} to={`/product/${p.id}`}
                  className="flex items-center justify-between rounded-xl border border-border bg-card p-4 shadow-soft transition-all hover:shadow-elevated hover:-translate-y-0.5">
                  <div>
                    <h3 className="font-display text-lg font-semibold text-foreground">{p.name}</h3>
                    <p className="text-sm text-muted-foreground">{p.type} · {p.condition || p.quality} · {p.company}</p>
                    {p.location && (
                      <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground"><MapPin className="h-3 w-3" /> {p.location}</p>
                    )}
                  </div>
                  <span className="text-lg font-bold text-primary">{p.isDonation ? "FREE" : `₹${p.price}`}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchPage;
