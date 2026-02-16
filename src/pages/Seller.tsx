import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { Upload, CheckCircle } from "lucide-react";

const PRODUCT_TYPES = ["Clothing", "Home", "Accessories", "Fitness", "Electronics", "Books", "Free / Donate"];

const Seller = () => {
  const { addProduct } = useApp();
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "", type: "", size: "", quality: "", price: "", company: "", image: "",
  });

  const isDonation = form.type === "Free / Donate";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setForm((prev) => ({ ...prev, image: reader.result as string }));
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addProduct({ ...form, price: isDonation ? "0" : form.price });
    setSubmitted(true);
    setTimeout(() => navigate("/buyer"), 1500);
  };

  if (submitted) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="animate-fade-in text-center">
          <CheckCircle className="mx-auto mb-4 h-16 w-16 text-primary" />
          <h2 className="font-display text-2xl font-bold text-foreground">Product Listed!</h2>
          <p className="mt-2 text-muted-foreground">Redirecting to browse page...</p>
        </div>
      </div>
    );
  }

  const fields = [
    { name: "name", label: "Product Name", placeholder: "e.g. Cotton T-Shirt", type: "input" },
    { name: "size", label: "Size", placeholder: "e.g. M, L, 32", type: "input" },
    { name: "quality", label: "Quality", placeholder: "e.g. Good, Like New", type: "input" },
    { name: "company", label: "Brand / Company", placeholder: "e.g. EcoWear", type: "input" },
  ];

  return (
    <div className="mx-auto max-w-2xl animate-fade-in">
      <div className="mb-6">
        <h1 className="font-display text-3xl font-bold text-foreground">Upload Product</h1>
        <p className="mt-1 text-muted-foreground">List an item for others to swap, purchase, or donate</p>
      </div>

      <div className="rounded-xl border border-border bg-card p-6 shadow-soft">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            {fields.map((f) => (
              <div key={f.name}>
                <label className="mb-1 block text-sm font-medium text-foreground">{f.label}</label>
                <input
                  name={f.name}
                  value={(form as any)[f.name]}
                  onChange={handleChange}
                  placeholder={f.placeholder}
                  required
                  className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            ))}

            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">Product Type</label>
              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">Select type...</option>
                {PRODUCT_TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            {!isDonation && (
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">Price (₹)</label>
                <input
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  placeholder="e.g. 500"
                  required={!isDonation}
                  type="number"
                  min="1"
                  className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            )}
          </div>

          {isDonation && (
            <div className="rounded-lg bg-primary/10 p-3 text-sm text-primary">
              🎁 This item will be listed for free in the Donations section
            </div>
          )}

          <div>
            <label className="mb-1 block text-sm font-medium text-foreground">Product Image</label>
            <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-input bg-background px-4 py-8 text-sm text-muted-foreground transition-colors hover:border-primary hover:text-primary">
              <Upload className="h-5 w-5" />
              {form.image ? "Image selected ✓" : "Click to upload an image"}
              <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
            </label>
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90 active:scale-[0.98]"
          >
            {isDonation ? "List as Donation" : "List Product"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Seller;
