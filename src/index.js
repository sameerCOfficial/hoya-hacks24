import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.js";
import styles from "./styles.css"

const root = createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);