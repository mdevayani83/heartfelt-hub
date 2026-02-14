import { useState } from "react";
import { Link } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { Search, Package } from "lucide-react";
import type { Product } from "@/context/AppContext";

const SearchPage = () => {
  const { searchProducts } = useApp();
  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState<Product[] | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setResults(searchProducts(keyword));
  };

  return (
    <div className="mx-auto max-w-2xl animate-fade-in">
      <div className="mb-6">
        <h1 className="font-display text-3xl font-bold text-foreground">Search Products</h1>
        <p className="mt-1 text-muted-foreground">Find the items you're looking for</p>
      </div>

      <form onSubmit={handleSearch} className="mb-8 flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Enter product name..."
            required
            className="w-full rounded-lg border border-input bg-background py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <button
          type="submit"
          className="rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90"
        >
          Search
        </button>
      </form>

      {results !== null && (
        <div>
          {results.length === 0 ? (
            <div className="flex flex-col items-center py-16 text-center">
              <Package className="mb-4 h-12 w-12 text-muted-foreground/40" />
              <p className="text-muted-foreground">No products found for "{keyword}"</p>
            </div>
          ) : (
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-muted-foreground">{results.length} result(s)</h3>
              {results.map((p) => (
                <Link
                  key={p.id}
                  to={`/product/${p.id}`}
                  className="flex items-center justify-between rounded-xl border border-border bg-card p-4 shadow-soft transition-all hover:shadow-elevated hover:-translate-y-0.5"
                >
                  <div>
                    <h3 className="font-display text-lg font-semibold text-foreground">{p.name}</h3>
                    <p className="text-sm text-muted-foreground">{p.type} · {p.company}</p>
                  </div>
                  <span className="text-lg font-bold text-primary">₹{p.price}</span>
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
