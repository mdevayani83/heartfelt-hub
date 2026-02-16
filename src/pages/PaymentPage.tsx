import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { CreditCard, CheckCircle, Banknote, Smartphone } from "lucide-react";

const PaymentPage = () => {
  const { orderId } = useParams();
  const { orders, products, makePayment } = useApp();
  const navigate = useNavigate();
  const [method, setMethod] = useState("UPI");
  const [paid, setPaid] = useState(false);

  const order = orders.find((o) => o.id === Number(orderId));
  const product = order ? products.find((p) => p.id === order.productId) : null;

  if (!order || !product) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-muted-foreground">Order not found.</p>
      </div>
    );
  }

  if (paid || order.paymentStatus === "Paid") {
    return (
      <div className="flex min-h-[50vh] items-center justify-center animate-fade-in">
        <div className="text-center">
          <CheckCircle className="mx-auto mb-4 h-16 w-16 text-primary" />
          <h2 className="font-display text-2xl font-bold text-foreground">Payment Successful!</h2>
          <p className="mt-2 text-muted-foreground">Order #{order.id} confirmed. Thank you!</p>
          <button onClick={() => navigate("/buyer-dashboard")} className="mt-6 rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground">
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const paymentMethods = [
    { value: "UPI", label: "UPI", icon: Smartphone },
    { value: "Card", label: "Card", icon: CreditCard },
    { value: "COD", label: "Cash on Delivery", icon: Banknote },
  ];

  const handlePay = () => {
    makePayment(order.id, method);
    setPaid(true);
  };

  return (
    <div className="mx-auto max-w-lg animate-fade-in">
      <h1 className="mb-6 font-display text-3xl font-bold text-foreground">Payment</h1>

      <div className="rounded-xl border border-border bg-card p-6 shadow-soft">
        <div className="mb-6 rounded-lg bg-secondary p-4">
          <p className="text-sm text-muted-foreground">Order #{order.id}</p>
          <h3 className="font-display text-lg font-semibold text-foreground">{product.name}</h3>
          <p className="mt-1 text-2xl font-bold text-primary">₹{order.totalPrice}</p>
        </div>

        <h3 className="mb-3 text-sm font-medium text-foreground">Select Payment Method</h3>
        <div className="space-y-2">
          {paymentMethods.map((pm) => (
            <label
              key={pm.value}
              className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition-colors ${
                method === pm.value ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"
              }`}
            >
              <input type="radio" name="payment" value={pm.value} checked={method === pm.value} onChange={(e) => setMethod(e.target.value)} className="accent-primary" />
              <pm.icon className="h-5 w-5 text-primary" />
              <span className="font-medium text-foreground">{pm.label}</span>
            </label>
          ))}
        </div>

        <button
          onClick={handlePay}
          className="mt-6 w-full rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90 active:scale-[0.98]"
        >
          Pay ₹{order.totalPrice}
        </button>

        <p className="mt-3 text-center text-xs text-muted-foreground">This is a simulated payment for academic purposes</p>
      </div>
    </div>
  );
};

export default PaymentPage;
