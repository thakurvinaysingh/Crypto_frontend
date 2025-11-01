// src/pages/dashboard/Base.jsx
export default function Base() {
  // same visuals, just easier to edit later
  const slots = [9, 10, 10, null, null];

  return (
    <div className="space-y-4">
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-semibold">Base</h2>
          <span className="rounded-xl bg-purple-600 px-4 py-2">Level 12</span>
        </div>

        <div className="grid grid-cols-5 gap-4 py-10">
          {slots.map((val, idx) => (
            <div
              key={idx}
              className={[
                "h-20 w-20 rounded-full border border-white/10 grid place-items-center",
                val == null ? "opacity-30" : "",
              ].join(" ")}
              aria-label={val == null ? "Empty slot" : `Slot value ${val}`}
            >
              {val != null ? val : null}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

