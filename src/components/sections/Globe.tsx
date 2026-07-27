"use client";

import { useEffect, useRef } from "react";

import { Container } from "@/components/ui/Container";
import { CtaRow } from "@/components/ui/CtaRow";
import { LockInButton } from "@/components/ui/LockInButton";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { globeMarkers } from "@/content/marketing";
import styles from "./Globe.module.css";

type GlobeInstance = ReturnType<typeof import("cobe").default>;

/** Pixels of horizontal drag per radian of extra rotation. */
const MOVEMENT_DAMPING = 1400;

/** Critically-ish damped spring the drag feeds into: mass 1, damping 30, stiffness 100. */
function makeSpring() {
  const mass = 1;
  const damping = 30;
  const stiffness = 100;
  let value = 0;
  let velocity = 0;
  let target = 0;

  return {
    set(v: number) {
      target = v;
    },
    get() {
      return value;
    },
    tick(dt: number) {
      const force = -stiffness * (value - target) - damping * velocity;
      velocity += (force / mass) * dt;
      value += velocity * dt;
    },
  };
}

export function Globe() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let created = false;
    let disposed = false;
    let teardown: (() => void) | null = null;

    const create = () => {
      // cobe is pulled in only once the section is near the viewport, so the
      // WebGL bundle never lands in the page's initial JS.
      import("cobe")
        .then(({ default: createGlobe }) => {
          if (disposed) return;

          let phi = 0;
          // offsetWidth reads 0 while the section is display:none-adjacent;
          // fall back rather than build a zero-size draw buffer.
          let width = canvas.offsetWidth || 600;
          let pointerInteracting: number | null = null;
          const rotation = makeSpring();
          let lastTime = performance.now();

          const onResize = () => {
            width = canvas.offsetWidth || width;
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
          // The grab origin is never re-baselined, so every move event adds its
          // whole offset again — the drag accelerates the further you pull.
          const onPointerMove = (e: PointerEvent) => {
            if (pointerInteracting === null) return;
            const delta = e.clientX - pointerInteracting;
            rotation.set(rotation.get() + delta / MOVEMENT_DAMPING);
          };
          const onTouchMove = (e: TouchEvent) => {
            const touch = e.touches[0];
            if (!touch || pointerInteracting === null) return;
            const delta = touch.clientX - pointerInteracting;
            rotation.set(rotation.get() + delta / MOVEMENT_DAMPING);
          };

          window.addEventListener("resize", onResize);
          canvas.addEventListener("pointerdown", onPointerDown);
          window.addEventListener("pointerup", onPointerUp);
          window.addEventListener("pointerout", onPointerUp);
          window.addEventListener("pointermove", onPointerMove);
          canvas.addEventListener("touchmove", onTouchMove, { passive: true });

          const globe: GlobeInstance = createGlobe(canvas, {
            devicePixelRatio: Math.min(window.devicePixelRatio, 2),
            width: width * 2,
            height: width * 2,
            phi: 0,
            theta: 0.3,
            dark: 0,
            diffuse: 0.4,
            mapSamples: 16000,
            mapBrightness: 1.2,
            baseColor: [1, 1, 1],
            markerColor: [251 / 255, 100 / 255, 21 / 255],
            glowColor: [1, 1, 1],
            markers: globeMarkers,
            onRender: (state) => {
              const now = performance.now();
              // Clamp so a backgrounded tab does not fling the spring on return.
              const dt = Math.min((now - lastTime) / 1000, 0.05);
              lastTime = now;
              rotation.tick(dt);
              if (!pointerInteracting) phi += 0.005;
              state.phi = phi + rotation.get();
              state.width = width * 2;
              state.height = width * 2;
            },
          });

          requestAnimationFrame(() => {
            canvas.style.opacity = "1";
          });

          teardown = () => {
            window.removeEventListener("resize", onResize);
            canvas.removeEventListener("pointerdown", onPointerDown);
            window.removeEventListener("pointerup", onPointerUp);
            window.removeEventListener("pointerout", onPointerUp);
            window.removeEventListener("pointermove", onPointerMove);
            canvas.removeEventListener("touchmove", onTouchMove);
            globe.destroy();
          };
        })
        .catch(() => {});
    };

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          // Built once for the page's lifetime — destroying on scroll-out would
          // reset the accumulated longitude and re-run the fade-in every pass.
          if (e.isIntersecting && !created) {
            created = true;
            create();
          }
        });
      },
      { rootMargin: "200px 0px", threshold: 0.05 },
    );
    io.observe(canvas);

    return () => {
      disposed = true;
      io.disconnect();
      teardown?.();
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
        <div className={styles.wrap}>
          <canvas className={styles.canvas} ref={canvasRef} />
          <div className={styles.fade} />
        </div>

        <CtaRow variant="peep">
          <LockInButton label="Lock in with them" />
        </CtaRow>
      </Container>
    </section>
  );
}
