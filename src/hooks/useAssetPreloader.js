import { useState, useEffect, useCallback, useRef } from "react";

const BASE_PATH = "";
const PROJECT_DATA_FOLDER = `${BASE_PATH}/data/project_data`;
const PROJECTS_INDEX_PATH = `${BASE_PATH}/data/projects.json`;

const getProjectJsonFilename = (projectName) => {
  return projectName.toLowerCase().replace(/\s/g, "_");
};

// --- STATIC ASSETS ---
// Only list things actually used in your React components/CSS.
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
    img.onerror = () => resolve(src); // resolve even on error
    img.src = src;
  });
};

// ✅ Fetch JSON dynamically from public/
const preloadJson = async (filename) => {
  const path = `${PROJECT_DATA_FOLDER}/${filename}.json`;
  try {
    const res = await fetch(path);
    if (!res.ok) throw new Error(`Failed to fetch JSON: ${path}`);
    return await res.json();
  } catch (error) {
    console.error(`Failed to load project JSON for ${filename}:`, error);
    return null;
  }
};

// Helper: find all image paths inside JSON data recursively
const IMAGE_PATH_REGEX =
  /"(\/(?:project_imgs|about_imgs)\/[^"]+\.(?:png|jpg|jpeg|gif|webp|svg))"/gi;

const scanForImages = (data, paths = new Set()) => {
  if (!data) return paths;
  const jsonString = JSON.stringify(data);
  let match;
  while ((match = IMAGE_PATH_REGEX.exec(jsonString)) !== null) {
    paths.add(match[1]);
  }
  return paths;
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
    // Small delay to let animations render
    await new Promise((resolve) => setTimeout(resolve, 200));

    loadedCountRef.current = 0;
    setProgress(0);
    setIsComplete(false);

    const assetsToLoad = new Set();
    const phase1Promises = [];

    // --- PHASE 1: Collect Static & Core assets ---
    STATIC_IMAGE_ASSETS.forEach((asset) =>
      assetsToLoad.add(BASE_PATH + asset)
    );

    // ✅ Load the projects index dynamically
    let projectsIndex;
    try {
      const res = await fetch(PROJECTS_INDEX_PATH);
      if (!res.ok) throw new Error(`Failed to fetch ${PROJECTS_INDEX_PATH}`);
      projectsIndex = await res.json();
    } catch (error) {
      console.error("[ERROR] Could not load projects.json:", error);
      projectsIndex = { projects: [] };
    }

    // Add project thumbnails from projects.json
    projectsIndex.projects.forEach((project) => {
      if (project.img) assetsToLoad.add(BASE_PATH + project.img);
    });

    // Project filenames
    const projectJsonFilenames = projectsIndex.projects.map((p) =>
      getProjectJsonFilename(p.name)
    );

    // Set initial total count
    let currentTotal =
      assetsToLoad.size +
      REACT_MODULES_TO_PRELOAD.length +
      projectJsonFilenames.length;
    totalCountRef.current = currentTotal;

    const tick = () => {
      loadedCountRef.current++;
      calculateTotalProgress();
    };

    // Phase 1: preload base images
    Array.from(assetsToLoad).forEach((url) => {
      phase1Promises.push(preloadImage(url).then(tick));
    });

    // Preload React modules
    REACT_MODULES_TO_PRELOAD.forEach((fn) => {
      phase1Promises.push(fn().then(tick));
    });

    // Load all JSONs in parallel
    const jsonPromises = projectJsonFilenames.map((filename) =>
      preloadJson(filename).then((data) => {
        tick();
        return data;
      })
    );

    const loadedJsonData = await Promise.all(jsonPromises);

    // --- PHASE 2: Discover additional images in JSONs ---
    const discoveredImages = new Set();
    loadedJsonData.forEach((data) =>
      scanForImages(data, discoveredImages)
    );

    const newImagesToLoad = Array.from(discoveredImages).filter(
      (url) => !assetsToLoad.has(BASE_PATH + url)
    );

    totalCountRef.current += newImagesToLoad.length;

    // Await any remaining phase 1 promises
    await Promise.all(phase1Promises);

    // Load discovered images
    if (newImagesToLoad.length > 0) {
      await Promise.all(
        newImagesToLoad.map((url) =>
          preloadImage(BASE_PATH + url).then(tick)
        )
      );
    }

    // All done
    setProgress(100);
    setTimeout(() => setIsComplete(true), 500);
  }, [calculateTotalProgress]);

  useEffect(() => {
    startPreloading();
  }, [startPreloading]);

  return { progress, isComplete };
};
