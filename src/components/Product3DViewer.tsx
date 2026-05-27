"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";

interface Props {
  modelUrl?: string | null;
  color?: string;
}

export default function Product3DViewer({ modelUrl, color = "#b48b63" }: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [modelViewerLoaded, setModelViewerLoaded] = useState(false);

  useEffect(() => {
    // Load <model-viewer> polyfill from unpkg if not already present
    if (typeof (window as any).HTMLModelElement === "undefined") {
      const scriptId = "mv-script";
      if (!document.getElementById(scriptId)) {
        const s = document.createElement("script");
        s.id = scriptId;
        s.type = "module";
        s.src = "https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js";
        s.onload = () => setModelViewerLoaded(true);
        document.head.appendChild(s);
      } else {
        setModelViewerLoaded(true);
      }
    } else {
      setModelViewerLoaded(true);
    }
  }, []);

  // Simple interactive placeholder when no model URL: draggable rotating sphere-like element
  useEffect(() => {
    if (modelUrl) return; // only for placeholder
    const el = ref.current;
    if (!el) return;
    let dragging = false;
    let startX = 0;
    let rotY = 0;

    const onDown = (e: MouseEvent | TouchEvent) => {
      dragging = true;
      startX = (e as MouseEvent).pageX ?? (e as TouchEvent).touches[0].pageX;
      el.style.cursor = "grabbing";
    };
    const onMove = (e: MouseEvent | TouchEvent) => {
      if (!dragging) return;
      const x = (e as MouseEvent).pageX ?? (e as TouchEvent).touches[0].pageX;
      const dx = x - startX;
      startX = x;
      rotY += dx * 0.3;
      (el.firstElementChild as HTMLElement).style.transform = `rotateY(${rotY}deg)`;
    };
    const onUp = () => {
      dragging = false;
      el.style.cursor = "grab";
    };

    el.addEventListener("mousedown", onDown as any);
    window.addEventListener("mousemove", onMove as any);
    window.addEventListener("mouseup", onUp as any);
    el.addEventListener("touchstart", onDown as any);
    window.addEventListener("touchmove", onMove as any);
    window.addEventListener("touchend", onUp as any);

    el.style.cursor = "grab";

    // auto-rotate
    let rafId: number;
    const tick = () => {
      rotY += 0.1;
      (el.firstElementChild as HTMLElement).style.transform = `rotateY(${rotY}deg)`;
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    return () => {
      el.removeEventListener("mousedown", onDown as any);
      window.removeEventListener("mousemove", onMove as any);
      window.removeEventListener("mouseup", onUp as any);
      el.removeEventListener("touchstart", onDown as any);
      window.removeEventListener("touchmove", onMove as any);
      window.removeEventListener("touchend", onUp as any);
      cancelAnimationFrame(rafId);
    };
  }, [modelUrl]);

  if (modelUrl && modelViewerLoaded) {
    return (
      <div className="animate-fade-up" style={{ animationDelay: "100ms" }}>
        <label className="font-mono text-xs uppercase text-foreground/60 mb-3 block">3D Preview</label>
        {/* @ts-expect-error html */}
        <model-viewer
          src={modelUrl}
          alt="3D model"
          auto-rotate
          camera-controls
          ar
          style={{ width: "100%", height: "480px", borderRadius: 16 }}
          className="rounded-2xl overflow-hidden border border-foreground/5 shadow-2xl"
        />
      </div>
    );
  }

  // Fallback placeholder using CSS + simple DOM transform rotation
  return (
    <div className="animate-fade-up" style={{ animationDelay: "100ms" }}>
      <label className="font-mono text-xs uppercase text-foreground/60 mb-3 block">360° View</label>
      <div
        ref={ref}
        className="rounded-2xl overflow-hidden border border-foreground/5 shadow-2xl bg-black/30 flex items-center justify-center"
        style={{ height: 420 }}
      >
        <div className="w-40 h-40 md:w-56 md:h-56 rounded-full" style={{ background: `radial-gradient(circle at 30% 30%, ${color}, #000)` , transformStyle: 'preserve-3d', transition: 'transform 0.1s linear'}} />
      </div>
    </div>
  );
}
