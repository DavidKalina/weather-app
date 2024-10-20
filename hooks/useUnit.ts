// File: /src/hooks/useUnit.ts

import { useState, useEffect } from "react";
import { toast } from "sonner";

const UNIT_STORAGE_KEY = "temperature_unit";

const useUnit = (): {
  unit: "C" | "F";
  toggleUnit: () => void;
} => {
  const [unit, setUnit] = useState<"C" | "F">("C");

  // Initialize unit from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUnit = localStorage.getItem(UNIT_STORAGE_KEY);
      if (storedUnit === "C" || storedUnit === "F") {
        setUnit(storedUnit);
      }
    }
  }, []);

  // Save unit to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(UNIT_STORAGE_KEY, unit);
    }
  }, [unit]);

  const toggleUnit = () => {
    setUnit((prevUnit) => {
      if (prevUnit === "C") {
        toast.success("Unit changed to Fahrenheit!");
        return "F";
      }
      if (prevUnit == "F") {
        toast.success("Unit changed to Celsius!");
        return "C";
      }
      return "F";
    });
  };

  return { unit, toggleUnit };
};

export default useUnit;
