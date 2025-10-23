import { motion } from "framer-motion";

/**
 * WalletList
 * - Vertical tile: icon on top, label below (like your reference screenshot)
 * - Responsive grid: 3 cols (mobile) → 4 (sm) → 5 (md)
 * - Accessible focus states, truncation, consistent sizing
 */
export default function WalletList({
  wallets = [],
  onPick,
  onViewAll,
  withViewAllTile = true,
  compact = false, // kept for API compatibility; just reduces gaps & sizes
  ariaLabel = "Available wallets",
}) {
  const gridCols = compact
    ? "grid-cols-3 sm:grid-cols-4"
    : "grid-cols-3 sm:grid-cols-4 md:grid-cols-5";

  const gap = compact ? "gap-3" : "gap-4";

  return (
    <div role="list" aria-label={ariaLabel} className={`grid ${gridCols} ${gap} min-w-0`}>
      {wallets.map(({ id, name, Icon, iconBg, isViewAll, badge }) => {
        const handleClick = () => (isViewAll ? onViewAll?.() : onPick?.(id));
        return (
          <motion.button
            key={id}
            whileTap={{ scale: 0.98 }}
            onClick={handleClick}
            role="listitem"
            title={name}
            className={[
              "group relative w-full min-w-0",
              "rounded-2xl border border-white/10",
              "bg-white/5 hover:bg-white/10",
              "transition-colors",
              "p-3 sm:p-3.5",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30",
              "flex flex-col items-center text-center",
            ].join(" ")}
          >
            {/* Icon */}
            <div
              className={[
                "h-12 w-12 sm:h-14 sm:w-14",
                "rounded-2xl grid place-items-center",
                iconBg || "bg-[#2B2F36]",
                "text-white",
              ].join(" ")}
              aria-hidden="true"
            >
              {/* If your Icon supports className, we size precisely */}
              {Icon ? <Icon className="h-6 w-6 sm:h-7 sm:w-7" /> : null}
            </div>

            {/* Name */}
            <span className="mt-2.5 sm:mt-3 w-full truncate text-[13px] sm:text-sm text-white/95">
              {name}
            </span>

            {/* Optional small badge (e.g., "Popular") */}
            {badge ? (
              <span className="absolute top-2 right-2 rounded-md bg-white/15 px-1.5 py-0.5 text-[10px] leading-none text-white/90">
                {badge}
              </span>
            ) : null}
          </motion.button>
        );
      })}

      {/* “View all” tile when not supplied in wallets array */}
      {withViewAllTile && !wallets.some((w) => w.isViewAll) && onViewAll && (
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={onViewAll}
          role="listitem"
          title="View all wallets"
          className={[
            "group relative w-full min-w-0",
            "rounded-2xl border border-white/10",
            "bg-white/5 hover:bg-white/10",
            "transition-colors",
            "p-3 sm:p-3.5",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30",
            "flex flex-col items-center text-center",
          ].join(" ")}
        >
          <div
            className="h-12 w-12 sm:h-14 sm:w-14 rounded-2xl bg-[#2B2F36] grid place-items-center text-white/90"
            aria-hidden="true"
          >
            <span className="text-xl sm:text-2xl">⋯</span>
          </div>
          <span className="mt-2.5 sm:mt-3 w-full truncate text-[13px] sm:text-sm text-white/95">
            View all wallets
          </span>
        </motion.button>
      )}
    </div>
  );
}


// import { motion } from "framer-motion";

// export default function WalletList({ wallets, onPick, onViewAll, compact = false, withViewAllTile = true }) {
//   return (
//     <div className={`grid gap-3 ${compact ? "grid-cols-2 sm:grid-cols-4" : "grid-cols-3 sm:grid-cols-3"}`}>
//       {wallets.map(({ id, name, Icon, iconBg, isViewAll }) => (
//         <motion.button
//           key={id}
//           whileTap={{ scale: 0.98 }}
//           onClick={() => (isViewAll ? onViewAll?.() : onPick?.(id))}
//           className="group w-full rounded-2xl bg-white/5 hover:bg-white/8 transition-colors text-left p-3.5 border border-white/10 flex items-center gap-3"
//         >
//           <div className={`h-11 w-11 rounded-2xl ${iconBg} grid place-items-center text-white text-lg`}>
//             <Icon />
//           </div>
//           <div className="flex flex-col">
//             <span className="text-sm text-white/95">{name}</span>
//           </div>
//         </motion.button>
//       ))}
//       {withViewAllTile && !wallets.some(w => w.isViewAll) && onViewAll && (
//         <motion.button
//           whileTap={{ scale: 0.98 }}
//           onClick={onViewAll}
//           className="group w-full rounded-2xl bg-white/5 hover:bg-white/8 transition-colors text-left p-3.5 border border-white/10 flex items-center gap-3"
//         >
//           <div className="h-11 w-11 rounded-2xl bg-[#2B2F36] grid place-items-center text-white/90">⋯</div>
//           <div className="flex flex-col">
//             <span className="text-sm text-white/95">View all wallets</span>
//           </div>
//         </motion.button>
//       )}
//     </div>
//   );
// }
