// src/composables/usePuntoEnComa.js
export function usePuntoEnComa() {
    const puntoComa = (num) => {
      if (typeof num !== "number" && typeof num !== "string") return num;
      return String(num).replace(".", ",");
    };
  
    return { puntoComa };
  }
  