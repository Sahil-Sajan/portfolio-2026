import {
  useEffect,
  useState,
  useRef,
  forwardRef,
  useCallback,
} from "react";
import { useButtonSounds } from "../hooks/useButtonSounds";
import styles from "./About.module.css";
import lego_210 from "/lego_210.svg";
import star from "/star.svg";
import checked from "/checked.svg";
import unchecked from "/unchecked.svg";
import PercentageSlider from "../components/PercentageSlider/PercentageSlider.jsx";
import AnimatedLegWiggle from "../components/AnimatedLegWiggle.jsx";
import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import GrassOverlay from "../components/GrassOverlay.jsx";
import AnimatedArrow from "../components/AnimatedArrow.jsx";
import RevealText from "../components/RevealText.jsx";

gsap.registerPlugin(CustomEase, ScrollTrigger);

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
  const legRef = useRef(null);
  const grassTargetRef1 = useRef(null);
  const grassTargetRef3 = useRef(null);
  const grassTargetRef4 = useRef(null);
  const headingRef = useRef(null);

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



  useEffect(() => {
    if (!cellRef.current) return;
    const trigger = ScrollTrigger.create({
      trigger: cellRef.current,
      start: "bottom bottom",
      onEnter: () => legRef.current?.play(),
      once: true,
    });
    return () => trigger.kill();
  }, []);

  const handleEnter = useCallback(() => setResumeHovered(true), []);
  const handleLeave = useCallback(() => setResumeHovered(false), []);

  const currentEnjoy = [
    { text: "Films, Severance & The Office", span: "[ US ]" },
    { text: "Death Stranding 2" },
    { text: "Chainsaw Man" },
    { text: "Learning French" },
    { text: "Lego Kits" },
    { text: "Gym" },
    { text: "The color green" },
  ];

  const goals = [
    { text: "Design a VR experience", checked: true },
    { text: "Play Death Stranding 2", checked: true },
    { text: "Mod a Casio watch", checked: true },
    { text: "Finish reading - Crime & Punishment" },
    { text: "Pursue a HCI Master's" },
    { text: "Learn Cardistry" },
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
            <img
              className={styles.leftFirstS1}
              src={lego_210}
              alt=""
            />
            <div className={styles.aboutImgWrapper}>
              <PercentageSlider />
            </div>
            <div className={styles.leftFirstCell}>
              <AnimatedLegWiggle ref={legRef} />
            </div>
          </div>

          <a
            href="https://drive.google.com/file/d/12dYdJq4Q5KDVlghvON27KRiGc8sl-ZMm/view?usp=sharing"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="View Kashyap's resume (PDF, opens in new tab)"
            className={styles.second}
            onMouseEnter={() => { setResumeHovered(true); playHover(); }}
            onMouseLeave={() => setResumeHovered(false)}
            onClick={playClick}
            ref={grassTargetRef4}
          >
            <AnimatedArrow isActive={!resumeHovered} />
            <p>
              VIEW KASHYAP'S <span>RESUME</span>
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
