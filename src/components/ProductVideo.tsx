"use client";

import { useState } from "react";
import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  videoUrl?: string | null;
}

export default function ProductVideo({ videoUrl }: Props) {
  const [showPlayer, setShowPlayer] = useState(false);

  const isYouTube = (url?: string | null) => {
    if (!url) return false;
    return /youtube\.com|youtu\.be/.test(url);
  };

  return (
    <div className="animate-fade-up" style={{ animationDelay: "150ms" }}>
      <label className="font-mono text-xs uppercase text-foreground/60 mb-3 block">Product Video</label>

      {videoUrl ? (
        <div className="rounded-2xl overflow-hidden border border-foreground/5 shadow-2xl bg-black">
          {isYouTube(videoUrl) ? (
            <div className="relative" style={{ paddingTop: '56.25%' }}>
              <iframe
                src={videoUrl.replace('watch?v=', 'embed/')}
                title="Product video"
                className="absolute inset-0 w-full h-full"
                frameBorder={0}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : (
            <video controls className="w-full h-auto">
              <source src={videoUrl} />
              Your browser does not support the video tag.
            </video>
          )}
        </div>
      ) : (
        <div className="rounded-2xl overflow-hidden border border-foreground/5 shadow-2xl bg-black/30 flex items-center justify-center px-6 py-12">
          <div className="flex items-center gap-6">
            <Button
              variant="ghost"
              onClick={() => setShowPlayer(true)}
              className="w-16 h-16 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow-md animate-pulse p-0"
              aria-label="Play video placeholder"
            >
              <Play className="w-6 h-6 text-black" fill="currentColor" />
            </Button>
            <div>
              <div className="text-lg font-bold">Product Video Coming Soon</div>
              <div className="text-foreground/60 text-sm">Were preparing a short showcase for this piece.</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
