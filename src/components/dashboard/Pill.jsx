export default function Pill({ children, className='' }) {
  return (
    <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm bg-black/30 border border-white/10 ${className}`}>
      {children}
    </span>
  )
}
