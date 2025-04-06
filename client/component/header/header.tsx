// Author: Tobias Vinblad
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

import "./header.css";

/**
 * Header component that displays a navigation bar with links based on the user's authentication status and role.
 *
 * @example
 * // Usage example:
 * // <Header />
 *
 * @returns {JSX.Element} The rendered header component.
 *
 * @remarks
 * This component uses React Router's `useLocation` hook to update the navigation bar items
 * whenever the location changes. It also checks for the presence of a token to determine
 * if the user is logged in and if the user is an admin.
 */
export default function Header() {
  const location = useLocation();
  const [showNavBar, setShowNavBar] = useState(false);

  //TODO: Update while application is changing
  let navBarItems = [
    { text: "Hem", link: "/" },
    { text: "Om oss", link: "/about" },
    { text: "Kontakt", link: "/contact" },
    { text: "Test", link: "/test" },
    { text: "Logga in", link: "/login" },
  ];

  return (
    <header>
      <div className="header-container">
        <Link to={"/"}>
          <div className="header-logo">
            <p>{"ANPASSAT STÖD"}</p>
          </div>
        </Link>

        <div
          className="header-nav-icon"
          onClick={() => setShowNavBar(!showNavBar)}
        >
          <span className="material-icons">
            {showNavBar ? "menu_open" : "menu"}
          </span>
        </div>
      </div>

      <div
        className={"header-nav"}
        style={
          showNavBar ? { height: `${navBarItems.length * 4.3 + 1.5}rem` } : {}
        }
      >
        <ul className="header-navbar" onClick={() => setShowNavBar(false)}>
          {navBarItems.map((item) => {
            return (
              <li key={item.text}>
                <Link
                  className={location.pathname === item.link ? "current" : ""}
                  to={item.link}
                >
                  {item.text}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </header>
  );
}
