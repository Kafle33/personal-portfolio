import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Every visit starts at the top: the mission-sequence preloader plays first
// and lands on the hero — never on a browser-restored scroll position.
if ("scrollRestoration" in window.history) {
  window.history.scrollRestoration = "manual";
}
window.scrollTo(0, 0);

createRoot(document.getElementById("root")!).render(<App />);
