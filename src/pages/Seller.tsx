import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { Upload, CheckCircle } from "lucide-react";

const Seller = () => {
  const { addProduct } = useApp();
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "", type: "", size: "", quality: "", price: "", company: "", image: "",
  });

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
    addProduct(form);
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
    { name: "name", label: "Product Name", placeholder: "e.g. Cotton T-Shirt" },
    { name: "type", label: "Product Type", placeholder: "e.g. Clothing" },
    { name: "size", label: "Size", placeholder: "e.g. M, L, 32" },
    { name: "quality", label: "Quality", placeholder: "e.g. Good, Like New" },
    { name: "price", label: "Price (₹)", placeholder: "e.g. 500" },
    { name: "company", label: "Brand / Company", placeholder: "e.g. EcoWear" },
  ];

  return (
    <div className="mx-auto max-w-2xl animate-fade-in">
      <div className="mb-6">
        <h1 className="font-display text-3xl font-bold text-foreground">Upload Product</h1>
        <p className="mt-1 text-muted-foreground">List an item for others to swap or purchase</p>
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
          </div>

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
            List Product
          </button>
        </form>
      </div>
    </div>
  );
};

export default Seller;
