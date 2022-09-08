/* --------------------------------- IMPORTS -------------------------------- */

import React, { Component } from "react";
import "./app-container.component.less";

/**
 * Generic container for content
 * @export
 * @class AppContainer
 * @extends {Component}
 */
export class AppContainer extends Component {
  render() {
    return (
      <div className="app-container" style={this.props.style}>
        {this.props.children}
      </div>
    );
  }
}

export default AppContainer;
