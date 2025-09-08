"use client";
import { useCallback } from "react";
import Particles from "react-tsparticles";
import type { Engine } from "tsparticles-engine";
import { loadSlim } from "tsparticles-slim";

export default function AnimatedBackground() {
  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine);
  }, []);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-black">
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
          fullScreen: { enable: true, zIndex: -1 },
          background: { color: { value: "#000" } },
          particles: {
            number: {
              value: 20,
              density: {
                enable: true,
                area: 800,
              },
            },
            color: {
              value: ["#fffd98", "#bde4a7", "#b3d2b2", "#7a9cc6"],
            },
            shape: { type: "circle" },
            opacity: {
              value: 1,
              random: { enable: true, minimumValue: 0.2 },
            },
            size: {
              value: 80,
              random: { enable: true, minimumValue: 40 },
            },
            move: {
              enable: true,
              speed: 1.5,
              direction: "none",
              outModes: { default: "bounce" },
            },
            links: { enable: false },
          },
          detectRetina: true,
        }}
      />
      <div className="absolute inset-0 backdrop-blur-3xl pointer-events-none" />
    </div>
  );
}
