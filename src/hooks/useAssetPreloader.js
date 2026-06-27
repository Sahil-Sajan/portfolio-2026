import { useState, useEffect, useCallback, useRef } from "react";

const BASE_PATH = "";
const PROJECTS_INDEX_PATH = `${BASE_PATH}/data/projects.json`;

// --- STATIC ASSETS ---
// Only things actually used in React components/CSS.
const STATIC_IMAGE_ASSETS = Object.freeze([
  "/box_anchor.svg",
  "/checked.svg",
  "/Cursor.svg",
  "/denji.svg",
  "/footer.svg",
  "/hand.svg",
  "/lego_44.svg",
  "/lego_210.svg",
  "/star.svg",
  "/unchecked.svg",

  "/icons/cursor.png",
  "/icons/figma_apply.png",
  "/icons/figma_cancel.png",
  "/icons/figma_search.png",

  "/about_imgs/1.webp",
  "/about_imgs/2.webp",
  "/about_imgs/3.webp",
  "/about_imgs/4.webp",
  "/about_imgs/5.webp",
  "/about_imgs/6.webp",
  "/about_imgs/7.webp",
  "/about_imgs/8.webp",
  "/about_imgs/9.webp",
  "/about_imgs/10.webp",
  "/about_imgs/11.webp",
  "/about_imgs/12.webp",
  "/about_imgs/13.webp",
  "/about_imgs/14.webp",
  "/about_imgs/15.webp",
  "/about_imgs/16.webp",
  "/about_imgs/17.webp",
  "/about_imgs/18.webp",
  "/about_imgs/19.webp",
  "/about_imgs/20.webp",

  "/tap_01.wav",
  "/tap_02.wav",
  "/tap_03.wav",
  "/tap_04.wav",
  "/tap_05.wav",

  "/project_imgs/placeholder.webp",
]);

const REACT_MODULES_TO_PRELOAD = Object.freeze([
  () => import("../pages/Project.jsx"),
  () => import("../pages/Landing.jsx"),
]);

const preloadImage = (src) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(src);
    img.onerror = () => resolve(src);
    img.src = src;
  });
};

export const useAssetPreloader = () => {
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const loadedCountRef = useRef(0);
  const totalCountRef = useRef(0);

  const calculateTotalProgress = useCallback(() => {
    if (totalCountRef.current === 0) return;
    const percentage = Math.round(
      (loadedCountRef.current / totalCountRef.current) * 100
    );
    setProgress(Math.min(100, percentage));
  }, []);

  const startPreloading = useCallback(async () => {
    await new Promise((resolve) => setTimeout(resolve, 200));

    loadedCountRef.current = 0;
    setProgress(0);
    setIsComplete(false);

    const assetsToLoad = new Set();

    STATIC_IMAGE_ASSETS.forEach((asset) => assetsToLoad.add(BASE_PATH + asset));

    // Load the projects index to get Work section thumbnails only
    let projectsIndex;
    try {
      const res = await fetch(PROJECTS_INDEX_PATH);
      if (!res.ok) throw new Error(`Failed to fetch ${PROJECTS_INDEX_PATH}`);
      projectsIndex = await res.json();
    } catch (error) {
      console.error("[ERROR] Could not load projects.json:", error);
      projectsIndex = { projects: [] };
    }

    // Only preload Work section thumbnails — project page images load on demand
    projectsIndex.projects.forEach((project) => {
      if (project.img) assetsToLoad.add(BASE_PATH + project.img);
    });

    totalCountRef.current = assetsToLoad.size + REACT_MODULES_TO_PRELOAD.length;

    const tick = () => {
      loadedCountRef.current++;
      calculateTotalProgress();
    };

    const promises = [];

    Array.from(assetsToLoad).forEach((url) => {
      promises.push(preloadImage(url).then(tick));
    });

    REACT_MODULES_TO_PRELOAD.forEach((fn) => {
      promises.push(fn().then(tick));
    });

    await Promise.all(promises);

    setProgress(100);
    setTimeout(() => setIsComplete(true), 500);
  }, [calculateTotalProgress]);

  useEffect(() => {
    startPreloading();
  }, [startPreloading]);

  return { progress, isComplete };
};
