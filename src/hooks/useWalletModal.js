// src/hooks/useWalletModal.js
import { useState, useCallback } from "react";

export default function useWalletModal() {
  const [isOpen, setOpen] = useState(false);
  const open = useCallback(() => setOpen(true), []);
  const close = useCallback(() => setOpen(false), []);
  return { isOpen, open, close };
}


