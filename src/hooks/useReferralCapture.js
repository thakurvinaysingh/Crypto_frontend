// src/hooks/useReferralCapture.js
import { useEffect } from "react";

const REFERRAL_KEY = "referral_code";

export function useReferralCapture() {
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const urlRef = params.get("ref");

      if (!urlRef) return;

      // Optional rule: only set if not already saved (so first ref "wins")
      const existing = localStorage.getItem(REFERRAL_KEY);
      if (!existing) {
        localStorage.setItem(REFERRAL_KEY, urlRef);
      }

      // If you prefer "last ref wins", just do:
      // localStorage.setItem(REFERRAL_KEY, urlRef);
    } catch (err) {
      console.error("Failed to capture referral code from URL:", err);
    }
  }, []);
}
