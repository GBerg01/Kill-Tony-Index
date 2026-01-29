"use client";

import { useEffect, useState } from "react";

import { buildShareText } from "@/lib/share";
import type { Performance } from "@/lib/kt-index-data";

type ShareButtonsProps = {
  performance: Performance;
};

export const ShareButtons = ({ performance }: ShareButtonsProps) => {
  const shareText = buildShareText(performance);
  const [indexUrl, setIndexUrl] = useState("");

  useEffect(() => {
    setIndexUrl(`${window.location.origin}/performances/${performance.id}`);
  }, [performance.id]);

  const handleCopy = async (text: string) => {
    if (!navigator.clipboard) return;
    await navigator.clipboard.writeText(text);
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: `${performance.contestantName} — Kill Tony #${performance.episodeNumber}`,
        text: shareText,
        url: indexUrl,
      });
      return;
    }
    await handleCopy(`${shareText} ${indexUrl}`);
  };

  return (
    <div className="flex flex-wrap gap-3">
      <button
        className="rounded-full border border-kt-border bg-kt-card px-4 py-2 text-xs font-semibold text-white/80 transition hover:border-white/40 hover:text-white"
        onClick={() => handleCopy(indexUrl)}
        type="button"
      >
        Copy Index Link
      </button>
      <button
        className="rounded-full border border-kt-border bg-kt-card px-4 py-2 text-xs font-semibold text-white/80 transition hover:border-white/40 hover:text-white"
        onClick={handleShare}
        type="button"
      >
        Share
      </button>
      <button
        className="rounded-full border border-kt-border bg-kt-card px-4 py-2 text-xs font-semibold text-white/80 transition hover:border-white/40 hover:text-white"
        onClick={() => handleCopy(performance.youtubeJumpUrl)}
        type="button"
      >
        Copy YouTube Timestamp Link
      </button>
    </div>
  );
};
