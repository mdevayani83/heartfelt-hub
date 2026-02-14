import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";

const Buy = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => navigate("/buyer"), 2500);
  };

  if (submitted) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="animate-fade-in text-center">
          <CheckCircle className="mx-auto mb-4 h-16 w-16 text-primary" />
          <h2 className="font-display text-2xl font-bold text-foreground">Order Placed!</h2>
          <p className="mt-2 text-muted-foreground">Thank you for your eco-friendly purchase.</p>
        </div>
      </div>
    );
  }

  const fields = [
    { name: "name", label: "Full Name", placeholder: "Your name" },
    { name: "address", label: "Address", placeholder: "Delivery address" },
    { name: "district", label: "District", placeholder: "Your district" },
    { name: "state", label: "State", placeholder: "Your state" },
    { name: "landmark", label: "Landmark", placeholder: "Nearby landmark" },
    { name: "payment", label: "Payment Option", placeholder: "COD / UPI / Card" },
  ];

  return (
    <div className="mx-auto max-w-2xl animate-fade-in">
      <div className="mb-6">
        <h1 className="font-display text-3xl font-bold text-foreground">Delivery Details</h1>
        <p className="mt-1 text-muted-foreground">Enter your delivery information to complete the order</p>
      </div>

      <div className="rounded-xl border border-border bg-card p-6 shadow-soft">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            {fields.map((f) => (
              <div key={f.name}>
                <label className="mb-1 block text-sm font-medium text-foreground">{f.label}</label>
                <input
                  required
                  placeholder={f.placeholder}
                  className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            ))}
          </div>
          <button
            type="submit"
            className="w-full rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90 active:scale-[0.98]"
          >
            Place Order
          </button>
        </form>
      </div>
    </div>
  );
};

export default Buy;
