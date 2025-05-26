// useScrollLock.ts
import { useEffect } from "react";

let scrollLockCount = 0;

export function useScrollLock() {
  useEffect(() => {
    scrollLockCount++;
    if (scrollLockCount === 1) {
      document.body.style.overflow = "hidden";
    }

    return () => {
      scrollLockCount--;
      if (scrollLockCount === 0) {
        document.body.style.overflow = "auto";
      }
    };
  }, []);
}