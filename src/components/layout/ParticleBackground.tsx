"use client";

import { useEffect, useRef } from "react";

/**
 * One Piece themed particle background.
 * Particles: golden coins (spinning), sea bubbles (drifting up),
 * small stars (twinkling), and occasional cherry blossom petals.
 */
export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    type ParticleType = "coin" | "bubble" | "star" | "petal";

    interface Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;
      type: ParticleType;
      rotation: number;
      rotationSpeed: number;
      phase: number; // For twinkling/wobble
    }

    const count = 35;
    const particles: Particle[] = Array.from({ length: count }, () => {
      const type: ParticleType = (() => {
        const r = Math.random();
        if (r < 0.3) return "coin";
        if (r < 0.55) return "bubble";
        if (r < 0.85) return "star";
        return "petal";
      })();

      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: type === "coin" ? Math.random() * 2.5 + 1 : type === "petal" ? Math.random() * 3 + 1.5 : Math.random() * 1.5 + 0.5,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: type === "bubble" ? -(Math.random() * 0.4 + 0.1) : type === "petal" ? Math.random() * 0.3 + 0.1 : (Math.random() - 0.5) * 0.15,
        opacity: Math.random() * 0.4 + 0.1,
        type,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.02,
        phase: Math.random() * Math.PI * 2,
      };
    });

    let frame = 0;
    let animationId: number;

    const drawCoin = (ctx: CanvasRenderingContext2D, p: Particle) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      const squish = Math.abs(Math.cos(p.rotation));
      ctx.scale(squish, 1);
      ctx.beginPath();
      ctx.arc(0, 0, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 215, 0, ${p.opacity})`;
      ctx.fill();
      ctx.strokeStyle = `rgba(218, 165, 32, ${p.opacity * 0.6})`;
      ctx.lineWidth = 0.5;
      ctx.stroke();
      ctx.restore();
    };

    const drawBubble = (ctx: CanvasRenderingContext2D, p: Particle) => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(100, 200, 255, ${p.opacity * 0.4})`;
      ctx.lineWidth = 0.5;
      ctx.stroke();
      // Highlight
      ctx.beginPath();
      ctx.arc(p.x - p.size * 0.3, p.y - p.size * 0.3, p.size * 0.25, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(200, 240, 255, ${p.opacity * 0.3})`;
      ctx.fill();
    };

    const drawStar = (ctx: CanvasRenderingContext2D, p: Particle) => {
      const twinkle = (Math.sin(frame * 0.03 + p.phase) + 1) / 2;
      const alpha = p.opacity * (0.3 + twinkle * 0.7);
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * (0.6 + twinkle * 0.4), 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 215, 0, ${alpha})`;
      ctx.fill();
    };

    const drawPetal = (ctx: CanvasRenderingContext2D, p: Particle) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.beginPath();
      ctx.ellipse(0, 0, p.size, p.size * 0.4, 0, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 183, 197, ${p.opacity * 0.5})`;
      ctx.fill();
      ctx.restore();
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      frame++;

      for (const p of particles) {
        // Wobble for petals
        const wobble = p.type === "petal" ? Math.sin(frame * 0.02 + p.phase) * 0.5 : 0;
        p.x += p.speedX + wobble;
        p.y += p.speedY;
        p.rotation += p.rotationSpeed;

        // Wrap around
        if (p.x < -10) p.x = canvas.width + 10;
        if (p.x > canvas.width + 10) p.x = -10;
        if (p.y < -10) p.y = canvas.height + 10;
        if (p.y > canvas.height + 10) p.y = -10;

        switch (p.type) {
          case "coin": drawCoin(ctx, p); break;
          case "bubble": drawBubble(ctx, p); break;
          case "star": drawStar(ctx, p); break;
          case "petal": drawPetal(ctx, p); break;
        }
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      aria-hidden="true"
    />
  );
}
