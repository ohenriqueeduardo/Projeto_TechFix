import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./globals.css";
import { initializeDb } from "./utils/localDb.ts";

initializeDb();

createRoot(document.getElementById("root")!).render(<App />);

