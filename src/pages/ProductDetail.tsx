import { useParams, Link, useNavigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { ArrowLeft, ShoppingBag } from "lucide-react";

const ProductDetail = () => {
  const { id } = useParams();
  const { products } = useApp();
  const navigate = useNavigate();
  const product = products.find((p) => p.id === Number(id));

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

  const details = [
    { label: "Type", value: product.type },
    { label: "Size", value: product.size },
    { label: "Quality", value: product.quality },
    { label: "Brand", value: product.company },
    { label: "Seller", value: product.seller },
  ];

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
          <h1 className="font-display text-3xl font-bold text-foreground">{product.name}</h1>
          <p className="mt-2 text-3xl font-bold text-primary">₹{product.price}</p>

          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {details.map((d) => (
              <div key={d.label} className="rounded-lg bg-secondary px-4 py-3">
                <span className="block text-xs text-muted-foreground">{d.label}</span>
                <span className="font-medium text-foreground">{d.value}</span>
              </div>
            ))}
          </div>

          <Link
            to={`/buy/${product.id}`}
            className="mt-6 block w-full rounded-lg bg-primary px-4 py-3 text-center text-sm font-semibold text-primary-foreground transition-all hover:opacity-90 active:scale-[0.98]"
          >
            Buy Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
