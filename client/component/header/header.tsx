// Author: Tobias Vinblad
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import "./header.css";

/**
 * Header component that displays a navigation bar with links based on the user's authentication status.
 *
 * - Shows "Logga in" when not authenticated.
 * - Shows "Logga ut" when authenticated (clicking it clears the token and redirects to /login).
 * - "Hem" links to dashboard when logged in, otherwise "/".
 */
export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const [showNavBar, setShowNavBar] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    // navigation will go to /login via the Link; this ensures token is cleared first
  };

  // Build navbar items. For "Logga ut", we provide a link to /login and attach onClick.
  const navBarItems: Array<
    | { text: string; link: string; onClick?: () => void }
  > = [
    { text: "Hem", link: isLoggedIn ? "/dashboard" : "/" },
    { text: "Om oss", link: "/about" },
    { text: "Kontakt", link: "/contact" },
    { text: "Test", link: "/test" },
    isLoggedIn
      ? { text: "Logga ut", link: "/login", onClick: handleLogout }
      : { text: "Logga in", link: "/login" },
  ];

  return (
    <header>
      <div className="header-container">
        <Link to={isLoggedIn ? "/dashboard" : "/"}>
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
        className="header-nav"
        style={
          showNavBar ? { height: `${navBarItems.length * 4.3 + 1.5}rem` } : {}
        }
      >
        <ul className="header-navbar" onClick={() => setShowNavBar(false)}>
          {navBarItems.map((item) => (
            <li key={item.text}>
              <Link
                className={location.pathname === item.link ? "current" : ""}
                to={item.link}
                onClick={item.onClick}
              >
                {item.text}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}
