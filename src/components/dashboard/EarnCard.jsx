// src/components/dashboard/EarnCard.jsx
// Inline USDT icon (brand colors, no external deps)
const UsdtIcon = ({ className = "h-5 w-5" }) => (
  <svg viewBox="0 0 256 256" className={className} aria-hidden="true">
    <circle cx="128" cy="128" r="128" fill="#26A17B" />
    <path
      fill="#FFF"
      d="M208 82.7H148.5V66H107.5V82.7H48V108.3H107.5V124.4C73.8 126.4 49.8 133.7 49.8 142.3C49.8 151 73.8 158.3 107.5 160.3V201.3H148.5V160.2C182.1 158.2 206.2 150.9 206.2 142.2C206.2 133.6 182.1 126.3 148.5 124.3V108.3H208V82.7ZM148.5 146.6C146 146.8 136.9 147.4 128 147.4C119.1 147.4 110 146.8 107.5 146.6C77.7 144.6 55.2 139.4 55.2 133.5C55.2 127.6 77.7 122.4 107.5 120.4C110 120.2 119.1 119.6 128 119.6C136.9 119.6 146 120.2 148.5 120.4C178.3 122.4 200.8 127.6 200.8 133.5C200.8 139.4 178.3 144.6 148.5 146.6Z"
    />
  </svg>
);

export default function EarnCard() {
  return (
    <div className="glass p-6 flex items-center justify-between">
      <div>
        <div className="text-white/70 mb-2 flex items-center gap-2">
          <UsdtIcon className="h-4 w-4" />
          <span>Earn</span>
        </div>

        <div className="text-6xl font-semibold leading-none flex items-center gap-3">
          <span>70%</span>
          <span className="hidden sm:inline-flex">
            <UsdtIcon className="h-8 w-8 drop-shadow" />
          </span>
        </div>

        <div className="mt-2 text-gold-200">
          from your{" "}
          <span className="underline decoration-gold-100/60 underline-offset-4">
            direct partners
          </span>{" "}
          activated levels
        </div>
      </div>

      <button
        aria-label="View earning details"
        className="hidden sm:inline-grid place-items-center rounded-full h-20 w-20 bg-gradient-to-b from-gold-400 to-gold-500 shadow-[0_18px_35px_rgba(0,0,0,.6)] ring-1 ring-white/20"
      >
        <UsdtIcon className="h-14 w-14" />
      </button>
    </div>
  );
}

