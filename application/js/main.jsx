// Render your React component instead
import React from "react";
import App from "./app";
import { createRoot } from "react-dom/client";

// create a root - this is our single entry point
const root = createRoot(document.getElementById("reactEntry"));
// render application component
root.render(<App url="/"/>);