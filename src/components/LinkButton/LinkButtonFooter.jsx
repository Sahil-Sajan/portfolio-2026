import styles from "./LinkButton.module.css";
import { useButtonSounds } from "../../hooks/useButtonSounds";

const LinkButtonFooter = ({ linkName, linkTo = "", lenis, onClick, offset=false}) => {
	const { playHover: _playHover, playClick: _playClick } = useButtonSounds();
	const playHover = () => _playHover(3);
	const playClick = () => _playClick(3);

	const handleClick = () => {
		playClick();
		// Handle lenis scroll if linkTo is provided
		if(lenis && linkTo !== "https://2022.kashyaprayas.com" && linkTo !=="") {
            lenis.scrollTo(linkTo, {duration: 2, offset: offset? -60 : 0})
        }

        if(linkTo === "https://2022.kashyaprayas.com") {
            window.open(linkTo, "_blank");
        }
        // Call the onClick callback if provided
		if (onClick) {
			onClick();
		}
	};
	return (
		// Use the combined className string
		<button className={styles.navLinkFooter} onClick={handleClick} onMouseEnter={playHover}>
			<span className={styles.bracket}>{"<"}</span>
			{linkName}
			<span className={styles.bracket}>{"/>"}</span>
		</button>
	);
};

export default LinkButtonFooter;
