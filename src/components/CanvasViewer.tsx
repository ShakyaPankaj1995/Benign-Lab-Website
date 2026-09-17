"use client";

import { useEffect, useRef, useState } from "react";
import { useScroll, useTransform, useSpring, motion } from "framer-motion";

import { MotionValue } from "framer-motion";

const TOTAL_FRAMES = 720;

interface CanvasViewerProps {
  progress: MotionValue<number>;
  xOffsetPercent?: MotionValue<number>;
}

export default function CanvasViewer({ progress, xOffsetPercent }: CanvasViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [loadedFrames, setLoadedFrames] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  
  // Add a tiny lerp (spring) so scrubbing feels mechanical but not laggy
  const springProgress = useSpring(progress, {
    stiffness: 400,
    damping: 90,
    mass: 0.1,
  });

  // Map progress to frame index 0-719
  const frameIndex = useTransform(springProgress, [0, 1], [0, TOTAL_FRAMES - 1]);

  useEffect(() => {
    // Preload images
    let loaded = 0;
    const images: HTMLImageElement[] = [];
    
    // For performance, we could load every Nth frame first, but let's just load them sequentially
    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const img = new Image();
      const frameNum = String(i).padStart(4, "0");
      img.src = `/Benign-Lab-Website/sequence/frame_${frameNum}.png`;
      img.onload = () => {
        loaded++;
        setLoadedFrames(loaded);
        if (loaded === TOTAL_FRAMES) {
          setIsLoaded(true);
        }
      };
      // If error, count as loaded so we don't hang
      img.onerror = () => {
        loaded++;
        setLoadedFrames(loaded);
        if (loaded === TOTAL_FRAMES) {
          setIsLoaded(true);
        }
      };
      images.push(img);
    }
    imagesRef.current = images;
  }, []);

  useEffect(() => {
    if (!isLoaded || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let currentFrame = -1;
    let animationFrameId: number;

    // Offscreen canvas for sampling edge color
    const offscreen = document.createElement("canvas");
    offscreen.width = 1;
    offscreen.height = 1;
    const offCtx = offscreen.getContext("2d", { willReadFrequently: true });

    const resizeAndDraw = () => {
      // Setup DPR-scaled canvas
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      
      ctx.scale(dpr, dpr);
      
      // Draw current frame
      drawFrame(currentFrame === -1 ? 0 : currentFrame);
    };

    const drawFrame = (index: number) => {
      const img = imagesRef.current[index];
      if (!img) return;
      
      const canvasW = canvas.width / (window.devicePixelRatio || 1);
      const canvasH = canvas.height / (window.devicePixelRatio || 1);
      
      let canvasFillStyle: string | CanvasGradient = "black";
      
      // Update dynamic background color by sampling left edge (10, 10) and right edge (width-10, 10)
      if (offCtx) {
        // Sample left
        offCtx.clearRect(0,0,1,1);
        offCtx.drawImage(img, 10, 10, 1, 1, 0, 0, 1, 1);
        const leftData = offCtx.getImageData(0,0,1,1).data;
        const leftRgb = `${leftData[0]}, ${leftData[1]}, ${leftData[2]}`;
        
        // Sample right
        offCtx.clearRect(0,0,1,1);
        offCtx.drawImage(img, img.width - 10, 10, 1, 1, 0, 0, 1, 1);
        const rightData = offCtx.getImageData(0,0,1,1).data;
        const rightRgb = `${rightData[0]}, ${rightData[1]}, ${rightData[2]}`;

        document.documentElement.style.setProperty("--void", leftRgb); // using left as base
        document.documentElement.style.setProperty("--bg-gradient", `linear-gradient(90deg, rgb(${leftRgb}) 0%, rgb(${rightRgb}) 100%)`);
        
        const grad = ctx.createLinearGradient(0, 0, canvasW, 0);
        grad.addColorStop(0, `rgb(${leftRgb})`);
        grad.addColorStop(1, `rgb(${rightRgb})`);
        canvasFillStyle = grad;
      }
      
      const imgW = img.width;
      const imgH = img.height;
      
      // Navigation bar padding (approx 80px)
      const navPadding = 80;
      const drawAreaH = canvasH - navPadding;
      
      // object-fit: contain (fully visible)
      const scale = Math.min(canvasW / imgW, drawAreaH / imgH);
      
      const offsetPercent = xOffsetPercent ? xOffsetPercent.get() : 0;
      const additionalX = (canvasW * (offsetPercent / 100));
      const x = (canvasW / 2) - (imgW / 2) * scale + additionalX;
      const y = navPadding + (drawAreaH / 2) - (imgH / 2) * scale;
      
      // Clear before drawing using the exact matched gradient
      ctx.fillStyle = canvasFillStyle;
      ctx.fillRect(0, 0, canvasW, canvasH);
      
      // Enable high-quality smoothing for upscaling/downscaling
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      
      // Draw the main image centered within the padded area
      ctx.drawImage(img, x, y, imgW * scale, imgH * scale);
    };

    // Initial setup
    resizeAndDraw();
    window.addEventListener("resize", resizeAndDraw);

    // Subscribe to framer-motion changes
    const unsubscribe = frameIndex.on("change", (latest) => {
      const roundedFrame = Math.round(latest);
      if (roundedFrame !== currentFrame) {
        currentFrame = roundedFrame;
        animationFrameId = requestAnimationFrame(() => drawFrame(currentFrame));
      }
    });

    return () => {
      window.removeEventListener("resize", resizeAndDraw);
      unsubscribe();
      cancelAnimationFrame(animationFrameId);
    };
  }, [isLoaded, frameIndex]);

  return (
    <div ref={containerRef} className="fixed inset-0 w-full h-full z-0" aria-hidden="true">
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-void text-ink font-semibold z-50">
          Loading sequence... {Math.round((loadedFrames / TOTAL_FRAMES) * 100)}%
        </div>
      )}
      <canvas
        ref={canvasRef}
        className="w-full h-full object-cover"
      />
    </div>
  );
}
