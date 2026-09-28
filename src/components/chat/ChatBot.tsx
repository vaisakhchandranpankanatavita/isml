import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { postsService } from '@/services/cms.service';
import { getChatSuggestions, greeting, reply, type ChatLink } from './chatEngine';
import Mascot, { usePointerLook } from './Mascot';
import './chatbot.css';

/**
 * The site-wide assistant. Mounted once in the router's root shell, so the
 * launcher is present on every route — public and admin — and the conversation
 * survives navigation (and a reload, via sessionStorage).
 *
 * Personality is in the motion: the launcher floats and pulses, its eyes track
 * the cursor and blink, it nudges once per session, the panel springs out of
 * the launcher, the bot "types" (bouncing dots) then streams its answer, and
 * quick-reply chips and links arrive staggered. Reduced motion collapses all of
 * that to plain, instant rendering.
 */

interface Msg {
  id: string;
  role: 'bot' | 'user';
  text: string;
  links?: ChatLink[];
  chips?: string[];
  fresh?: boolean; // still streaming in
}

const STORE = 'isml-chat-v1';
const NUDGE = 'isml-chat-nudged';
let seq = 0;
const uid = () => `${Date.now().toString(36)}-${seq++}`;
const formatReplyText = (text: string) =>
  text
    .replace(/\\n/g, '\n')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/^- /gm, '• ');

const load = (): Msg[] => {
  try {
    return JSON.parse(sessionStorage.getItem(STORE) || '[]');
  } catch {
    return [];
  }
};

function Stream({
  text,
  fresh,
  onTick,
  onDone,
}: {
  text: string;
  fresh: boolean;
  onTick: () => void;
  onDone: () => void;
}) {
  const [n, setN] = useState(fresh ? 0 : text.length);
  useEffect(() => {
    if (!fresh) return;
    let i = 0;
    const t = setInterval(() => {
      i = Math.min(text.length, i + 2);
      setN(i);
      onTick();
      if (i >= text.length) {
        clearInterval(t);
        onDone();
      }
    }, 16);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      {text.slice(0, n)}
      {n < text.length && <span className="cb__caret" />}
    </>
  );
}

function ActionLink({ link, onNavigate }: { link: ChatLink; onNavigate: () => void }) {
  const inner = (
    <>
      {link.label} <span aria-hidden>→</span>
    </>
  );
  return link.to ? (
    <Link to={link.to} className="cb__link" onClick={onNavigate}>
      {inner}
    </Link>
  ) : (
    <a
      href={link.href}
      className="cb__link"
      target={link.href?.startsWith('http') ? '_blank' : undefined}
      rel="noreferrer"
    >
      {inner}
    </a>
  );
}

export default function ChatBot() {
  const reduced = useReducedMotion();
  const { settings } = useSiteSettings();
  const launcherRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>(load);
  const [typing, setTyping] = useState(false);
  const [input, setInput] = useState('');
  const [nudge, setNudge] = useState(false);
  const [unread, setUnread] = useState(true);

  const look = usePointerLook(launcherRef, !reduced);

  const later = (fn: () => void, ms: number) => {
    timers.current.push(setTimeout(fn, ms));
  };
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  // Persist (never persist a half-streamed flag).
  useEffect(() => {
    try {
      sessionStorage.setItem(STORE, JSON.stringify(msgs.map(({ fresh, ...m }) => m)));
    } catch {
      /* private mode: chat still works, just not across reloads */
    }
  }, [msgs]);

  // One-time nudge bubble.
  useEffect(() => {
    let seen = false;
    try {
      seen = !!sessionStorage.getItem(NUDGE);
    } catch {
      /* ignore */
    }
    if (seen) return;
    const show = setTimeout(() => setNudge(true), 3500);
    const hide = setTimeout(() => setNudge(false), 13000);
    return () => {
      clearTimeout(show);
      clearTimeout(hide);
    };
  }, []);

  const scrollDown = useCallback(() => {
    const el = listRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: reduced ? 'auto' : 'smooth' });
  }, [reduced]);
  useEffect(scrollDown, [msgs.length, typing, scrollDown]);

  const pushBot = useCallback(
    (r: { text: string; links?: ChatLink[]; chips?: string[] }) =>
      setMsgs((m) => [
        ...m,
        { id: uid(), role: 'bot', ...r, text: formatReplyText(r.text), fresh: !reduced },
      ]),
    [reduced],
  );

  const toggle = () => {
    setOpen((o) => !o);
    setNudge(false);
    setUnread(false);
    try {
      sessionStorage.setItem(NUDGE, '1');
    } catch {
      /* ignore */
    }
  };

  // First open: greet.
  useEffect(() => {
    if (!open) return;
    if (msgs.length === 0) {
      setTyping(true);
      later(
        () => {
          setTyping(false);
          pushBot(greeting(settings));
        },
        reduced ? 0 : 700,
      );
    }
    later(() => inputRef.current?.focus(), 350);
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const send = (raw: string) => {
    const text = raw.trim();
    if (!text || typing) return;
    setMsgs((m) => [...m, { id: uid(), role: 'user', text }]);
    setInput('');
    setTyping(true);
    const r = reply(text, { settings, posts: postsService.listPublished() });
    later(
      () => {
        setTyping(false);
        pushBot(r);
      },
      reduced ? 0 : 480 + Math.min(r.text.length * 3, 800),
    );
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    send(input);
  };

  const markDone = (id: string) =>
    setMsgs((m) => m.map((x) => (x.id === id ? { ...x, fresh: false } : x)));
  const lastBot = [...msgs].reverse().find((m) => m.role === 'bot');
  const clear = () => {
    timers.current.forEach(clearTimeout);
    setTyping(false);
    setMsgs([]);
    later(() => {
      setTyping(true);
      later(
        () => {
          setTyping(false);
          pushBot({
            text: 'Fresh start. What would you like to know?',
            chips: getChatSuggestions(settings, 'welcome'),
          });
        },
        reduced ? 0 : 500,
      );
    }, 60);
  };

  return (
    <div className="cb" data-open={open || undefined} data-native-cursor>
      <AnimatePresence>
        {open && (
          <motion.section
            className="cb__panel"
            role="dialog"
            aria-label="School assistant"
            initial={reduced ? false : { opacity: 0, scale: 0.6, y: 30, borderRadius: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0, borderRadius: 0 }}
            exit={
              reduced
                ? undefined
                : { opacity: 0, scale: 0.7, y: 24, transition: { duration: 0.22 } }
            }
            transition={{ type: 'spring', stiffness: 260, damping: 24 }}
          >
            <header className="cb__head">
              <div className="cb__avatar">
                <Mascot look={look} talking={typing} />
              </div>
              <div className="cb__who">
                <p className="cb__name">ISML Assistant</p>
                <p className="cb__status">
                  <i /> {typing ? 'Typing…' : 'Online · instant answers'}
                </p>
              </div>
              <button
                type="button"
                className="cb__icon"
                onClick={clear}
                aria-label="Start over"
                title="Start over"
              >
                ↺
              </button>
              <button
                type="button"
                className="cb__icon"
                onClick={toggle}
                aria-label="Close assistant"
              >
                ✕
              </button>
            </header>

            <div ref={listRef} className="cb__list" data-lenis-prevent aria-live="polite">
              {msgs.map((m, i) => (
                <motion.div
                  key={m.id}
                  className={`cb__row cb__row--${m.role}`}
                  initial={reduced ? false : { opacity: 0, y: 14, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 320, damping: 26 }}
                >
                  <div className="cb__bubble">
                    {m.role === 'bot' ? (
                      <Stream
                        text={m.text}
                        fresh={!!m.fresh}
                        onTick={scrollDown}
                        onDone={() => markDone(m.id)}
                      />
                    ) : (
                      m.text
                    )}
                  </div>

                  {m.role === 'bot' && !m.fresh && (m.links?.length ?? 0) > 0 && (
                    <div className="cb__links">
                      {m.links!.map((l, k) => (
                        <motion.span
                          key={l.label + k}
                          initial={reduced ? false : { opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: k * 0.07 }}
                        >
                          <ActionLink
                            link={l}
                            onNavigate={() => window.innerWidth < 640 && setOpen(false)}
                          />
                        </motion.span>
                      ))}
                    </div>
                  )}

                  {m.role === 'bot' &&
                    !m.fresh &&
                    m.id === lastBot?.id &&
                    i === msgs.length - 1 &&
                    !typing && (
                      <div className="cb__chips">
                        {(m.chips ?? []).map((c, k) => (
                          <motion.button
                            key={c}
                            type="button"
                            className="cb__chip"
                            initial={reduced ? false : { opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 + k * 0.06 }}
                            whileTap={{ scale: 0.94 }}
                            onClick={() => send(c)}
                          >
                            {c}
                          </motion.button>
                        ))}
                      </div>
                    )}
                </motion.div>
              ))}

              <AnimatePresence>
                {typing && (
                  <motion.div
                    className="cb__row cb__row--bot"
                    initial={reduced ? false : { opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, transition: { duration: 0.1 } }}
                  >
                    <div className="cb__bubble cb__typing" aria-label="Assistant is typing">
                      <i />
                      <i />
                      <i />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <form className="cb__form" onSubmit={onSubmit}>
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about admissions, fees, news…"
                aria-label="Message"
                maxLength={240}
                autoComplete="off"
              />
              <motion.button
                type="submit"
                className="cb__send"
                disabled={!input.trim() || typing}
                aria-label="Send"
                whileTap={{ scale: 0.9 }}
              >
                →
              </motion.button>
            </form>
          </motion.section>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {nudge && !open && (
          <motion.button
            type="button"
            className="cb__nudge"
            onClick={toggle}
            initial={reduced ? false : { opacity: 0, y: 12, scale: 0.85 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, transition: { duration: 0.2 } }}
            transition={{ type: 'spring', stiffness: 300, damping: 22 }}
          >
            <span className="cb__nudge-dot" /> Hi! Ask me about admissions, fees or a campus tour.
          </motion.button>
        )}
      </AnimatePresence>

      <motion.button
        ref={launcherRef}
        type="button"
        className="cb__launcher"
        onClick={toggle}
        aria-label={open ? 'Close assistant' : 'Open assistant'}
        aria-expanded={open}
        initial={reduced ? false : { scale: 0, rotate: -30 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 16, delay: reduced ? 0 : 2.9 }}
        whileHover={reduced ? undefined : { scale: 1.08, rotate: -4 }}
        whileTap={{ scale: 0.92 }}
      >
        <span className="cb__float">
          <AnimatePresence mode="wait" initial={false}>
            {open ? (
              <motion.span
                key="x"
                className="cb__x"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                ✕
              </motion.span>
            ) : (
              <motion.span
                key="bot"
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.6, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Mascot look={look} talking={typing} />
              </motion.span>
            )}
          </AnimatePresence>
        </span>
        {unread && !open && <span className="cb__badge" aria-hidden />}
      </motion.button>
    </div>
  );
}
