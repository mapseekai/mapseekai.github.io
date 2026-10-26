import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { App } from "./App";
import { metadata } from "./content/site";
import "./styles.css";
import "./atelier.css";
import "./craft.css";
import "lenis/dist/lenis.css";
import "./craft-motion.css";

const root = document.getElementById("root");
if (!root) throw new Error("Missing application root.");
const path = window.location.pathname;
const app = (
  <StrictMode>
    <App path={path} />
  </StrictMode>
);
if (root.dataset.prerendered === "true") hydrateRoot(root, app);
else {
  document.title = metadata(path).title;
  createRoot(root).render(app);
}
