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
      <Route path="/" element={<><Form /> <ColorPicker /> <Link to={"/clock"}><button>Clock</button></Link></>} />
      <Route path="/clock" element={<><Clock /> <h1>{process.env.PORT}</h1></>} />
    </Routes>
  </BrowserRouter>
  </>
);

