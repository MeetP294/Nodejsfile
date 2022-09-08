/* --------------------------------- IMPORTS -------------------------------- */

import React, { Component } from "react";
import { Layout } from "antd";
import { Container } from "reactstrap";
import classNames from "classnames";
import "./app-footer.layout.less";
import { connect } from "react-redux";

/* -------------------------------------------------------------------------- */

const { Footer } = Layout;

/**
 * Default Footer Component
 * @export
 * @class AppFooter
 * @extends {Component}
 */
export class AppFooter extends Component {
  render() {
    const { copyright } = this.props;

    return (
      <Footer className="footer" id="footer">
          <Container>
            <div className={classNames(
              "col-md-6",
              "col-sm-6",
              "text-left"
            )}>
              <p>2701 E. Grauwyler Rd. Building 1, DPT#1026, Irving, TX 75061<br />608/274-4849</p>
            </div>
            <div className={classNames(
              "col-md-6",
              "col-sm-6",
              "text-right"
            )}>
              <p>©SBCA. All rights reserved. {copyright}</p>
            </div>
          </Container>
      </Footer>
    );
  }
}

export default connect((state) => ({
  copyright: state.global.data
}))(AppFooter);
