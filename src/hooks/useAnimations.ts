import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Hook for GSAP animations
export const useGSAP = (
  animationFn: (context: gsap.Context) => void,
  dependencies: React.DependencyList = []
) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(animationFn, containerRef);
    return () => ctx.revert();
  }, dependencies);

  return containerRef;
};

// Hook for fade in animation on scroll
export const useFadeInOnScroll = (delay: number = 0) => {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!elementRef.current) return;

    gsap.fromTo(
      elementRef.current,
      {
        opacity: 0,
        y: 50,
      },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        delay,
        ease: "power3.out",
        scrollTrigger: {
          trigger: elementRef.current,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse",
        },
      }
    );
  }, [delay]);

  return elementRef;
};

// Hook for stagger animation of children
export const useStaggerAnimation = (
  selector: string = ".animate-item",
  stagger: number = 0.1
) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const animate = () => {
    if (!containerRef.current) return;

    gsap.fromTo(
      containerRef.current.querySelectorAll(selector),
      {
        opacity: 0,
        y: 30,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger,
        ease: "power3.out",
      }
    );
  };

  return { containerRef, animate };
};

// Hook for loading animation
export const useLoadingAnimation = (isLoading: boolean) => {
  const loadingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!loadingRef.current) return;

    if (isLoading) {
      gsap.to(loadingRef.current, {
        opacity: 1,
        scale: 1,
        duration: 0.3,
        ease: "power2.out",
      });

      // Animate loading dots
      gsap.to(loadingRef.current.querySelectorAll(".loading-dot"), {
        y: -10,
        duration: 0.6,
        ease: "power2.inOut",
        stagger: 0.1,
        repeat: -1,
        yoyo: true,
      });
    } else {
      gsap.to(loadingRef.current, {
        opacity: 0,
        scale: 0.9,
        duration: 0.3,
        ease: "power2.in",
      });
    }
  }, [isLoading]);

  return loadingRef;
};

// Hook for slide in from left animation
export const useSlideInFromLeft = (delay: number = 0) => {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!elementRef.current) return;

    gsap.fromTo(
      elementRef.current,
      {
        opacity: 0,
        x: -100,
        scale: 0.95,
      },
      {
        opacity: 1,
        x: 0,
        scale: 1,
        duration: 1.2,
        delay,
        ease: "power3.out",
        scrollTrigger: {
          trigger: elementRef.current,
          start: "top 85%",
          end: "bottom 20%",
          toggleActions: "play none none reverse",
        },
      }
    );
  }, [delay]);

  return elementRef;
};

// Hook for slide in from right animation
export const useSlideInFromRight = (delay: number = 0) => {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!elementRef.current) return;

    gsap.fromTo(
      elementRef.current,
      {
        opacity: 0,
        x: 100,
        scale: 0.95,
      },
      {
        opacity: 1,
        x: 0,
        scale: 1,
        duration: 1.2,
        delay,
        ease: "power3.out",
        scrollTrigger: {
          trigger: elementRef.current,
          start: "top 85%",
          end: "bottom 20%",
          toggleActions: "play none none reverse",
        },
      }
    );
  }, [delay]);

  return elementRef;
};

// Hook for scale up animation on scroll
export const useScaleOnScroll = (delay: number = 0) => {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!elementRef.current) return;

    gsap.fromTo(
      elementRef.current,
      {
        opacity: 0,
        scale: 0.8,
        rotateY: 15,
      },
      {
        opacity: 1,
        scale: 1,
        rotateY: 0,
        duration: 1,
        delay,
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: elementRef.current,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse",
        },
      }
    );
  }, [delay]);

  return elementRef;
};

// Hook for parallax scroll effect
export const useParallaxScroll = (speed: number = 0.5) => {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!elementRef.current) return;

    gsap.to(elementRef.current, {
      yPercent: -50 * speed,
      ease: "none",
      scrollTrigger: {
        trigger: elementRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    });
  }, [speed]);

  return elementRef;
};

// Hook for counter animation
export const useCounterAnimation = (
  endValue: number,
  duration: number = 2,
  trigger?: string
) => {
  const elementRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!elementRef.current) return;

    const obj = { value: 0 };

    gsap.to(obj, {
      value: endValue,
      duration,
      ease: "power2.out",
      onUpdate: () => {
        if (elementRef.current) {
          elementRef.current.textContent = Math.round(
            obj.value
          ).toLocaleString();
        }
      },
      scrollTrigger: trigger
        ? {
            trigger: trigger,
            start: "top 80%",
            toggleActions: "play none none none",
          }
        : undefined,
    });
  }, [endValue, duration, trigger]);

  return elementRef;
};

// Hook for form validation animations
export const useFormValidation = () => {
  const shakeElement = (element: HTMLElement) => {
    gsap.fromTo(
      element,
      { x: 0 },
      {
        x: -5,
        duration: 0.1,
        repeat: 5,
        yoyo: true,
        ease: "power2.inOut",
        onComplete: () => {
          gsap.set(element, { x: 0 });
        },
      }
    );
  };

  const highlightError = (element: HTMLElement) => {
    gsap.fromTo(
      element,
      { boxShadow: "0 0 0 2px transparent" },
      {
        boxShadow: "0 0 0 2px #ef4444",
        duration: 0.3,
        ease: "power2.out",
        yoyo: true,
        repeat: 1,
      }
    );
  };

  return { shakeElement, highlightError };
};
