"use client";

import { Player } from "@remotion/player";
import {
  Demo,
  DEMO_DURATION,
  DEMO_FPS,
  DEMO_HEIGHT,
  DEMO_WIDTH,
} from "../../remotion/Demo";

export default function PlayerInner({
  reducedMotion,
}: {
  reducedMotion: boolean;
}) {
  return (
    <Player
      component={Demo}
      durationInFrames={DEMO_DURATION}
      fps={DEMO_FPS}
      compositionWidth={DEMO_WIDTH}
      compositionHeight={DEMO_HEIGHT}
      autoPlay={!reducedMotion}
      loop
      initiallyMuted
      acknowledgeRemotionLicense
      controls={false}
      clickToPlay={false}
      doubleClickToFullscreen={false}
      style={{ width: "100%", height: "100%" }}
    />
  );
}
