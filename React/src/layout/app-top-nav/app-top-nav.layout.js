import React from 'react';
import "./app-top-nav.layout.less";
import { BrowserView, MobileView } from "react-device-detect";
import { Link } from "react-router-dom";
import { Layout, Menu } from "antd";
import classNames from "classnames";
import {
	Container,
  Navbar,
  NavbarToggler,
  Collapse
} from 'reactstrap';
import AppAccountMenu from "../app-account-menu/app-account-menu.layout";
import { connect } from "react-redux";

const { Header, Content } = Layout;
const { SubMenu } = Menu;
  
const AppTopNav = (props) => {
	// Collapse isOpen State
  const [isOpen, setIsOpen] = React.useState(false);

  const {
    isLoggedIn
  } = props.user;

  return (
  	<Layout className="layout">
      <Header
        className={classNames(
          "navbar",
          "navbar-fixed-top",
          "navbar-default"
        )}>
        <Container>
          <div className="navbar-header">
            <Link
              className={classNames(
                "logo",
                "pull-left"
              )}
              to="/"
              title="Home"
            >
              <img alt="SBCA Docs" src={props.sitewide ? props.sitewide.data.banner : '/'} />
            </Link>
            <MobileView>
              <NavbarToggler onClick={() => { setIsOpen(!isOpen) }} className="navbar-toggle">
              	<span className="sr-only">Toggle navigation</span>
              	<span className="icon-bar"></span>
              	<span className="icon-bar"></span>
              	<span className="icon-bar"></span>
              </NavbarToggler>
            </MobileView>
          </div>
          <BrowserView className={classNames(
              "navbar-collapse",
              "collapsed"
            )}>
			      <Navbar role="navigation" className="container">
		      		<Menu
	              className={classNames(
	                "menu",
	                "nav",
	                "navbar-nav",
	                "sm",
	                "main-menu"
	              )}
	              mode="horizontal"
	              activeKey={window.location.pathname}
	              selectedKeys={window.location.pathname}
	              onClick={(...args) => console.log(args)}
	            >
	            {isLoggedIn ? (
	            	<Menu.Item key="/my-packages">
		              <Link to="/my-packages">My Packages</Link>
		            </Menu.Item>	
	            ) : ''}
	            <Menu.Item key="/pricing">
	              <Link to="/pricing">Pricing</Link>
	            </Menu.Item>
	              <SubMenu
	                key="sub1"
	                title="About"
	              >
	                <Menu.Item key="/about">
	                  <Link to="/about">What is SBCAdocs?</Link>
	                </Menu.Item>
	                <Menu.Item key="/how-to">
	                  <Link to="/how-to">
	                    How To Use the System
	                  </Link>
	                </Menu.Item>
	              </SubMenu>
	            </Menu>
			      </Navbar>
				  </BrowserView>
				  {/*Mobile nav*/}
				  <MobileView className={classNames(
              "navbar-collapse",
              "collapsed"
            )}>
		        <Collapse isOpen={isOpen} navbar className="mobile-menu">
		          <Menu
	              className={classNames(
	                "menu",
	                "nav",
	                "navbar-nav",
	                "main-menu"
	              )}
	              mode="vertical"
	              activeKey={window.location.pathname}
	              selectedKeys={window.location.pathname}
	              onClick={(...args) => console.log(args)}
	            >
	            <Menu.Item key="/pricing">
	              <Link to="/pricing">Pricing</Link>
	            </Menu.Item>
	              <SubMenu
	                key="sub1"
	                title="About"
	              >
	                <Menu.Item key="/about">
	                  <Link to="/about">What is SBCAdocs?</Link>
	                </Menu.Item>
	                <Menu.Item key="/how-to">
	                  <Link to="/how-to">
	                    How To Use the System
	                  </Link>
	                </Menu.Item>
	              </SubMenu>
	            </Menu>
		        </Collapse>
		      </MobileView>
		      {/*Mobile Nav End*/}
        </Container>
      </Header>

      <Content>
      	<div id="page-header">
      		<Container>
		      	<AppAccountMenu />
		      </Container>
      	</div>
      </Content>
    </Layout>
  );
}
  
export default connect((state) => ({
  user: state.user,
  sitewide: state.sitewide
}))(AppTopNav);