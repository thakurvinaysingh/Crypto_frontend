// src/pages/dashboard/Partners.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// ⬇️ adjust the path if your structure/alias differs
import { getPartnersData } from "../../../lib/api";

// Inline USDT icon (brand colors, no external deps)
const UsdtIcon = ({ className = "h-4 w-4" }) => (
  <svg viewBox="0 0 256 256" className={className} aria-hidden="true">
    <circle cx="128" cy="128" r="128" fill="#26A17B" />
    <path
      fill="#FFF"
      d="M208 82.7H148.5V66H107.5V82.7H48V108.3H107.5V124.4C73.8 126.4 49.8 133.7 49.8 142.3C49.8 151 73.8 158.3 107.5 160.3V201.3H148.5V160.2C182.1 158.2 206.2 150.9 206.2 142.2C206.2 133.6 182.1 126.3 148.5 124.3V108.3H208V82.7ZM148.5 146.6C146 146.8 136.9 147.4 128 147.4C119.1 147.4 110 146.8 107.5 146.6C77.7 144.6 55.2 139.4 55.2 133.5C55.2 127.6 77.7 122.4 107.5 120.4C110 120.2 119.1 119.6 128 119.6C136.9 119.6 146 120.2 148.5 120.4C178.3 122.4 200.8 127.6 200.8 133.5C200.8 139.4 178.3 144.6 148.5 146.6Z"
    />
  </svg>
);

export default function Partners() {
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const SQUAD_ID = 77;

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const data = await getPartnersData(SQUAD_ID);
        if (!mounted) return;
        setRows(data);
      } catch (e) {
        if (!mounted) return;
        setErr(e?.message || "Failed to load data.");
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const formatAmount = (val) => {
    const n = Number(val);
    if (!Number.isFinite(n)) return "0";
    return new Intl.NumberFormat(undefined, { maximumFractionDigits: 6 }).format(n);
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Tabs + title (same theme) */}
      <section className="px-1 sm:px-0">
        <div className="flex items-center gap-2">
          <div className="inline-flex p-1 rounded-full bg-white/10 border border-white/10 backdrop-blur">
            <button
              className="px-3 py-1.5 text-sm sm:text-base rounded-full text-white/70 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/40"
              onClick={() => navigate("/dashboard/team")}
            >
              Squads
            </button>
            <button
              className="px-3 py-1.5 text-sm sm:text-base rounded-full bg-gradient-to-r from-gold-500 to-gold-700 text-white shadow-inner focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/60"
            >
              Partners
            </button>
          </div>
        </div>

        <h1 className="mt-3 text-[30px] sm:text-[40px] font-semibold leading-tight">
          Partners
        </h1>
        <p className="mt-1 text-white/70 max-w-[56ch] text-sm sm:text-base">
          View partner levels and amounts with the same squad ID.
        </p>
      </section>

      {/* Data Table Card */}
      <section
        className="
          rounded-3xl p-4 sm:p-6
          bg-gradient-to-b from-[#161b1f] to-[#0f1418]
          border border-white/10 text-white
          shadow-[0_8px_28px_rgba(0,0,0,0.35)]
        "
      >
        <header className="mb-3 sm:mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-gold-400 to-gold-700 grid place-items-center shadow">
              <span className="text-sm font-bold">P</span>
            </div>
            <div>
              <div className="font-semibold">Partner List</div>
              <div className="text-xs text-white/60">Live data </div>
            </div>
          </div>
          <span className="px-3 py-1 rounded-xl bg-white/10 text-xs sm:text-sm">
            ID: {SQUAD_ID}
          </span>
        </header>

        {/* Responsive table */}
        <div className="rounded-2xl border border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm sm:text-base">
              <thead className="bg-white/[0.04]">
                <tr className="text-white/80">
                  <th className="px-4 sm:px-6 py-3 font-medium">UserId</th>
                  <th className="px-4 sm:px-6 py-3 font-medium">Level</th>
                  <th className="px-4 sm:px-6 py-3 font-medium">
                    <span className="inline-flex items-center gap-2">
                      TotalAmount
                      <UsdtIcon className="h-3.5 w-3.5 opacity-90" />
                    </span>
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-white/10">
                {loading && (
                  <tr>
                    <td colSpan={3} className="px-4 sm:px-6 py-6 text-center text-white/70">
                      Loading partner data…
                    </td>
                  </tr>
                )}

                {!loading && err && (
                  <tr>
                    <td colSpan={3} className="px-4 sm:px-6 py-6 text-center text-red-300">
                      {err}
                    </td>
                  </tr>
                )}

                {!loading && !err && rows.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-4 sm:px-6 py-6 text-center text-white/70">
                      No partner data found.
                    </td>
                  </tr>
                )}

                {!loading &&
                  !err &&
                  rows.map((m, idx) => (
                    <tr key={`${m?.userId ?? "pid"}-${idx}`} className={idx % 2 === 0 ? "bg-white/[0.02]" : ""}>
                      <td className="px-4 sm:px-6 py-3">
                        <span className="inline-flex items-center px-3 h-8 rounded-2xl text-xs sm:text-sm bg-gradient-to-r from-gold-500 to-gold-700 shadow-inner">
                          {m?.userId ?? "N/A"}
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 py-3 text-white/90">
                        {m?.levelNo ?? "-"}
                      </td>
                      <td className="px-4 sm:px-6 py-3 text-white/90">
                        <span className="inline-flex items-center gap-2">
                          {formatAmount(m?.totalAmount)}
                          <UsdtIcon className="h-4 w-4" />
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Tip bar with USDT icons */}
        <div
          className="
            mt-4 rounded-2xl px-4 py-3
            bg-gradient-to-r from-gold-300 to-gold-500
            text-zinc-900 font-semibold
            border border-black/10 shadow-inner
            flex items-center justify-between
          "
        >
          <span className="inline-flex items-center gap-2">
            70%
            <UsdtIcon className="h-5 w-5" />
          </span>

          <span className="px-3 py-1 rounded-xl bg-black/10 font-bold text-xs sm:text-sm inline-flex items-center gap-2">
            <UsdtIcon className="h-4 w-4" />
            from your direct partners activated levels.
          </span>
        </div>
      </section>

      {/* keep content above the floating dock on mobile */}
      <div className="md:hidden h-24" />
    </div>
  );
}
