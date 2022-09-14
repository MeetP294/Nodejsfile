import React from "react";
import { Menu } from "antd";
import classNames from "classnames";
import "./app-account-menu.layout.less";
import { Link, useHistory } from "react-router-dom";
import { connect } from "react-redux";
import { userLogout } from "../../store/slices/user";

const AppAccountMenu = (props) => {
  const history = useHistory();
  const { isLoggedIn } = props.user;

  const handleLogout = () => {
    history.push("/");
    props.dispatch(
      userLogout()
    ).then((res) => {
      console.log(res);
    });
  }

  return (
    <div className="menu-wrapper">
      {isLoggedIn ? (
        <Menu
          className={classNames(
            "nav",
            "nav-pills",
            "account",
            "loggedin-menu",
          )}
          mode="horizontal"
          activeKey={window.location.pathname}
          selectedKeys={window.location.pathname}
          onClick={(...args) => console.log(args)}
        >
          <Menu.Item key="/user">
            <Link to="/user">My Account</Link>
          </Menu.Item>
          <Menu.Item key="/user/logout" className="logout-btn">
            <input type="button" onClick={handleLogout} value="Log Out" />
          </Menu.Item>
        </Menu>
      ) : (
        <Menu
          className={classNames(
            "nav",
            "nav-pills",
            "account"
          )}
          mode="horizontal"
          activeKey={window.location.pathname}
          selectedKeys={window.location.pathname}
          onClick={(...args) => console.log(args)}
        >
          <Menu.Item key="/user/login" className="login">
            <Link to="/user/login">Sign In / Register</Link>
          </Menu.Item>
        </Menu>
      )}
    </div>
  );
}

export default connect((state) => ({
  user: state.user
}))(AppAccountMenu);
