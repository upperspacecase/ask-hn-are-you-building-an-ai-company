"use client";

import dynamic from "next/dynamic";
import { useSyncExternalStore } from "react";

const PlayerInner = dynamic(() => import("./PlayerInner"), {
  ssr: false,
  loading: () => <PlayerPoster />,
});

function PlayerPoster() {
  return (
    <div
      aria-hidden
      className="flex h-full w-full items-center justify-center bg-surface"
    >
      <span className="body tracking-widest text-muted">LOADING DEMO</span>
    </div>
  );
}

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

function subscribeReducedMotion(onChange: () => void) {
  const mq = window.matchMedia(REDUCED_MOTION);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

function getReducedMotion() {
  return window.matchMedia(REDUCED_MOTION).matches;
}

export default function DemoPlayer() {
  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotion,
    () => false
  );

  return (
    <div>
      <div
        className="relative w-full overflow-hidden rounded-lg border border-line bg-surface"
        style={{ aspectRatio: "1280 / 620" }}
      >
        <PlayerInner reducedMotion={reducedMotion} />
      </div>
      <p className="body mt-5 max-w-3xl text-muted">
        One question about one client. The answer is assembled from that
        client&rsquo;s call transcript, open ticket, deploy log and deployment
        config, each line cited back to its source. Sample data for a
        fictional client; your own data never leaves your VPC except for the
        model endpoint you configure.
      </p>
    </div>
  );
}
