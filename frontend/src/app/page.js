import Image from "next/image";
import Link from "next/link";
import girlImage from './image/girl_image.png'
export default function Home() {
  return (
    <main className="min-h-screen bg-[#FDF8F4] flex flex-col">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-5">
        <div className="flex items-center gap-2">
          <span className="text-xl font-semibold text-neutral-800 tracking-tight">GlowIQ</span>
        </div>
        <Link
          href="/analyze"
          className="text-sm text-orange-500 hover:text-orange-600 transition-colors"
        >
          Start Free →
        </Link>
      </nav>

      {/* Hero */}
      <section className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-12 px-8 py-16 max-w-6xl mx-auto w-full">
        {/* Left */}
        <div className="flex-1 flex flex-col gap-6">
          <span className="inline-flex items-center gap-2 bg-orange-50 text-orange-500  md:text-xl text-xs font-medium px-3 py-1.5 rounded-full w-fit border border-orange-100 ">
              AI-Powered · Free · Under 10 seconds
          </span>

          <h1 className="text-5xl lg:text-6xl font-bold text-neutral-900 leading-tight">
            Know Your Skin. <br />
            <span className="text-orange-400">Love It.</span>
          </h1>

          <p className="text-neutral-500 text-lg leading-relaxed max-w-md">
            Upload a photo and get your complete skin report — tone, type, concerns, routines & product recommendations.
          </p>

          <div className="flex items-center gap-4">
            <Link
              href="/analyze"
              className="bg-neutral-900 text-white px-8 py-4 rounded-2xl font-medium hover:bg-neutral-700 transition-colors"
            >
              Get Skin Analysis
            </Link>
            <span className="text-sm text-neutral-400">No account needed</span>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-8 pt-4">
            <div>
              <p className="text-2xl font-bold text-neutral-800">10s</p>
              <p className="text-xs text-neutral-400">Analysis time</p>
            </div>
            <div className="w-px h-8 bg-neutral-200" />
            <div>
              <p className="text-2xl font-bold text-neutral-800">8+</p>
              <p className="text-xs text-neutral-400">Metrics analyzed</p>
            </div>
            <div className="w-px h-8 bg-neutral-200" />
            <div>
              <p className="text-2xl font-bold text-neutral-800">100%</p>
              <p className="text-xs text-neutral-400">Free</p>
            </div>
          </div>
        </div>

        {/* Right — skin report preview card */}
        <div className="flex-1 flex justify-center">
          <div className="bg-white rounded-3xl shadow-xl p-6 w-full max-w-sm border border-neutral-100">
            {/* Face placeholder */}
            <div className="bg-linear-to-br from-orange-50 to-amber-50 rounded-2xl h-70 flex items-center justify-center mb-4 relative overflow-hidden">

              <img src={girlImage.src} alt="Face Placeholder" className="w-full h-full object-cover rounded-2xl" />
            </div>

            {/* Mini results */}
            <div className="flex items-center justify-between mb-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-neutral-800">74</p>
                <p className="text-xs text-neutral-400">Skin Score</p>
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-neutral-800">Medium Warm</p>
                <p className="text-xs text-neutral-400">Skin Tone</p>
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-neutral-800">Combo</p>
                <p className="text-xs text-neutral-400">Skin Type</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <span className="bg-red-50 text-red-500 text-xs px-3 py-1 rounded-full border border-red-100"> Acne</span>
              <span className="bg-amber-50 text-amber-500 text-xs px-3 py-1 rounded-full border border-amber-100"> Dark Spots</span>
              <span className="bg-green-50 text-green-500 text-xs px-3 py-1 rounded-full border border-green-100"> No Wrinkles</span>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white border-t border-neutral-100 py-16 px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-neutral-800 text-center mb-10">How it works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: "📸", title: "Upload a Photo", desc: "Take a selfie or upload from your gallery. No filters, good lighting." },
              { icon: "🧠", title: "AI Analyzes", desc: "Our model reads your skin tone, type, and detects 8+ concerns." },
              { icon: "📊", title: "Get Your Report", desc: "Full routine, product picks, shade matches — personalized for you." },
            ].map((step, i) => (
              <div key={i} className="flex flex-col items-center text-center gap-3">
                <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center text-2xl">
                  {step.icon}
                </div>
                <p className="font-semibold text-neutral-800">{step.title}</p>
                <p className="text-sm text-neutral-400 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 px-8 text-center bg-neutral-900">
        <p className="text-white text-2xl font-bold mb-2">Ready to meet your skin?</p>
        <p className="text-neutral-400 text-sm mb-6">Free. No sign-up. Results in seconds.</p>
        <Link
          href="/analyze"
          className="bg-orange-400 text-white px-10 py-4 rounded-2xl font-medium hover:bg-orange-500 transition-colors inline-block"
        >
          Analyze My Skin →
        </Link>
      </section>
    </main>
  );
}