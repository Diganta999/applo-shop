"use client";

import Image from "next/image";
import { useState } from "react";
import Product3DViewer from "./Product3DViewer";
import ProductVideo from "./ProductVideo";
import { Button } from "@/components/ui/button";

interface Props {
  imageSrc: string | any;
  modelUrl?: string | null;
  videoUrl?: string | null;
  alt?: string;
}

export default function ProductMediaGallery({ imageSrc, modelUrl, videoUrl, alt }: Props) {
  const [tab, setTab] = useState<"image" | "3d" | "video">("image");

  const TabButton = ({ id, label }: { id: string; label: string }) => (
    <Button
      variant="ghost"
      onClick={() => setTab(id as any)}
      className={`px-3 py-1 h-auto rounded-full text-xs font-mono tracking-wider transition-all duration-200 border-none outline-none shadow-none 
        ${tab === id ? "bg-foreground text-background hover:bg-foreground hover:text-background" : "bg-white/6 text-foreground/70 hover:bg-white/10 hover:text-foreground"}`}
      aria-pressed={tab === id}
    >
      {label}
    </Button>
  );

  return (
    <div className="animate-fade-up" style={{ animationDelay: "100ms" }}>
      <div className="rounded-4xl overflow-hidden bg-mocha/40 border border-foreground/5 shadow-2xl">
        <div className="relative w-full aspect-4/5">
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Content area */}
            <div className="w-full h-full flex items-center justify-center">
              <div className="relative w-full h-full">
                <div className={`absolute inset-0 transition-opacity duration-500 z-10 ${tab === "image" ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
                  <Image
                    src={imageSrc}
                    alt={alt ?? "Product image"}
                    fill
                    priority={true}
                    quality={100}
                    sizes="(min-width: 1024px) 800px, 100vw"
                    className="object-cover w-full h-full"
                  />
                </div>

                <div className={`absolute inset-0 transition-opacity duration-500 z-20 ${tab === "3d" ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
                  <div className="p-6 h-full bg-background/80 backdrop-blur-sm">
                    {tab === "3d" && <Product3DViewer modelUrl={modelUrl ?? null} />}
                  </div>
                </div>

                <div className={`absolute inset-0 transition-opacity duration-500 z-30 bg-black ${tab === "video" ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
                  <div className="p-6 h-full flex items-center justify-center">
                    {tab === "video" && <ProductVideo videoUrl={videoUrl ?? null} />}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 flex items-center justify-between gap-4">
          <div className="flex gap-2">
            <TabButton id="image" label="Image" />
            <TabButton id="3d" label="3D Preview" />
            <TabButton id="video" label="Video" />
          </div>

          <div className="text-xs text-foreground/60 font-mono">{tab === "image" ? "Image" : tab === "3d" ? "3D Preview" : "Video"}</div>
        </div>
      </div>
    </div>
  );
}
