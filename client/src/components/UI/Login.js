import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faGoogle, faFacebookSquare } from "@fortawesome/free-brands-svg-icons";
import "./Login.css";

export default function Login() {
  return (
    <div className="login-form">
      <form>
        <label htmlFor="email" />
        <input type="email" placeholder="Write your email adress" />
        <br />
        <label htmlFor="password" />
        <input type="password" placeholder="Write your password" />
        <br />
        <label htmlFor="submit" />
        <button className={["login-button", "button"].join(" ")} type="submit">
          Login
        </button>
      </form>
      <p className="or">OR</p>
      <button className={["google-button", "button"].join(" ")}>
        <span>
          <FontAwesomeIcon icon={faGoogle} />
        </span>
        Continue with Google
      </button>
      <button className={["facebook-button", "button"].join(" ")}>
        <span>
          <FontAwesomeIcon icon={faFacebookSquare} />
        </span>
        Continue with Facebook
      </button>
      <p className="modal-foot">Not on WaifuTime? Sign up</p>
    </div>
  );
}
