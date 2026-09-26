/**
 * Formerly an ambient glow orb. The VCASS restyle uses flat grounds with no
 * glows, so this renders nothing; kept so existing call sites compile.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function FuturisticElement(_props: { className?: string; delay?: number; speed?: number }) {
  return null;
}
