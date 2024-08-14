import React from "react";
import { createRoot } from "react-dom/client"; // Importă createRoot
import { ProiecteContextProvider } from "./context/ContextProiecte";
import { AuthContextProvider } from "./context/ContextAutentificare";
import { AdministratoriContextProvider } from "./context/ContextAdministratori";
import App from "./app"; // Asigură-te că fișierul este corect scris cu litera mare
import { SarciniContextProvider } from "./context/ContextSarcini";
import { StudentiContextProvider } from "./context/ContextStudenti";
import { FacultatiContextProvider } from "./context/ContextFacultati";
import { SpecializariContextProvider } from "./context/ContextSpecializari";
import { AniContextProvider } from "./context/ContextAni";
import { MembriiSarciniContextProvider } from "./context/ContextMembriiSarcini";

const container = document.getElementById("root");
const root = createRoot(container); // Creează un root

root.render(
  <React.StrictMode>
    <AuthContextProvider>
      <ProiecteContextProvider>
        <SarciniContextProvider>
          <AdministratoriContextProvider>
            <StudentiContextProvider>
              <FacultatiContextProvider>
                <SpecializariContextProvider>
                  <AniContextProvider>
                   <MembriiSarciniContextProvider>
                   {" "}
                    <App />
                   </MembriiSarciniContextProvider>
                  
                  </AniContextProvider>
                </SpecializariContextProvider>
              </FacultatiContextProvider>
            </StudentiContextProvider>
          </AdministratoriContextProvider>
        </SarciniContextProvider>
      </ProiecteContextProvider>
    </AuthContextProvider>
  </React.StrictMode>
);
