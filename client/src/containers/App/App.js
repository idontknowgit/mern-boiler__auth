import React, { Component } from "react";
import { withRouter } from "react-router-dom";

export class App extends Component {
  render() {
    return <div>Hello World :)</div>;
  }
}

export default withRouter(App);
