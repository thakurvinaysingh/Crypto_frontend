export default function Modal({ open, onClose, children }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60">
      <div className="card p-6 max-w-lg w-full relative text-white">
        <button onClick={onClose} className="absolute right-4 top-4 opacity-70 hover:opacity-100">✕</button>
        {children}
      </div>
    </div>
  )
}
