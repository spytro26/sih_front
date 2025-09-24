import { useEffect, useRef } from "react";
import LocomotiveScroll from "locomotive-scroll";
import "locomotive-scroll/dist/locomotive-scroll.css";

interface UseLocomotiveScrollReturn {
  scrollRef: React.RefObject<HTMLDivElement | null>;
  locomotiveScroll: React.MutableRefObject<LocomotiveScroll | null>;
  updateScroll: () => void;
  scrollTo: (target: string | HTMLElement, options?: any) => void;
  scrollToTop: () => void;
}

export const useLocomotiveScroll = (): UseLocomotiveScrollReturn => {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const locomotiveScroll = useRef<LocomotiveScroll | null>(null);

  useEffect(() => {
    if (!scrollRef.current) return;

    try {
      // Initialize Locomotive Scroll with error handling
      locomotiveScroll.current = new LocomotiveScroll({
        el: scrollRef.current,
        smooth: true,
        multiplier: 1,
        class: "is-revealed",
        scrollbarContainer: false,
        // Add tablet/mobile settings to prevent issues
        tablet: {
          smooth: true,
          breakpoint: 1024,
        },
        smartphone: {
          smooth: false,
        },
      });

      // Update scroll on window resize
      const handleResize = () => {
        if (locomotiveScroll.current) {
          try {
            locomotiveScroll.current.update();
          } catch (error) {
            console.warn("Locomotive Scroll update error:", error);
          }
        }
      };

      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
        if (locomotiveScroll.current) {
          try {
            locomotiveScroll.current.destroy();
          } catch (error) {
            console.warn("Locomotive Scroll destroy error:", error);
          }
        }
      };
    } catch (error) {
      console.warn("Failed to initialize Locomotive Scroll:", error);
      return () => {}; // Return empty cleanup function
    }
  }, []);

  // Update scroll when content changes
  const updateScroll = () => {
    if (locomotiveScroll.current) {
      try {
        locomotiveScroll.current.update();
      } catch (error) {
        console.warn("Locomotive Scroll update error:", error);
      }
    }
  };

  // Scroll to element
  const scrollTo = (target: string | HTMLElement, options?: any) => {
    if (locomotiveScroll.current) {
      try {
        locomotiveScroll.current.scrollTo(target, options);
      } catch (error) {
        console.warn("Locomotive Scroll scrollTo error:", error);
      }
    }
  };

  // Scroll to top
  const scrollToTop = () => {
    if (locomotiveScroll.current) {
      try {
        locomotiveScroll.current.scrollTo("top");
      } catch (error) {
        console.warn("Locomotive Scroll scrollToTop error:", error);
      }
    }
  };

  return {
    scrollRef,
    locomotiveScroll,
    updateScroll,
    scrollTo,
    scrollToTop,
  };
};
