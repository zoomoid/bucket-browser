import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ThemeProvider } from "./components/theme-provider.tsx";
import { DataProvider } from "./hooks/use-fetch.tsx";
import Scaffolding from "./components/scaffolding.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <DataProvider>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <Scaffolding>
          <App />
        </Scaffolding>
      </ThemeProvider>
    </DataProvider>
  </StrictMode>
);
