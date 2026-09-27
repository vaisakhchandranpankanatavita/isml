import { useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { useToast } from "@/hooks/useToast";
import { Button } from "@/components/common/Button";
import GlassPanel from "@/components/common/GlassPanel";
import GlobalAtmosphere from "@/components/common/GlobalAtmosphere";
import MeshGradient from "@/components/common/MeshGradient";
import { motion } from "framer-motion";

export default function Login() {
  const { login } = useAuth();
  const { settings } = useSiteSettings();
  const { push } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const from =
    (location.state as { from?: { pathname: string } } | null)?.from
      ?.pathname ?? "/admin";

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await login({ email, password });
      push("success", "Signed in successfully.");
      navigate(from, { replace: true });
    } catch (err) {
      const message =
        typeof err === "object" && err && "message" in err
          ? String((err as { message: string }).message)
          : "Invalid credentials.";
      setError(message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="admin-shell relative flex min-h-screen items-center justify-center overflow-hidden bg-paper-sunk p-4">
      <GlobalAtmosphere />
      <MeshGradient />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-md"
      >
        <Link
          to="/"
          className="mb-8 flex items-center justify-center gap-3 group"
        >
          <img
            src="/logo.png"
            alt=""
            className="h-12 w-12 transition-transform duration-500 group-hover:scale-110"
          />
          <div className="text-center leading-tight">
            <div className="font-display font-bold uppercase text-xl text-ink tracking-wider">
              {settings.siteName}
            </div>
            <div className="text-xs italic text-ink-muted">
              {settings.tagline}
            </div>
          </div>
        </Link>

        <GlassPanel className="border border-paper-line p-6 shadow-xl sm:p-8">
          <div className="mb-6">
            <h1 className="text-3xl font-display font-semibold text-ink">
              Secure Portal
            </h1>
            <p className="mt-2 text-sm text-ink-muted">
              Institutional Management System
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="login-email"
                className="block text-xs font-semibold uppercase tracking-widest text-ink-muted"
              >
                Email Address
              </label>
              <input
                id="login-email"
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="field-input border-paper-line bg-paper-light text-ink placeholder:text-ink-faint focus:border-brand-500 focus:ring-brand-500"
                autoComplete="email"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="login-password"
                className="block text-xs font-semibold uppercase tracking-widest text-ink-muted"
              >
                Access Key
              </label>
              <input
                id="login-password"
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="field-input border-paper-line bg-paper-light text-ink placeholder:text-ink-faint focus:border-brand-500 focus:ring-brand-500"
                autoComplete="current-password"
              />
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-3 text-sm text-red-400 bg-red-500/10 border border-red-500/20"
              >
                {error}
              </motion.p>
            )}

            <Button
              type="submit"
              disabled={busy}
              variant="primary"
              className="w-full py-3 text-sm uppercase tracking-widest font-semibold"
            >
              {busy ? "Authenticating…" : "Grant Access"}
            </Button>
          </form>

          <div className="mt-8 border-t border-paper-line pt-5">
            <div className="mb-3 flex items-center gap-2">
              <div className="h-px flex-1 bg-paper-line" />
              <span className="text-[10px] uppercase tracking-tighter text-ink-muted font-medium">
                Demo Credentials
              </span>
              <div className="h-px flex-1 bg-paper-line" />
            </div>
            <div className="grid grid-cols-1 gap-2 text-xs text-ink-muted font-mono">
              <div className="flex justify-between">
                <span>Admin</span>
                <span className="text-ink">admin@isml-oman.com / admin123</span>
              </div>
              <div className="flex justify-between">
                <span>Editor</span>
                <span className="text-ink">
                  editor@isml-oman.com / editor123
                </span>
              </div>
            </div>
          </div>
        </GlassPanel>
      </motion.div>
    </div>
  );
}
