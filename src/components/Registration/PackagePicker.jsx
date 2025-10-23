import { ALLOWED_PACKAGES } from "../../lib/validators";

export default function PackagePicker({ value, onChange }) {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
      {ALLOWED_PACKAGES.map((amt) => {
        const active = value === amt;
        return (
          <button
            key={amt}
            type="button"
            onClick={() => onChange(amt)}
            className={[
              "rounded-2xl border px-3 py-2 text-sm",
              active
                ? "border-white/40 bg-white/10 text-white"
                : "border-white/10 bg-white/5 hover:bg-white/10 text-white/90",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
            ].join(" ")}
          >
            {amt} USDT
          </button>
        );
      })}
    </div>
  );
}
