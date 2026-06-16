import {
  useEffect,
  useState,
  useRef,
  forwardRef,
  useCallback,
} from "react";
import { useButtonSounds } from "../hooks/useButtonSounds";
import styles from "./About.module.css";
import SpaceShooter from "../components/SpaceShooter/SpaceShooter.jsx";
import star from "/star.svg";
import checked from "/checked.svg";
import unchecked from "/unchecked.svg";
import PercentageSlider from "../components/PercentageSlider/PercentageSlider.jsx";
import DraggableRobot from "../components/DraggableRobot/DraggableRobot.jsx";
import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import GrassOverlay from "../components/GrassOverlay.jsx";
import AnimatedArrow from "../components/AnimatedArrow.jsx";
import RevealText from "../components/RevealText.jsx";

gsap.registerPlugin(CustomEase, ScrollTrigger);

const PixelFootball = ({ ballRef }) => (
  <div
    ref={ballRef}
    style={{
      position: "absolute",
      left: "calc(50% - 7px)",
      bottom: 14,
      width: 14,
      height: 14,
      pointerEvents: "none",
      zIndex: 10,
    }}
  >
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      {/* Row 0 — top edge */}
      <rect x="4"  y="0"  width="4" height="4" fill="#F0EAD6"/>
      <rect x="8"  y="0"  width="4" height="4" fill="#F0EAD6"/>
      <rect x="12" y="0"  width="4" height="4" fill="#F0EAD6"/>
      <rect x="16" y="0"  width="4" height="4" fill="#F0EAD6"/>
      {/* Row 1 */}
      <rect x="0"  y="4"  width="4" height="4" fill="#F0EAD6"/>
      <rect x="4"  y="4"  width="4" height="4" fill="#1A1A1A"/>
      <rect x="8"  y="4"  width="4" height="4" fill="#F0EAD6"/>
      <rect x="12" y="4"  width="4" height="4" fill="#F0EAD6"/>
      <rect x="16" y="4"  width="4" height="4" fill="#1A1A1A"/>
      <rect x="20" y="4"  width="4" height="4" fill="#F0EAD6"/>
      {/* Row 2 */}
      <rect x="0"  y="8"  width="4" height="4" fill="#F0EAD6"/>
      <rect x="4"  y="8"  width="4" height="4" fill="#F0EAD6"/>
      <rect x="8"  y="8"  width="4" height="4" fill="#1A1A1A"/>
      <rect x="12" y="8"  width="4" height="4" fill="#1A1A1A"/>
      <rect x="16" y="8"  width="4" height="4" fill="#F0EAD6"/>
      <rect x="20" y="8"  width="4" height="4" fill="#F0EAD6"/>
      {/* Row 3 */}
      <rect x="0"  y="12" width="4" height="4" fill="#F0EAD6"/>
      <rect x="4"  y="12" width="4" height="4" fill="#F0EAD6"/>
      <rect x="8"  y="12" width="4" height="4" fill="#1A1A1A"/>
      <rect x="12" y="12" width="4" height="4" fill="#1A1A1A"/>
      <rect x="16" y="12" width="4" height="4" fill="#F0EAD6"/>
      <rect x="20" y="12" width="4" height="4" fill="#F0EAD6"/>
      {/* Row 4 */}
      <rect x="0"  y="16" width="4" height="4" fill="#F0EAD6"/>
      <rect x="4"  y="16" width="4" height="4" fill="#1A1A1A"/>
      <rect x="8"  y="16" width="4" height="4" fill="#F0EAD6"/>
      <rect x="12" y="16" width="4" height="4" fill="#F0EAD6"/>
      <rect x="16" y="16" width="4" height="4" fill="#1A1A1A"/>
      <rect x="20" y="16" width="4" height="4" fill="#F0EAD6"/>
      {/* Row 5 — bottom edge */}
      <rect x="4"  y="20" width="4" height="4" fill="#F0EAD6"/>
      <rect x="8"  y="20" width="4" height="4" fill="#F0EAD6"/>
      <rect x="12" y="20" width="4" height="4" fill="#F0EAD6"/>
      <rect x="16" y="20" width="4" height="4" fill="#F0EAD6"/>
    </svg>
  </div>
);

const ListItem = ({ icon, text, span }) => (
  <div className={styles.item}>
    <div className={styles.wrapper}>
      <img src={icon} alt="" />
    </div>
    <p className={icon === checked ? styles.checked : styles.unchecked}>
      {text} {span && <span>{span}</span>}
    </p>
  </div>
);

// Objective sentence as reveal segments. `trail` is punctuation glued to its
// word (so it never wraps onto its own line); `className` styles a whole word.
const OBJECTIVE_SEGMENTS = [
  { text: "Honestly", trail: { text: ",", className: styles.objComma } },
  { text: "I" },
  { text: "treat" },
  { text: "the" },
  { text: "browser", className: styles.objLora },
  { text: "like" },
  { text: "an" },
  { text: "open" },
  { text: "canvas", className: styles.objLora },
  { text: "and" },
  { text: "Next.js", className: styles.objLora },
  { text: "like" },
  { text: "my" },
  { text: "medium", trail: { text: ".", className: styles.objPeriod } },
  { text: "I" },
  { text: "love" },
  { text: "turning" },
  { text: "complex" },
  { text: "logic" },
  { text: "into" },
  { text: "clean", trail: { text: ",", className: styles.objComma } },
  { text: "fluid", className: styles.objLora },
  { text: "web" },
  { text: "experiences" },
  { text: "that" },
  { text: "just" },
  { text: "feel", className: styles.objLora },
  { text: "right", trail: { text: ".", className: styles.objPeriod } },
  { text: "Let's" },
  { text: "build" },
  { text: "something" },
  { text: "beautiful", className: styles.objLora, trail: { text: ".", className: styles.objPeriod } },
];

const ExperienceBlock = ({ company, experiences }) => (
  <div className={styles.experienceWrapper}>
    <div className={styles.company}>
      <img src={star} alt="" />
      <h4>{company}</h4>
    </div>
    {experiences.map(({ role, date }, i) => (
      <div className={styles.experience} key={i}>
        <h3>{role}</h3>
        <div className={styles.line}></div>
        <h3>{date}</h3>
      </div>
    ))}
  </div>
);

const About = forwardRef((_, ref) => {
  const { playHover: _playHover, playClick: _playClick } = useButtonSounds();
  const playHover = () => _playHover(3);
  const playClick = () => _playClick(3);
  const [resumeHovered, setResumeHovered] = useState(false);
  const cellRef = useRef(null);
  const grassTargetRef1 = useRef(null);
  const grassTargetRef3 = useRef(null);
  const grassTargetRef4 = useRef(null);
  const headingRef = useRef(null);
  const ballRef = useRef(null);

  // Ball moves randomly between 4 robot corners
  useEffect(() => {
    const ball = ballRef.current;
    if (!ball) return;
    let running = true;
    let totalRot = 0;

    const kick = () => {
      if (!running || !ball.parentElement) return;
      const h = ball.parentElement.offsetHeight;
      const corners = [
        { x: -46, y: -(h - 52) },  // top-left
        { x:  46, y: -(h - 52) },  // top-right
        { x: -46, y: 0 },           // bottom-left
        { x:  46, y: 0 },           // bottom-right
      ];
      const curX = gsap.getProperty(ball, "x");
      const curY = gsap.getProperty(ball, "y");
      // pick a random corner that differs meaningfully from current
      let pick;
      do { pick = corners[Math.floor(Math.random() * 4)]; }
      while (Math.abs(pick.x - curX) < 10 && Math.abs(pick.y - curY) < 10);

      const dist = Math.hypot(pick.x - curX, pick.y - curY);
      totalRot += (pick.x > curX ? 1 : -1) * (dist / 6) * 15;

      gsap.to(ball, {
        x: pick.x, y: pick.y,
        rotation: totalRot,
        duration: 0.25 + dist / 260,
        ease: "power2.inOut",
        onComplete: () => {
          if (running) gsap.delayedCall(0.15 + Math.random() * 0.35, kick);
        },
      });
    };

    gsap.delayedCall(0.4, kick);
    return () => { running = false; gsap.killTweensOf(ball); };
  }, []);

  useEffect(() => {
    if (!headingRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        headingRef.current?.classList.toggle(styles.headingActive, entry.isIntersecting);
      },
      { rootMargin: "0px 0px -40% 0px" }
    );
    observer.observe(headingRef.current);
    return () => observer.disconnect();
  }, []);




  const handleEnter = useCallback(() => setResumeHovered(true), []);
  const handleLeave = useCallback(() => setResumeHovered(false), []);

  const currentEnjoy = [
    { text: "Gym & Strength Training" },
    { text: "MMA" },
    { text: "Gaming sessions" },
    { text: "Building websites with Next.js" },
    { text: "Late-night productivity sessions" },
    { text: "Listening to music" },
    { text: "Cinematic Movies" },
    { text: "Being a Cinephile" },
  ];

  const goals = [
    { text: "Backend with Node.js and Express.js", checked: true },
    { text: "React Native development", checked: true },
    { text: "Building full-stack projects", checked: true },
    { text: "Cloud AWS and deployment skills" },
    { text: "Pursue a Master’s abroad" },
    { text: "Not letting intrusive thoughts win" }
  ];

  const experiences = [
    {
      company: "VIGA ET",
      roles: [
        { role: "UI/UX Engineer", date: "2024 - Ongoing" },
        { role: "UI/UX Intern", date: "2023 - 2024" },
      ],
    },
    {
      company: "SIGGRAPH BNMIT",
      roles: [
        { role: "Siggraph Lead", date: "2023 - 2024" },
        { role: "Siggraph Brand Lead", date: "2022 - 2023" },
      ],
    },
  ];

  return (
    <section id="ABOUT" className={styles.about} ref={ref} aria-label="About">
      <div className="extremes-wrapper-left">
        <div className="extremes"></div>
      </div>

      <div className={styles.middle}>
        <div className={styles.right}>
          <h2 className={styles.heading} ref={headingRef}>
            <span className={`${styles.headingBracket}`}>
              {"<"}
            </span>
            ABOUT
            <span className={`${styles.headingBracket}`}>
              {"/>"}
            </span>
          </h2>

          <div className={styles.rightFirst}>
            <div>
              <div className={styles.iconWrapper}>
                <span aria-hidden="true">{">"}</span>
              </div>
              <h3>OBJECTIVE</h3>
            </div>
            <RevealText
              className={styles.objh3}
              segments={OBJECTIVE_SEGMENTS}
              rootMargin="0px 0px -25% 0px"
              threshold={0}
            />
          </div>

          <div
            className={styles.rightSecond}
            ref={grassTargetRef1}
          >
            <div>
              <div className={styles.iconWrapper}>
                <span aria-hidden="true" className={styles.desch4}>
                  {">"}
                </span>
              </div>
              <h3>DESCRIPTIVE</h3>
            </div>
            <p className={styles.desch3}>
              <span>[ my intro ]</span> I’m Sahil Sajjan{" "}
              <span>[ Front-End Dev ]</span>, the kind of creator who treats the browser like an open canvas and Next.js like my medium[cite: 1]. Based in Hyderabad, Pakistan{" "}
              <span>[ building for the world ]</span>, I lose sleep over whether an animation curve is 20ms too slow[cite: 1]. I force myself to notice the tiny details most people skip — and that’s exactly why the interfaces I build feel fluid, natural, and alive the second you touch them[cite: 1].

              <br />
              <br />
              Where others just ship code, I practice digital craftsmanship[cite: 1]. Armed with an IT foundation and a diploma in web dev, I live right at the intersection where logic meets art — TypeScript keeping my structures honest, Framer Motion keeping my layouts beautiful[cite: 1].
              <br />
              <br />
              Right now, I’m at Samarix architecting production-grade platforms like Sentinel Kids, Nortra, Advibe, and Roos Brothers — while taking on the occasional freelance project when a unique, creative challenge lands on my desk[cite: 1].
            </p>
          </div>

          <GrassOverlay targetRef={grassTargetRef1}></GrassOverlay>

        </div>

        <div className={styles.left}>
          <div className={styles.leftFirst} ref={cellRef}>
            <div className={styles.leftFirstS1}>
              <SpaceShooter />
            </div>
            <div className={styles.aboutImgWrapper}>
              <PercentageSlider />
            </div>
            <div className={styles.leftFirstCell}>
              {/* bottom-left */}
              <DraggableRobot style={{ left: 0, bottom: -13 }} flip />
              {/* top-left */}
              <DraggableRobot style={{ left: 0, top: 10 }} />
              {/* top-right */}
              <DraggableRobot style={{ right: 0, top: 10 }} flip />
              {/* bottom-right */}
              <DraggableRobot style={{ right: 0, bottom: -13 }} />
              {/* Football */}
              <PixelFootball ballRef={ballRef} />
            </div>
          </div>

          <a
            href="https://drive.google.com/file/d/1_Wid52EDb-vXa1mFI-EX7_cqGQpFDzzP/view?usp=sharing"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="View Sahil's resume (PDF, opens in new tab)"
            className={styles.second}
            onMouseEnter={() => { setResumeHovered(true); playHover(); }}
            onMouseLeave={() => setResumeHovered(false)}
            onClick={playClick}
            ref={grassTargetRef4}
          >
            <AnimatedArrow isActive={!resumeHovered} />
            <p>
              VIEW SAHIL'S <span>RESUME</span>
            </p>
            <AnimatedArrow isActive={resumeHovered} />
          </a>

          <GrassOverlay targetRef={grassTargetRef4}></GrassOverlay>

          <div className={styles.thirdNew}>
            <div className={styles.thirdLeft}>
              <h3>THINGS HE CURRENTLY ENJOYS</h3>
              <div className={styles.list}>
                {currentEnjoy.map((item, i) => (
                  <ListItem
                    key={i}
                    icon={star}
                    text={item.text}
                    span={item.span}
                  />
                ))}
              </div>
            </div>
            <div
              className={styles.thirdRight}
              ref={grassTargetRef3}
            >
              <h3>THINGS HE HOPES TO COMPLETE</h3>
              <div className={styles.list}>
                {goals.map((item, i) => (
                  <ListItem
                    key={i}
                    icon={item.checked ? checked : unchecked}
                    text={item.text}
                    span={item.span}
                  />
                ))}
              </div>
            </div>
            <GrassOverlay targetRef={grassTargetRef3}></GrassOverlay>
          </div>
        </div>
      </div>

      <div className="extremes-wrapper-right">
        <div className="extremes"></div>
      </div>
    </section>
  );
});

export default About;
