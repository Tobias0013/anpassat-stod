import React from "react";

import "./contact.css";


export default function ContactPage() {

  return (
    <div className="contact-wrapper">
        <section className="contact-section">
            <div className="contact-page">
                <h1 className="contact-h1">Kontakt</h1>
                <p className="contact-p">Om det är någon fråga som dyker upp, vänligen kontakta oss via mejl eller per telefon.</p>
                <h2 className="contact-h2">Kontaktperson</h2>
                <p className="contact-p">Camilla Norberg Hansen</p>
                <h2 className="contact-h2">Telefon</h2>
                <p className="contact-p">070-728 37 35</p>
                <h2 className="contact-h2">Epostadress</h2>
                <p className="contact-p">camilla@individanpassat.se</p>
            </div>
        </section>
    </div>
  );
}
