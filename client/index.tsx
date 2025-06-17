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
import HomePage from "./page/home/home";
import TestPage from "./page/test/test";
import Header from "./component/header/header";
import Footer from "./component/footer/footer";
import LoginPage from "./page/auth/login"
import RegisterPage from "./page/auth/register";
import LogOut from "./page/auth/logout";
import Dashboard from "./page/Dashboard/Dashboard";
import EventOfTheDay from "./page/eventOfTheDay/eventOfTheDay";
import CreateIndividualPage from "./page/individual/individual";
import FormList from "./page/formList/formList";

const rootElem = document.getElementById("root");

if (!rootElem) {
  process.exit(1);
}

const root = ReactDOM.createRoot(rootElem);

root.render(
  <>
    <BrowserRouter>
      <Header />
      <Routes>
        <Route index path="/" element={<HomePage />} />
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
        <Route path="/test" element={<TestPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/logout" element={<LogOut/>} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/createIndividual" element={<CreateIndividualPage />} />
        <Route path="/eventOfTheDay" element={<EventOfTheDay />} />
        <Route path="/formList" element={<FormList />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  </>
);
