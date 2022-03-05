import React from "react";
import ReactDOM from "react-dom";
import { Dapp } from "./components/Dapp";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import { render } from "react-dom";
// We import bootstrap here, but you can remove if you want
import "bootstrap/dist/css/bootstrap.css";

// This is the entry point of your application, but it just renders the Dapp
// react component. All of the logic is contained in it.

class Users extends React.Component{
  render() {
    return (
      <div>
        <h1>Users</h1>
        <div className="master">
          <ul>
          </ul>
        </div>
        <div className="detail">
          {this.props.children}
        </div>
      </div>
    )
  }
}

render(
  <Dapp/>,
  document.getElementById("root")
);
