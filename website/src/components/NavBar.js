import React from "react";
import "./NavBar.css";

function NavBar(props) {
  return (
    <nav className="navbar navbar-dark">
      <a className="navbar-brand" href="/">
        D<span className="brand-a">A</span>L P
      </a>
      <div className="my-2 my-lg-0">
        <span>Logged in as {props.name}</span>
      </div>
    </nav>
  );
}

export default NavBar;
