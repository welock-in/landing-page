"use client";

import createGlobe from "cobe";
import { useEffect, useRef } from "react";

import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { globeMarkers } from "@/content/marketing";
import styles from "./Globe.module.css";

type GlobeInstance = ReturnType<typeof createGlobe>;

export function Globe() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const globeRef = useRef<GlobeInstance | null>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;

    let phi = 0;
    let width = 0;
    let pointerInteracting: number | null = null;
    let rotation = 0;
    let curRotation = 0;

    const onResize = () => {
      width = canvas.offsetWidth;
    };

    const setGrab = (grabbing: boolean) => {
      canvas.style.cursor = grabbing ? "grabbing" : "grab";
    };

    const onPointerDown = (e: PointerEvent) => {
      pointerInteracting = e.clientX;
      setGrab(true);
    };
    const onPointerUp = () => {
      pointerInteracting = null;
      setGrab(false);
    };
    const onPointerMove = (e: PointerEvent) => {
      if (pointerInteracting !== null) {
        rotation = (e.clientX - pointerInteracting) / 200;
      }
    };
    const onTouchMove = (e: TouchEvent) => {
      if (pointerInteracting !== null && e.touches[0]) {
        rotation = (e.touches[0].clientX - pointerInteracting) / 100;
      }
    };

    const attachInput = () => {
      window.addEventListener("resize", onResize);
      canvas.addEventListener("pointerdown", onPointerDown);
      window.addEventListener("pointerup", onPointerUp);
      window.addEventListener("pointerout", onPointerUp);
      window.addEventListener("pointermove", onPointerMove);
      canvas.addEventListener("touchmove", onTouchMove, { passive: true });
    };

    const detachInput = () => {
      window.removeEventListener("resize", onResize);
      canvas.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointerout", onPointerUp);
      window.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("touchmove", onTouchMove);
    };

    const destroyGlobe = () => {
      detachInput();
      globeRef.current?.destroy();
      globeRef.current = null;
      canvas.style.opacity = "0";
    };

    const createGlobeInstance = () => {
      if (globeRef.current) return;
      onResize();
      attachInput();

      globeRef.current = createGlobe(canvas, {
        devicePixelRatio: Math.min(window.devicePixelRatio, 1.5),
        width: width * 2,
        height: width * 2,
        phi: 0,
        theta: 0.28,
        dark: 0,
        diffuse: 0.45,
        mapSamples: 8000,
        mapBrightness: 1.15,
        baseColor: [0.96, 0.94, 0.91],
        markerColor: [200 / 255, 64 / 255, 47 / 255],
        glowColor: [0.96, 0.94, 0.91],
        markers: globeMarkers,
        onRender: (state) => {
          if (!pointerInteracting) phi += 0.005;
          curRotation += (rotation - curRotation) * 0.08;
          state.phi = phi + curRotation;
          state.width = width * 2;
          state.height = width * 2;
        },
      });

      requestAnimationFrame(() => {
        canvas.style.opacity = "1";
      });
    };

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) createGlobeInstance();
          else destroyGlobe();
        });
      },
      { rootMargin: "200px 0px", threshold: 0.05 },
    );
    io.observe(wrap);

    return () => {
      io.disconnect();
      destroyGlobe();
    };
  }, []);

  return (
    <section className={styles.section}>
      <Container>
        <SectionHeading
          eyebrow="Community"
          title="Locked in all around the globe."
          description="From Lausanne to Tokyo, students are focusing with WeLockIn right now."
          className={styles.head}
        />
        <div className={styles.wrap} ref={wrapRef}>
          <canvas className={styles.canvas} ref={canvasRef} />
          <div className={styles.fade} />
        </div>
      </Container>
    </section>
  );
}
