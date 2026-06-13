import {
  useEffect,
  useState,
  useRef,
  forwardRef,
  useMemo,
  useCallback,
} from "react";
import { useButtonSounds } from "../hooks/useButtonSounds";
import styles from "./About.module.css";
import lego_210 from "/lego_210.svg";
import star from "/star.svg";
import AnimatedDownwardSmiley from "../components/AnimatedDownwardSmiley.jsx";
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
  { text: "Ever" },
  { text: "since" },
  { text: "I" },
  { text: "was" },
  { text: "a" },
  { text: "kid", trail: { text: ",", className: styles.objComma } },
  { text: "I" },
  { text: "knew" },
  { text: "I" },
  { text: "wanted" },
  { text: "to" },
  { text: "write", className: styles.objLora },
  { text: "emails", className: styles.objLora },
  { text: "and" },
  { text: "work" },
  { text: "cross", className: styles.objLora },
  { text: "functionally", className: styles.objLora },
  { text: "across" },
  { text: "teams", trail: { text: ".", className: styles.objPeriod } },
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
  const grassTargetRef2 = useRef(null);
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

  const age = useMemo(() => {
    const today = new Date();
    const birthDate = new Date(2001, 11, 27);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    const dayDiff = today.getDate() - birthDate.getDate();
    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) age--;
    return age;
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
    { text: "Play Death Stranding 2" , checked: true },
    { text: "Mod a Casio watch" , checked: true  },
    { text: "Finish reading - Crime & Punishment"},
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
              <span>[ ready's intro ]</span> He's Kashyap Rayas{" "}
              <span>[ {age} M ]</span>, Product Designer by trade and
              professional overthinker by nature.
              Based in India <span>[ born in the US ]</span> He cares a lot about things most
              people won’t even notice. Sometimes a little too much. But that’s also
              why the products he shapes feel effortless and make sense fast.

              <br />
              <br />
              With a background in computer science and design, he works comfortably where
              technology meets creativity — logic on one side, intuition on the other.
              <br />
              <br />
              Right now, he’s at VigaET as a UI/UX Engineer, leading design & product strategy
              for a suite of apps made for the film production industry.
            </p>
          </div>

          <GrassOverlay targetRef={grassTargetRef1}></GrassOverlay>

          <div
            className={styles.thirdWrapperNew}
            ref={grassTargetRef2}
          >
            <div className={styles.rightThird}>
              <div>
                <div className={styles.iconWrapper}>
                  <span aria-hidden="true">{">"}</span>
                </div>
                <h3>THE UNDERGROUND MAN</h3>
              </div>
              <p>
                It is clear to me now that, owing to my unbounded vanity and
                to the high standard I set for myself, I often looked at
                myself with furious discontent, which verged on loathing, and
                so I inwardly attributed the same feeling to everyone.
              </p>
            </div>
            <div className={styles.rightS2}>
              <AnimatedDownwardSmiley isActive={true} />
            </div>
          </div>
          <GrassOverlay targetRef={grassTargetRef2}></GrassOverlay>
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
