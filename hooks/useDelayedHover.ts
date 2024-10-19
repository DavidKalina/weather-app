import { useState, useEffect } from "react";

export const useDelayedHover = (delay: number) => {
  const [canHover, setCanHover] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setCanHover(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return canHover;
};
