import React from "react";
import { useState } from "react";

/**
 * A React functional component that renders a form.
 *
 * This component renders a form that takes a user's name as input.
 * When the form is submitted, an alert is shown with a greeting message.
 *
 * @returns {React.ReactNode} The rendered component.
 *
 * @example
 * // Usage example:
 * // <Form />
 *
 */
export default function Form() {
  const [name, setName] = useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    alert(`Hello ${name}. Hope you have a good day :D`);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Enter your name:
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </label>
    </form>
  );
}
