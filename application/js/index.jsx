// Render your React component instead
import React from "react";
import App from "./app";
import { createRoot } from "react-dom/client";

// create a root - this is our single entry point
const root = createRoot(document.getElementById("reactEntry"));
// render application component
root.render(<App />);

/*
import React from 'react';
import ReactDOM from 'react-dom';
import './Stylesheets/index.css';
import App from './App';
import Routes from './components/Navbar'
import 'bootstrap/dist/css/bootstrap.min.css';
import reportWebVitals from './reportWebVitals';


ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals();
*/
