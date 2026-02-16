import { useParams, Link, useNavigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { ArrowLeft, ShoppingBag, ShoppingCart, MessageCircle } from "lucide-react";

const ProductDetail = () => {
  const { id } = useParams();
  const { products, user, addToCart } = useApp();
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

  const handleAddToCart = () => {
    addToCart(product.id);
    navigate("/cart");
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
            {product.isDonation && (
              <span className="rounded-full bg-primary/10 px-3 py-0.5 text-sm font-semibold text-primary">FREE</span>
            )}
          </div>
          {!product.isDonation && <p className="mt-2 text-3xl font-bold text-primary">₹{product.price}</p>}

          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {details.map((d) => (
              <div key={d.label} className="rounded-lg bg-secondary px-4 py-3">
                <span className="block text-xs text-muted-foreground">{d.label}</span>
                <span className="font-medium text-foreground">{d.value}</span>
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            {product.isDonation ? (
              <Link
                to={`/donations`}
                className="flex-1 rounded-lg bg-primary px-4 py-3 text-center text-sm font-semibold text-primary-foreground transition-all hover:opacity-90"
              >
                Request Donation
              </Link>
            ) : (
              <>
                <button
                  onClick={handleAddToCart}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90 active:scale-[0.98]"
                >
                  <ShoppingCart className="h-4 w-4" /> Add to Cart
                </button>
                <Link
                  to={`/buy/${product.id}`}
                  className="flex-1 rounded-lg border border-primary bg-primary/5 px-4 py-3 text-center text-sm font-semibold text-primary transition-all hover:bg-primary hover:text-primary-foreground"
                >
                  Buy Now
                </Link>
              </>
            )}
            {user && product.seller !== user.username && (
              <Link
                to={`/chat/${product.seller}/${product.id}`}
                className="flex items-center justify-center gap-2 rounded-lg bg-secondary px-4 py-3 text-sm font-semibold text-secondary-foreground transition-all hover:bg-primary/10"
              >
                <MessageCircle className="h-4 w-4" /> Chat with Seller
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
