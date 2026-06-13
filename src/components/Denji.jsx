import { useRef, useEffect, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import denjiBody from "/denji-body.svg";
import denjiHand from "/denji-hand.svg";

gsap.registerPlugin(ScrollTrigger, CustomEase);

const containerStyle = {
  position: "relative",
  width: "100%",
  height: "100%",
  display: "flex",
  backgroundColor: "var(--dark-green)",
  borderRadius: "9px",
  justifyContent: "center",
  alignItems: "end",
  overflow: "hidden",
  padding: "18px 18px 0 18px",
  boxSizing: "border-box",
  border: "3px solid var(--off-teal)",
};

const baseRectStyle = {
  position: "absolute",
  left: 0,
  width: "100%",
};

const rectConfigs = [
  { zIndex: 5, backgroundColor: "#006352", height: "60px" },
  { zIndex: 4, backgroundColor: "#00735F", height: "120px" },
  { zIndex: 3, backgroundColor: "#00826B", height: "150px" },
  { zIndex: 2, backgroundColor: "#009178", height: "165px" },
];

const Denji = () => {
  const container = useRef(null);
  const denjiRef = useRef(null);
  const handRef = useRef(null);
  const scrollTriggerRef = useRef(null);
  const handScrollTriggerRef = useRef(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Detect mobile
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const wrapperStyle = {
    position: "relative",
    zIndex: 6,
    bottom: "-60px",
    aspectRatio: "378 / 313",
    ...(isMobile ? { width: "100%" } : { height: "100%" }),
  };

  const layerStyle = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
  };

  // Wave animation
  useGSAP(
    () => {
      CustomEase.create("wave", "M0,0 C0.6,0, 0.1,1.4, 1,1");

      const rects = gsap.utils.toArray(".rect", container.current);

      gsap.timeline({ repeat: -1, yoyo: true }).to(rects, {
        scaleY: 1.4,
        transformOrigin: "bottom",
        duration: 2,
        stagger: 0.2,
        ease: "wave",
      });
    },
    { scope: container }
  );

  // Scroll animation - with proper cleanup
  useGSAP(() => {
    if (!denjiRef.current || !container.current) {
      console.log("Denji ref not found");
      return;
    }

    // Get the section element for trigger
    const section = container.current.closest("section");

    if (!section) {
      console.log("Section not found");
      return;
    }

    // Kill any existing scroll triggers for this element
    ScrollTrigger.getAll().forEach((trigger) => {
      if (trigger.trigger === section || trigger.target === denjiRef.current) {
        trigger.kill();
      }
    });

    // Create new scroll trigger
    scrollTriggerRef.current = gsap.to(denjiRef.current, {
      y: -60,
      ease: "none",
      scrollTrigger: {
        trigger: section,
        start: "top bottom",
        endTrigger: 'footer',
        end: "bottom bottom",
        scrub: 1,
        markers: false,
        onUpdate: (self) => {
          // Ensure the trigger stays active
          self.refresh();
        },
      },
    }).scrollTrigger;

    return () => {
      // Proper cleanup
      if (scrollTriggerRef.current) {
        scrollTriggerRef.current.kill();
        scrollTriggerRef.current = null;
      }
    };
  }, []);

  // Hand parallax — starts 60px below body, rises 30px over scroll to simulate being in front
  useGSAP(() => {
    if (!handRef.current || !container.current) return;

    const section = container.current.closest("section");
    if (!section) return;

    gsap.set(handRef.current, { y: 60 });

    handScrollTriggerRef.current = gsap.to(handRef.current, {
      y: 15,
      ease: "none",
      scrollTrigger: {
        trigger: section,
        start: "top bottom",
        endTrigger: "footer",
        end: "bottom bottom",
        scrub: 1,
        markers: false,
      },
    }).scrollTrigger;

    return () => {
      if (handScrollTriggerRef.current) {
        handScrollTriggerRef.current.kill();
        handScrollTriggerRef.current = null;
      }
    };
  }, []);

  // Refresh ScrollTrigger on mount and window resize
  useEffect(() => {
    // Refresh immediately on mount
    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);

    const handleResize = () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.refresh());
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Cleanup all ScrollTriggers related to this component on unmount
  useEffect(() => {
    return () => {
      if (scrollTriggerRef.current) {
        scrollTriggerRef.current.kill();
      }
      if (handScrollTriggerRef.current) {
        handScrollTriggerRef.current.kill();
      }
      ScrollTrigger.refresh();
    };
  }, []);

  return (
    <div style={containerStyle} ref={container}>
      <div style={wrapperStyle} ref={denjiRef} id="denji">
        <img src={denjiBody} style={layerStyle} alt="Denji" />
        <img src={denjiHand} style={layerStyle} ref={handRef} alt="" aria-hidden="true" />
      </div>
      {rectConfigs.map((style, i) => (
        <div
          key={i}
          className={`rect rect-${i + 1}`}
          style={{ ...baseRectStyle, ...style }}
        />
      ))}
    </div>
  );
};

export default Denji;
