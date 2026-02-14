import { Leaf, Recycle, Users, Globe } from "lucide-react";

const About = () => {
  const values = [
    { icon: Recycle, title: "Reduce Waste", desc: "Every item reused is one less in a landfill" },
    { icon: Users, title: "Community", desc: "Connect with like-minded eco-conscious people" },
    { icon: Globe, title: "Sustainability", desc: "Small actions create big environmental impact" },
  ];

  return (
    <div className="mx-auto max-w-3xl animate-fade-in">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary shadow-soft">
          <Leaf className="h-7 w-7 text-primary-foreground" />
        </div>
        <h1 className="font-display text-3xl font-bold text-foreground">About Eco Swap Hub</h1>
      </div>

      <div className="rounded-xl border border-border bg-card p-6 shadow-soft">
        <p className="leading-relaxed text-muted-foreground">
          Eco Swap Hub is an academic project developed by <strong className="text-foreground">Kaarthika P</strong>, 
          a student of Bachelor of Computer Applications from Holy Cross College (Autonomous), Tiruchirappalli. 
          This project is designed with the aim of promoting sustainable living by encouraging the reuse and 
          exchange of reusable items within a community.
        </p>
        <p className="mt-4 leading-relaxed text-muted-foreground">
          The main objective of Eco Swap Hub is to reduce environmental waste by providing a simple web-based 
          platform where users can list unused or reusable items and make them available for swapping or reuse. 
          The application allows users to register, log in, upload item details with images, and view available 
          items posted by other users.
        </p>
        <p className="mt-4 leading-relaxed text-muted-foreground">
          This project represents a practical approach toward environmental sustainability and serves as an 
          academic implementation of web application development concepts.
        </p>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {values.map((v) => (
          <div key={v.title} className="rounded-xl border border-border bg-card p-5 text-center shadow-soft">
            <v.icon className="mx-auto mb-3 h-8 w-8 text-primary" />
            <h3 className="font-display text-lg font-semibold text-foreground">{v.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{v.desc}</p>
          </div>
        ))}
      </div>

      <p className="mt-8 text-center text-muted-foreground">~ Thank you ~</p>
    </div>
  );
};

export default About;
