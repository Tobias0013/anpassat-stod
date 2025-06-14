import React from "react";
import { Link } from "react-router-dom";
import "./footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section about">
          <h3>Anpassat Stöd</h3>
        </div>

        <div className="footer-section links">
          <h4>Länkar</h4>
          <ul>
            <li><Link to="/about">Om oss</Link></li>
            <li><Link to="/contact">Kontakt</Link></li>
          </ul>
        </div>

        <div className="footer-section contact">
          <h4>Kontakt</h4>
          <p>Email: kontakt@anpassatstod.se</p>
          <p>Telefon: 070-123 45 67</p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2025 Anpassat Stöd.</p>
      </div>
    </footer>
  );
}
