/**
 * Entry point for the React application.
 *
 * This file imports necessary React modules and components,
 * and renders them into the root DOM element.
 *
 * The application will exit if the root DOM element is not found.
 */
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";

import Clock from "./component/clock";
import Form from "./component/form";
import ColorPicker from "./component/colorPicker";
import "./index.css";

const rootElem = document.getElementById("root");

if (!rootElem) {
  process.exit(1);
}

const root = ReactDOM.createRoot(rootElem);

root.render(
  <>
    <BrowserRouter>
      <Routes>
        <Route index path="/" element={<h1>Index</h1>} />
        <Route
          path="/color"
          element={
            <>
              <div className="a"></div>
              <div className="b"></div>
              <div className="c"></div>
            </>
          }
        />
      </Routes>
    </BrowserRouter>
  </>
);
