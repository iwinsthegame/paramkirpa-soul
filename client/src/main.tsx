import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { pwaManager } from "./pwa";

createRoot(document.getElementById("root")!).render(<App />);
