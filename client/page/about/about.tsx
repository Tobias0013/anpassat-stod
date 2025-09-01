import React from "react";

import "./about.css";


export default function ContactPage() {

  return (
    <div className="about-wrapper">
      <section className="about-section">
          <div className="about-page">
              <h1 className="about-h1">Om oss</h1>
              <p className="about-p">Välkommen till Anpassat Stöd. På denna sida kan du ta del av formulär, uppdatera dagliga händelser och hålla reda på vad du ska göra!</p>
              <h2 className="about-h2">Mer info</h2>
              <p className="about-p">
                  För mer information, <a href="https://individanpassat.se/om/" target="_blank" rel="noopener noreferrer">klicka här</a>
              </p>
          </div>
      </section>
    </div>
  );
}
