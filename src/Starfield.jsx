// src/Starfield.jsx
import { useCallback } from "react";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";

export default function Starfield() {
  const particlesInit = useCallback(async engine => {
    await loadFull(engine);
  }, []);

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      options={{
        fullScreen: { enable: true, zIndex: -1 },
        background: {
          color: "#000000",
        },
        particles: {
          number: { value: 200 },
          size: { 
            value: { min: 1, max: 3 },
            random: true 
          },
          color: { value: "#ffffff" },
          move: { 
            enable: true, 
            speed: 0.8,
            direction: "none",
            random: true,
            outModes: "out"
          },
          opacity: { 
            value: { min: 0.3, max: 1 },
            random: true,
            animation: {
              enable: true,
              speed: 1,
              minimumValue: 0.1,
              sync: false
            }
          },
        },
        interactivity: {
          events: { onClick: { enable: false }, onHover: { enable: false } },
        },
      }}
    />
  );
}