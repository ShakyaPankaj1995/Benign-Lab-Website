"use client";

import { useEffect, useRef, useState } from "react";
import { useScroll, useTransform, useSpring, motion, MotionValue } from "framer-motion";

const TOTAL_FRAMES = 720;

interface CanvasViewerProps {
  progress: MotionValue<number>;
  xOffsetPercent?: MotionValue<number>;
}

export default function CanvasViewer({ progress, xOffsetPercent }: CanvasViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isReady, setIsReady] = useState(false);
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
    // We do not want to trigger 720 React state updates (especially from cache) 
    // as it can cause a client-side exception/crash.
    const images: HTMLImageElement[] = [];
    
    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const img = new Image();
      const frameNum = String(i).padStart(4, "0");
      
      img.onload = () => {
        // Unlock the UI the millisecond the VERY FIRST frame loads
        // This solves the massive loading delay
        if (i === 0) {
          setIsReady(true);
        }
      };
      
      img.onerror = () => {
        if (i === 0) setIsReady(true); // Fallback
      };
      
      // Start loading
      img.src = `/Benign-Lab-Website/sequence/frame_${frameNum}.png`;
      images.push(img);
    }
    
    imagesRef.current = images;
  }, []);

  useEffect(() => {
    if (!isReady || !canvasRef.current) return;
    
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
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      
      ctx.scale(dpr, dpr);
      drawFrame(currentFrame === -1 ? 0 : currentFrame);
    };

    const drawFrame = (index: number) => {
      const img = imagesRef.current[index];
      
      // Safety check: Only draw if the image has successfully finished loading its data
      if (!img || !img.complete || img.naturalWidth === 0) {
        return;
      }
      
      const canvasW = canvas.width / (window.devicePixelRatio || 1);
      const canvasH = canvas.height / (window.devicePixelRatio || 1);
      
      let canvasFillStyle: string | CanvasGradient = "black";
      
      if (offCtx) {
        offCtx.clearRect(0,0,1,1);
        offCtx.drawImage(img, 10, 10, 1, 1, 0, 0, 1, 1);
        const leftData = offCtx.getImageData(0,0,1,1).data;
        const leftRgb = `${leftData[0]}, ${leftData[1]}, ${leftData[2]}`;
        
        offCtx.clearRect(0,0,1,1);
        offCtx.drawImage(img, img.width - 10, 10, 1, 1, 0, 0, 1, 1);
        const rightData = offCtx.getImageData(0,0,1,1).data;
        const rightRgb = `${rightData[0]}, ${rightData[1]}, ${rightData[2]}`;

        document.documentElement.style.setProperty("--void", leftRgb);
        document.documentElement.style.setProperty("--bg-gradient", `linear-gradient(90deg, rgb(${leftRgb}) 0%, rgb(${rightRgb}) 100%)`);
        
        const grad = ctx.createLinearGradient(0, 0, canvasW, 0);
        grad.addColorStop(0, `rgb(${leftRgb})`);
        grad.addColorStop(1, `rgb(${rightRgb})`);
        canvasFillStyle = grad;
      }
      
      const imgW = img.width;
      const imgH = img.height;
      const navPadding = 80;
      const drawAreaH = canvasH - navPadding;
      
      const scale = Math.min(canvasW / imgW, drawAreaH / imgH);
      
      const offsetPercent = xOffsetPercent ? xOffsetPercent.get() : 0;
      const additionalX = (canvasW * (offsetPercent / 100));
      const x = (canvasW / 2) - (imgW / 2) * scale + additionalX;
      const y = navPadding + (drawAreaH / 2) - (imgH / 2) * scale;
      
      ctx.fillStyle = canvasFillStyle;
      ctx.fillRect(0, 0, canvasW, canvasH);
      
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      
      ctx.drawImage(img, x, y, imgW * scale, imgH * scale);
    };

    resizeAndDraw();
    window.addEventListener("resize", resizeAndDraw);

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
  }, [isReady, frameIndex, xOffsetPercent]);

  return (
    <div ref={containerRef} className="fixed inset-0 w-full h-full z-0" aria-hidden="true">
      {!isReady && (
        <div className="absolute inset-0 bg-void z-50 transition-opacity duration-500" />
      )}
      <canvas
        ref={canvasRef}
        className="w-full h-full object-cover"
      />
    </div>
  );
}
