"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function ResultsPage() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("glowiq_result");
    if (stored) setData(JSON.parse(stored));
  }, []);

  if (!data) {
    return (
      <div className="min-h-screen bg-[#F7F3EF] flex flex-col items-center justify-center gap-4">
        <p className="text-neutral-400 text-sm">No analysis found.</p>
        <Link href="/analyse" className="bg-orange-400 text-white px-6 py-3 rounded-xl text-sm font-medium hover:bg-orange-500 transition-colors">
          Analyze Your Skin
        </Link>
      </div>
    );
  }

  const severityStyle = {
    red:    "bg-red-50 border-red-100 text-red-600",
    yellow: "bg-amber-50 border-amber-100 text-amber-600",
    green:  "bg-green-50 border-green-100 text-green-600",
  };
  const severityDot = { red: "🔴", yellow: "🟡", green: "✅" };
  const scoreOffset = 163 - (163 * data.skin_score) / 100;

  return (
    <main className="min-h-screen bg-[#F7F3EF] pb-16">
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
          <p className="text-neutral-500 text-xs mt-1">Model confidence: {data.confidence}%</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 -mt-12 space-y-4">
        {/* Top cards */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-neutral-100 flex flex-col items-center justify-center gap-2">
            <p className="text-xs text-neutral-400 uppercase tracking-wide">Score</p>
            <div className="relative w-16 h-16">
              <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
                <circle cx="32" cy="32" r="26" fill="none" stroke="#F5E6D8" strokeWidth="5" />
                <circle cx="32" cy="32" r="26" fill="none" stroke="#F97316" strokeWidth="5"
                  strokeDasharray="163" strokeDashoffset={scoreOffset} strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-base font-bold text-neutral-800">{data.skin_score}</span>
              </div>
            </div>
            <p className="text-xs text-orange-400 font-medium">
              {data.skin_score >= 80 ? "Nice Skin" : data.skin_score >= 70 ? "Good Skin" : "Fair Skin"}
            </p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-neutral-100">
            <p className="text-xs text-neutral-400 uppercase tracking-wide mb-2">Tone</p>
            <div className="flex gap-1 mb-2">
              {["#C68642", "#D4956A", "#E8B896"].map(c => (
                <div key={c} className="w-5 h-5 rounded-full shadow-sm" style={{ background: c }} />
              ))}
            </div>
            <p className="text-xs font-semibold text-neutral-800">{data.skin_tone.split(" / ")[0]}</p>
            <p className="text-xs text-neutral-400">{data.skin_tone.split(" / ")[1]} Undertone</p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-neutral-100 flex flex-col justify-center">
            <p className="text-xs text-neutral-400 uppercase tracking-wide mb-2">Type</p>
            <p className="text-lg font-bold text-neutral-800">{data.skin_type}</p>
            <p className="text-xs text-orange-400 mt-1">Detected</p>
          </div>
        </div>

        {/* Concerns */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-neutral-100">
          <p className="text-xs text-neutral-400 uppercase tracking-wide mb-4">Concerns Detected</p>
          <div className="grid grid-cols-2 gap-2">
            {data.concerns.map((c) => (
              <div key={c.label} className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 border ${severityStyle[c.severity]}`}>
                <span className="text-sm">{severityDot[c.severity]}</span>
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
            {data.shade_matches.map((s, i) => (
              <div key={s.brand}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full shadow-sm border border-neutral-100" style={{ background: s.hex }} />
                    <div>
                      <p className="text-sm font-medium text-neutral-800">{s.brand}</p>
                      <p className="text-xs text-neutral-400">{s.shade}</p>
                    </div>
                  </div>
                  <span className="text-xs bg-orange-50 text-orange-500 font-medium px-2 py-1 rounded-lg border border-orange-100">Match</span>
                </div>
                {i < data.shade_matches.length - 1 && <div className="h-px bg-neutral-50 mt-3" />}
              </div>
            ))}
          </div>
        </div>

        {/* Routines */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-neutral-100">
          <p className="text-xs text-neutral-400 uppercase tracking-wide mb-4">Your Routines</p>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-xs font-semibold text-neutral-700 mb-3">☀️ Morning</p>
              <div className="flex flex-col gap-2.5">
                {data.morning_routine.map((s) => (
                  <div key={s.step} className="flex items-start gap-2.5">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${s.step === data.morning_routine.length ? "bg-orange-400" : "bg-orange-50"}`}>
                      <span className={`text-xs font-semibold ${s.step === data.morning_routine.length ? "text-white" : "text-orange-400"}`}>{s.step}</span>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-neutral-800">{s.name}</p>
                      <p className="text-xs text-neutral-400">{s.note}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-neutral-700 mb-3">🌙 Night</p>
              <div className="flex flex-col gap-2.5">
                {data.night_routine.map((s) => (
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
            {data.products.map((p) => (
              <div key={p.name} className="bg-white rounded-2xl p-5 shadow-sm border border-neutral-100">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-neutral-50 rounded-xl flex items-center justify-center text-xl border border-neutral-100">{p.icon}</div>
                    <div>
                      <p className="text-sm font-semibold text-neutral-800">{p.name}</p>
                      <p className="text-xs text-neutral-400">{p.category}</p>
                    </div>
                  </div>
                  <span className="text-base font-bold text-orange-400">{p.price}</span>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-green-50 rounded-xl p-3 border border-green-100">
                    <p className="text-xs font-semibold text-green-700 mb-2">✅ Pros</p>
                    {p.pros.map((pro) => (
                      <p key={pro} className="text-xs text-green-600">· {pro}</p>
                    ))}
                  </div>
                  <div className="bg-red-50 rounded-xl p-3 border border-red-100">
                    <p className="text-xs font-semibold text-red-700 mb-2">⚠️ Cons</p>
                    {p.cons.map((con) => (
                      <p key={con} className="text-xs text-red-500">· {con}</p>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <a href={p.amazon} target="_blank" rel="noreferrer" className="flex-1 text-center text-xs font-medium bg-neutral-900 text-white py-2.5 rounded-xl hover:bg-neutral-700 transition-colors">🛒 Amazon</a>
                  <a href={p.nykaa} target="_blank" rel="noreferrer" className="flex-1 text-center text-xs font-medium border border-neutral-200 text-neutral-700 py-2.5 rounded-xl hover:border-neutral-400 transition-colors">💄 Nykaa</a>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-neutral-900 rounded-2xl p-6 text-center">
          <p className="text-white font-bold text-lg mb-1">Track your progress 📈</p>
          <p className="text-neutral-400 text-sm mb-4">Scan again in 30 days to see improvements.</p>
          <Link href="/analyse" className="inline-block bg-orange-400 text-white px-8 py-3 rounded-xl font-medium text-sm hover:bg-orange-500 transition-colors">
            Scan Again
          </Link>
        </div>
      </div>
    </main>
  );
}