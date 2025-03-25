import React from "react";

export default function Features() {
  return (
    <div className="grid md:grid-cols-3 gap-8 mt-16">
      {[
        {
          title: "Fast & Secure",
          icon: "⚡",
          description:
            "Lightning-fast URL shortening with optional password protection",
        },
        {
          title: "Custom Links",
          icon: "🎨",
          description: "Create memorable and branded short links",
        },
        {
          title: "Analytics",
          icon: "📊",
          description: "Track your link performance with detailed insights",
        },
      ].map((feature) => (
        <div
          key={feature.title}
          className="backdrop-blur-lg bg-white/10 p-6 rounded-xl border border-white/10 transform transition-all duration-200 hover:scale-105"
        >
          <div className="text-3xl mb-3">{feature.icon}</div>
          <h3 className="text-white text-xl font-semibold mb-2">
            {feature.title}
          </h3>
          <p className="text-white/70">{feature.description}</p>
        </div>
      ))}
    </div>
  );
}
