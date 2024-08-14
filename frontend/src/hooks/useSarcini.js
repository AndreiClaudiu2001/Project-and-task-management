import { useContext } from "react";
import { SarciniContext } from "../context/ContextSarcini";

export const useSarciniContext = () => {
  const context = useContext(SarciniContext);

  if (!context) {
    throw new Error("Contextul trebuie să fie inclus într-un provide");
  }

  return context;
}
