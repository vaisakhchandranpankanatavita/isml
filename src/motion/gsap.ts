import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";

gsap.registerPlugin(ScrollTrigger, SplitText, ScrambleTextPlugin);

// Mobile browser chrome collapsing changes innerHeight; don't rebuild pins for it.
ScrollTrigger.config({ ignoreMobileResize: true });

export { gsap, ScrollTrigger, SplitText };

/** Easings taken from the reference site's animation script. */
export const EASE_REF = "cubic-bezier(.5, 1, .89, 1)";
export const EASE_IMAGE = "cubic-bezier(.32, 0, .29, .99)";
