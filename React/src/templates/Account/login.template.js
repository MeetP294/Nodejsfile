/* --------------------------------- IMPORTS -------------------------------- */

import React, { Component } from "react";
import { connect } from "react-redux";
import "./login.template.less";
import { Layout, Row, Col } from "antd";
import AuthForm from "../../common/authForm/authForm.component";
import { loginWithEmail, signUpWithEmail, forgotPassword, changePassword } from "../../store/slices/user";
/* -------------------------------------------------------------------------- */

/**
 * Login Template
 * @export
 * @class LoginTemplate
 * @extends {Component}
 */
class LoginTemplate extends Component {
  render() {
    return (
      <Layout className="login-wrapper">
        
            <Row justify="center">
              <Col span={24} className="form-wrapper">
                <AuthForm
                  onSuccess={() => {
                    // After login redirect back to homepage
                    this.props.history.push(`/home`);
                  }}
                />
              </Col>
            </Row>
          
      </Layout>
    );
  }
}
export default connect(
  (state) => ({ user: state.user }),
  (dispatch) => ({
    signUpWithEmail: (userData) => dispatch(signUpWithEmail(userData)),
    loginWithEmail: (credentials) => dispatch(loginWithEmail(credentials)),
    forgotPassword: (userData) => dispatch(forgotPassword(userData)),
    changePassword: (change) => dispatch(changePassword(change)),
  })
)(LoginTemplate);
