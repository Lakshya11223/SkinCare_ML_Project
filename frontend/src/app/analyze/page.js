"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AnalyzePage() {
  const [mode, setMode] = useState("upload");
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [step, setStep] = useState("");
  const [error, setError] = useState(null);
  const videoRef = useRef(null);
  const router = useRouter();

  const steps = [
    "Reading skin tone...",
    "Detecting skin type...",
    "Mapping shade matches...",
    "Building your routine...",
    "Selecting products...",
  ];

  function handleFile(e) {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setError(null);
  }

  async function startCamera() {
    setMode("camera");
    setPreview(null);
    setFile(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch {
      alert("Camera not available. Please use file upload.");
      setMode("upload");
    }
  }

  function capturePhoto() {
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext("2d").drawImage(videoRef.current, 0, 0);
    videoRef.current.srcObject?.getTracks().forEach(t => t.stop());

    canvas.toBlob((blob) => {
      const captured = new File([blob], "capture.jpg", { type: "image/jpeg" });
      setFile(captured);
      setPreview(URL.createObjectURL(captured));
    }, "image/jpeg");
  }

  async function analyze() {
    if (!file) return;
    setLoading(true);
    setError(null);
    setProgress(0);

    // Fake progress animation while API runs
    let pct = 0;
    const interval = setInterval(() => {
      pct += 3;
      if (pct > 90) { clearInterval(interval); return; }
      setProgress(pct);
      setStep(steps[Math.min(Math.floor(pct / 20), steps.length - 1)]);
    }, 80);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("http://localhost:8000/analyze", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      clearInterval(interval);

      if (!data.success) throw new Error(data.error || "Analysis failed");

      // Save result to sessionStorage so results page can read it
      sessionStorage.setItem("glowiq_result", JSON.stringify(data));

      setProgress(100);
      setTimeout(() => router.push("/results"), 400);
    } catch (err) {
      clearInterval(interval);
      setLoading(false);
      setError("Could not connect to backend. Make sure it's running on port 8000.");
    }
  }

  // ── Loading screen ──────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDF8F4] flex flex-col items-center justify-center gap-6 px-6">
        <div className="relative w-28 h-28">
          <svg className="w-28 h-28 -rotate-90" viewBox="0 0 112 112">
            <circle cx="56" cy="56" r="48" fill="none" stroke="#F5E6D8" strokeWidth="6" />
            <circle cx="56" cy="56" r="48" fill="none" stroke="#F97316" strokeWidth="6"
              strokeDasharray="301"
              strokeDashoffset={301 - (301 * progress) / 100}
              strokeLinecap="round"
              style={{ transition: "stroke-dashoffset 0.1s linear" }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xl font-bold text-neutral-800">{progress}%</span>
          </div>
        </div>
        <div className="text-center">
          <p className="text-xs uppercase tracking-widest text-orange-400 mb-1">Analyzing</p>
          <p className="text-lg font-semibold text-neutral-800">{step}</p>
        </div>
      </div>
    );
  }

  // ── Main UI ─────────────────────────────────────────────────────────
  return (
    <main className="min-h-screen bg-[#FDF8F4]">
      <nav className="flex items-center justify-between px-8 py-5">
        <Link href="/" className="text-sm text-neutral-500 hover:text-neutral-800 flex items-center gap-1 transition-colors">
          ← Back
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-xl">✨</span>
          <span className="font-semibold text-neutral-800">GlowIQ</span>
        </div>
        <div className="w-16" />
      </nav>

      <div className="max-w-md mx-auto px-6 py-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">Analyze Your Skin</h1>
          <p className="text-neutral-400 text-sm">Take a clear selfie in good lighting, no filters</p>
        </div>

        {/* Mode toggle */}
        <div className="flex bg-white rounded-2xl p-1 gap-1 border border-neutral-100 shadow-sm mb-6">
          <button
            onClick={() => { setMode("upload"); setPreview(null); setFile(null); }}
            className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2 ${mode === "upload" ? "bg-neutral-900 text-white" : "text-neutral-500 hover:text-neutral-800"}`}
          >
            📁 Upload Photo
          </button>
          <button
            onClick={startCamera}
            className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2 ${mode === "camera" ? "bg-neutral-900 text-white" : "text-neutral-500 hover:text-neutral-800"}`}
          >
            📷 Use Camera
          </button>
        </div>

        {/* Camera */}
        {mode === "camera" && !preview && (
          <div className="mb-4">
            <div className="relative rounded-2xl overflow-hidden bg-neutral-900" style={{ aspectRatio: "3/4" }}>
              <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-48 h-60 border-2 border-white/40 rounded-full border-dashed" />
              </div>
              <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                <span className="text-xs text-white/70 bg-black/30 px-4 py-1.5 rounded-full backdrop-blur-sm">Align your face</span>
              </div>
            </div>
            <button onClick={capturePhoto} className="w-full mt-4 bg-neutral-900 text-white py-4 rounded-2xl font-medium hover:bg-neutral-700 transition-colors">
              Capture
            </button>
          </div>
        )}

        {/* Upload */}
        {mode === "upload" && !preview && (
          <label className="block cursor-pointer mb-4">
            <div className="border-2 border-dashed border-neutral-200 rounded-2xl hover:border-orange-300 transition-colors flex flex-col items-center justify-center py-16 gap-4 bg-white">
              <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center text-3xl">📸</div>
              <div className="text-center">
                <p className="font-medium text-neutral-700">Click to upload photo</p>
                <p className="text-xs text-neutral-400 mt-1">JPG, PNG or HEIC · Max 10MB</p>
              </div>
            </div>
            <input type="file" accept="image/*" className="hidden" onChange={handleFile} />
          </label>
        )}

        {/* Preview */}
        {preview && (
          <div className="mb-4">
            <div className="relative rounded-2xl overflow-hidden" style={{ aspectRatio: "3/4" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={preview} alt="Preview" className="w-full h-full object-cover" />
              <button
                onClick={() => { setPreview(null); setFile(null); }}
                className="absolute top-3 right-3 bg-black/50 text-white text-xs px-3 py-1.5 rounded-full backdrop-blur-sm hover:bg-black/70 transition-colors"
              >
                ✕ Retake
              </button>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mb-4 bg-red-50 border border-red-100 rounded-2xl px-4 py-3">
            <p className="text-sm text-red-500">{error}</p>
          </div>
        )}

        {/* Analyze button */}
        {preview && (
          <button
            onClick={analyze}
            className="w-full bg-orange-400 text-white py-4 rounded-2xl font-semibold text-base hover:bg-orange-500 transition-colors shadow-lg shadow-orange-100"
          >
            Analyze My Skin ✨
          </button>
        )}

        {/* Tips */}
        <div className="grid grid-cols-3 gap-3 mt-8">
          {[
            { icon: "☀️", label: "Good lighting" },
            { icon: "😐", label: "Neutral face" },
            { icon: "🚫", label: "No filters" },
          ].map((t) => (
            <div key={t.label} className="bg-white rounded-xl p-3 text-center border border-neutral-100">
              <p className="text-xl mb-1">{t.icon}</p>
              <p className="text-xs text-neutral-400">{t.label}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}