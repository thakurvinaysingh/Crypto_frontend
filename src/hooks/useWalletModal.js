// src/hooks/useWalletModal.js
import { useState, useCallback } from "react";

export default function useWalletModal() {
  const [isOpen, setOpen] = useState(false);
  const open = useCallback(() => setOpen(true), []);
  const close = useCallback(() => setOpen(false), []);
  return { isOpen, open, close };
}



// import { useCallback, useEffect, useState } from "react";

// export default function useWalletModal() {
//   const [isOpen, setIsOpen] = useState(false);
//   const [view, setView] = useState("default"); // 'default' | 'all'

//   const open = useCallback(() => { setIsOpen(true); setView("default"); }, []);
//   const close = useCallback(() => setIsOpen(false), []);
//   const showAll = useCallback(() => setView("all"), []);
//   const showDefault = useCallback(() => setView("default"), []);

//   useEffect(() => {
//     const onKey = (e) => e.key === "Escape" && setIsOpen(false);
//     if (isOpen) window.addEventListener("keydown", onKey);
//     return () => window.removeEventListener("keydown", onKey);
//   }, [isOpen]);

//   return { isOpen, open, close, view, showAll, showDefault };
// }
