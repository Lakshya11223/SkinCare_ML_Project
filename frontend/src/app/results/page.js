import Link from "next/link";

const concerns = [
  { label: "Acne", level: "Moderate", color: "bg-red-50 border-red-100 text-red-600", dot: "🔴" },
  { label: "Dark Spots", level: "Mild", color: "bg-amber-50 border-amber-100 text-amber-600", dot: "🟡" },
  { label: "Large Pores", level: "Mild", color: "bg-amber-50 border-amber-100 text-amber-600", dot: "🟡" },
  { label: "Wrinkles", level: "None", color: "bg-green-50 border-green-100 text-green-600", dot: "✅" },
];

const shades = [
  { brand: "L'Oréal", shade: "Warm Beige W3", hex: "#C68642" },
  { brand: "MAC", shade: "NC35", hex: "#B87650" },
  { brand: "Fenty", shade: "245N", hex: "#C87848" },
  { brand: "Maybelline", shade: "Shade 220", hex: "#D49060" },
  { brand: "Nykaa", shade: "Honey Beige", hex: "#D4956A" },
];

const morningSteps = [
  { step: 1, name: "Cleanser", note: "Gentle foaming" },
  { step: 2, name: "Toner", note: "Balancing" },
  { step: 3, name: "Niacinamide Serum", note: "Pore-minimizing" },
  { step: 4, name: "Moisturizer", note: "Light gel" },
  { step: 5, name: "SPF 50+", note: "Non-greasy", highlight: true },
];

const nightSteps = [
  { step: 1, name: "Cleansing Oil", note: "Remove SPF" },
  { step: 2, name: "BHA Serum", note: "Acne-targeting" },
  { step: 3, name: "Moisturizer", note: "Rich barrier" },
  { step: 4, name: "Eye Cream", note: "Depuff" },
];

const products = [
  {
    icon: "🧴",
    name: "CeraVe Foaming Cleanser",
    category: "Cleanser · Step 1",
    price: "₹799",
    pros: ["Gentle on skin barrier", "Ceramide-infused formula", "Fragrance-free"],
    cons: ["Contains Sodium Laureth Sulfate", "May over-dry sensitive skin"],
  },
  {
    icon: "💜",
    name: "The Ordinary Niacinamide 10%",
    category: "Serum · Step 3",
    price: "₹699",
    pros: ["Minimizes pore appearance", "Fades dark spots", "Regulates sebum"],
    cons: ["Zinc may cause purging", "May pill under makeup"],
  },
  {
    icon: "☀️",
    name: "Minimalist SPF 50 Sunscreen",
    category: "Sunscreen · Step 5",
    price: "₹499",
    pros: ["No white cast", "Lightweight texture", "PA++++ protection"],
    cons: ["Octinoxate (chemical filter)", "Requires frequent reapplication"],
  },
];

export default function ResultsPage() {
  return (
    <main className="min-h-screen bg-[#F7F3EF] pb-16">
      {/* Header */}
      <div className="bg-neutral-900 px-6 pt-8 pb-20">
        <div className="flex items-center justify-between mb-8 max-w-2xl mx-auto">
          <Link href="/analyze" className="text-white/50 hover:text-white transition-colors text-sm">← Redo</Link>
          <div className="flex items-center gap-2">
            <span className="text-lg">✨</span>
            <span className="text-white font-semibold">GlowIQ</span>
          </div>
          <button className="text-white/50 hover:text-white text-sm transition-colors">Share</button>
        </div>
        <div className="max-w-2xl mx-auto">
          <p className="text-neutral-400 text-sm mb-1">Your personalized</p>
          <h1 className="text-3xl font-bold text-white">Skin Report 🌿</h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 -mt-12 space-y-4">

        {/* Top 3 metric cards */}
        <div className="grid grid-cols-3 gap-3">
          {/* Score */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-neutral-100 flex flex-col items-center justify-center gap-2">
            <p className="text-xs text-neutral-400 uppercase tracking-wide">Score</p>
            <div className="relative w-16 h-16">
              <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
                <circle cx="32" cy="32" r="26" fill="none" stroke="#F5E6D8" strokeWidth="5" />
                <circle cx="32" cy="32" r="26" fill="none" stroke="#F97316" strokeWidth="5"
                  strokeDasharray="163" strokeDashoffset="44" strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-base font-bold text-neutral-800">74</span>
              </div>
            </div>
            <p className="text-xs text-orange-400 font-medium">Good</p>
          </div>

          {/* Tone */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-neutral-100">
            <p className="text-xs text-neutral-400 uppercase tracking-wide mb-2">Tone</p>
            <div className="flex gap-1 mb-2">
              {["#C68642", "#D4956A", "#E8B896"].map(c => (
                <div key={c} className="w-5 h-5 rounded-full shadow-sm" style={{ background: c }} />
              ))}
            </div>
            <p className="text-xs font-semibold text-neutral-800">Medium</p>
            <p className="text-xs text-neutral-400">Warm Undertone</p>
          </div>

          {/* Type */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-neutral-100 flex flex-col justify-center">
            <p className="text-xs text-neutral-400 uppercase tracking-wide mb-2">Type</p>
            <p className="text-lg font-bold text-neutral-800 leading-tight">Combi<br />nation</p>
            <p className="text-xs text-neutral-400 mt-1">T-zone oily</p>
          </div>
        </div>

        {/* Concerns */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-neutral-100">
          <p className="text-xs text-neutral-400 uppercase tracking-wide mb-4">Concerns Detected</p>
          <div className="grid grid-cols-2 gap-2">
            {concerns.map((c) => (
              <div key={c.label} className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 border ${c.color}`}>
                <span className="text-sm">{c.dot}</span>
                <div>
                  <p className="text-xs font-semibold">{c.label}</p>
                  <p className="text-xs opacity-70">{c.level}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Shade Matches */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-neutral-100">
          <p className="text-xs text-neutral-400 uppercase tracking-wide mb-4">Your Shade Matches</p>
          <div className="flex flex-col gap-3">
            {shades.map((s, i) => (
              <div key={s.brand}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full shadow-sm border border-neutral-100" style={{ background: s.hex }} />
                    <div>
                      <p className="text-sm font-medium text-neutral-800">{s.brand}</p>
                      <p className="text-xs text-neutral-400">{s.shade}</p>
                    </div>
                  </div>
                  <span className="text-xs bg-orange-50 text-orange-500 font-medium px-2 py-1 rounded-lg border border-orange-100">
                    Match
                  </span>
                </div>
                {i < shades.length - 1 && <div className="h-px bg-neutral-50 mt-3" />}
              </div>
            ))}
          </div>
        </div>

        {/* Routines */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-neutral-100">
          <p className="text-xs text-neutral-400 uppercase tracking-wide mb-4">Your Routines</p>
          <div className="grid grid-cols-2 gap-6">
            {/* Morning */}
            <div>
              <p className="text-xs font-semibold text-neutral-700 mb-3 flex items-center gap-1.5">☀️ Morning</p>
              <div className="flex flex-col gap-2.5">
                {morningSteps.map((s) => (
                  <div key={s.step} className="flex items-start gap-2.5">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${s.highlight ? "bg-orange-400" : "bg-orange-50"}`}>
                      <span className={`text-xs font-semibold ${s.highlight ? "text-white" : "text-orange-400"}`}>{s.step}</span>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-neutral-800">{s.name}</p>
                      <p className="text-xs text-neutral-400">{s.note}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Night */}
            <div>
              <p className="text-xs font-semibold text-neutral-700 mb-3 flex items-center gap-1.5">🌙 Night</p>
              <div className="flex flex-col gap-2.5">
                {nightSteps.map((s) => (
                  <div key={s.step} className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-neutral-100 flex items-center justify-center shrink-0">
                      <span className="text-xs font-semibold text-neutral-500">{s.step}</span>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-neutral-800">{s.name}</p>
                      <p className="text-xs text-neutral-400">{s.note}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Products */}
        <div>
          <p className="text-xs text-neutral-400 uppercase tracking-wide mb-3 px-1">Recommended Products</p>
          <div className="flex flex-col gap-3">
            {products.map((p) => (
              <div key={p.name} className="bg-white rounded-2xl p-5 shadow-sm border border-neutral-100">
                {/* Product header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-neutral-50 rounded-xl flex items-center justify-center text-xl border border-neutral-100">
                      {p.icon}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-neutral-800">{p.name}</p>
                      <p className="text-xs text-neutral-400">{p.category}</p>
                    </div>
                  </div>
                  <span className="text-base font-bold text-orange-400">{p.price}</span>
                </div>

                {/* Pros / Cons */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-green-50 rounded-xl p-3 border border-green-100">
                    <p className="text-xs font-semibold text-green-700 mb-2">✅ Pros</p>
                    <ul className="flex flex-col gap-1">
                      {p.pros.map((pro) => (
                        <li key={pro} className="text-xs text-green-600 flex items-start gap-1">
                          <span className="mt-0.5 text-green-400">·</span> {pro}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-red-50 rounded-xl p-3 border border-red-100">
                    <p className="text-xs font-semibold text-red-700 mb-2">⚠️ Cons</p>
                    <ul className="flex flex-col gap-1">
                      {p.cons.map((con) => (
                        <li key={con} className="text-xs text-red-500 flex items-start gap-1">
                          <span className="mt-0.5 text-red-300">·</span> {con}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Buy links */}
                <div className="flex gap-2">
                  <a href="#" className="flex-1 text-center text-xs font-medium bg-neutral-900 text-white py-2.5 rounded-xl hover:bg-neutral-700 transition-colors">
                    🛒 Amazon
                  </a>
                  <a href="#" className="flex-1 text-center text-xs font-medium border border-neutral-200 text-neutral-700 py-2.5 rounded-xl hover:border-neutral-400 transition-colors">
                    💄 Nykaa
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer CTA */}
        <div className="bg-neutral-900 rounded-2xl p-6 text-center">
          <p className="text-white font-bold text-lg mb-1">Track your progress 📈</p>
          <p className="text-neutral-400 text-sm mb-4">Scan again in 30 days to see improvements.</p>
          <Link
            href="/analyze"
            className="inline-block bg-orange-400 text-white px-8 py-3 rounded-xl font-medium text-sm hover:bg-orange-500 transition-colors"
          >
            Scan Again
          </Link>
        </div>

      </div>
    </main>
  );
}