export default function DottedCard({ children, className='' }) {
  return (
    <div className={`rounded-2xl p-5 bg-black/20 border border-dashed border-white/20 text-white ${className}`}>
      {children}
    </div>
  )
}
