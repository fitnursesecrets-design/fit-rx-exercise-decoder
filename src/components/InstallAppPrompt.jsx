import { useEffect, useState } from "react";

/**
 * FitRX Tracker-style install prompts:
 * - Android/Chrome: beforeinstallprompt → Install button
 * - iOS Safari: Share → Add to Home Screen hint
 */
export default function InstallAppPrompt({ variant = "auth" }) {
  const [canInstall, setCanInstall] = useState(false);
  const [deferred, setDeferred] = useState(null);
  const [isIosHint, setIsIosHint] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const isIOS =
      /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    const isStandalone =
      window.navigator.standalone === true ||
      window.matchMedia("(display-mode: standalone)").matches;
    if (isIOS && !isStandalone) setIsIosHint(true);

    function onBeforeInstall(e) {
      e.preventDefault();
      setDeferred(e);
      setCanInstall(true);
    }
    function onInstalled() {
      setCanInstall(false);
      setDeferred(null);
    }
    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  async function installApp() {
    if (!deferred) {
      window.alert(
        'To install: tap your browser menu (⋮) and select "Add to Home Screen"',
      );
      return;
    }
    deferred.prompt();
    const result = await deferred.userChoice;
    if (result.outcome === "accepted") {
      setCanInstall(false);
      setDeferred(null);
    } else {
      setDeferred(null);
    }
  }

  if (dismissed) return null;

  if (canInstall) {
    return (
      <div
        id={variant === "home" ? "installAppRowHome" : "installBtn"}
        className={
          variant === "home"
            ? "rounded-2xl border border-gold/30 bg-gold/10 p-4"
            : "mt-4"
        }
      >
        <button
          type="button"
          onClick={installApp}
          className="w-full rounded-full bg-gold px-4 py-3 text-sm font-semibold text-ink"
        >
          Install Fit RX app
        </button>
        {variant === "home" && (
          <p className="mt-2 text-center text-[11px] text-faint">
            Add to your home screen for one-tap access between shifts.
          </p>
        )}
      </div>
    );
  }

  if (isIosHint) {
    return (
      <div
        id={variant === "home" ? "iosInstallHintHome" : "iosInstallHint"}
        className={
          variant === "home"
            ? "rounded-2xl border border-line bg-panel p-4"
            : "mt-4 rounded-xl border border-line bg-panel-2/80 p-3"
        }
      >
        <p className="text-[12px] leading-relaxed text-muted">
          To install: tap <span className="font-semibold text-zinc-200">Share</span>{" "}
          (□↑) in Safari then{" "}
          <span className="font-semibold text-zinc-200">Add to Home Screen</span>
        </p>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="mt-2 text-[11px] text-faint underline"
        >
          Dismiss
        </button>
      </div>
    );
  }

  return null;
}
