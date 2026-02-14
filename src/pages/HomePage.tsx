import { Link } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { Upload, ShoppingBag, Search, Info, Leaf, Recycle, Heart } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

const features = [
  {
    to: "/seller",
    icon: Upload,
    title: "Sell Items",
    desc: "List your unused items for others to swap or buy",
  },
  {
    to: "/buyer",
    icon: ShoppingBag,
    title: "Browse Items",
    desc: "Discover affordable pre-loved products nearby",
  },
  {
    to: "/search",
    icon: Search,
    title: "Search",
    desc: "Find exactly what you need quickly",
  },
  {
    to: "/about",
    icon: Info,
    title: "About Us",
    desc: "Learn about our mission for sustainability",
  },
];

const stats = [
  { icon: Recycle, value: "500+", label: "Items Swapped" },
  { icon: Heart, value: "200+", label: "Happy Users" },
  { icon: Leaf, value: "1 Ton", label: "Waste Reduced" },
];

const HomePage = () => {
  const { user } = useApp();

  return (
    <div className="space-y-12">
      {/* Hero */}
      <section className="relative -mx-4 -mt-8 overflow-hidden rounded-b-3xl">
        <div className="absolute inset-0">
          <img src={heroBg} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-foreground/60" />
        </div>
        <div className="relative px-6 py-20 text-center sm:py-28">
          <h1 className="font-display text-4xl font-bold text-primary-foreground sm:text-5xl">
            {user ? `Welcome, ${user.username}!` : "Eco Swap Hub"}
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-primary-foreground/80">
            Swap, reuse, and reduce waste. Join our community making the planet greener, one item at a time.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link
              to="/seller"
              className="rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-soft transition-all hover:opacity-90 active:scale-[0.98]"
            >
              Start Selling
            </Link>
            <Link
              to="/buyer"
              className="rounded-lg border border-primary-foreground/30 bg-primary-foreground/10 px-6 py-3 text-sm font-semibold text-primary-foreground backdrop-blur transition-all hover:bg-primary-foreground/20"
            >
              Browse Items
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-3 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="flex flex-col items-center rounded-xl border border-border bg-card p-5 shadow-soft">
            <s.icon className="mb-2 h-6 w-6 text-primary" />
            <span className="font-display text-2xl font-bold text-foreground">{s.value}</span>
            <span className="text-xs text-muted-foreground">{s.label}</span>
          </div>
        ))}
      </section>

      {/* Feature cards */}
      <section>
        <h2 className="mb-6 font-display text-2xl font-bold text-foreground">What would you like to do?</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {features.map((f, i) => (
            <Link
              key={f.to}
              to={f.to}
              className="group flex items-start gap-4 rounded-xl border border-border bg-card p-5 shadow-soft transition-all hover:shadow-elevated hover:-translate-y-0.5"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <f.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-display text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                  {f.title}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
