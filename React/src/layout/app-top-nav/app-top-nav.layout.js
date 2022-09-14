import React from 'react';
import "./app-top-nav.layout.less";
import { BrowserView, MobileView } from "react-device-detect";
import { NavLink } from "react-router-dom";
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

function debounce(fn, ms) {
  let timer
  return _ => {
    clearTimeout(timer)
    timer = setTimeout(_ => {
      timer = null
      fn.apply(this, arguments)
    }, ms)
  };
}
  
const AppTopNav = (props) => {
	// Collapse isOpen State
  const [isOpen, setIsOpen] = React.useState(false);
  const [dimensions, setDimensions] = React.useState({ 
    height: window.innerHeight,
    width: window.innerWidth
  });

  React.useEffect(() => {
    const debouncedHandleResize = debounce(function handleResize() {
      setDimensions({
        height: window.innerHeight,
        width: window.innerWidth
      })
    }, 1000)

    window.addEventListener('resize', debouncedHandleResize)

    return _ => {
      window.removeEventListener('resize', debouncedHandleResize)
    }
  }, [dimensions]);

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
            <NavLink
              className={classNames(
                "logo",
                "pull-left"
              )}
              to="/"
              title="Home"
            >
              <img alt="SBCA Docs" src={props.sitewide ? props.sitewide.data.banner : '/'} />
            </NavLink>
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
		              <NavLink activeClassName="active" to="/my-packages">My Packages</NavLink>
		            </Menu.Item>	
	            ) : ''}
	            <Menu.Item key="/pricing">
	              <NavLink activeClassName="active" to="/pricing">Pricing</NavLink>
	            </Menu.Item>
	              <SubMenu
	                key="sub1"
	                title="About"
	              >
	                <Menu.Item key="/about">
	                  <NavLink activeClassName="active" to="/about">What is SBCAdocs?</NavLink>
	                </Menu.Item>
	                <Menu.Item key="/how-to">
	                  <NavLink activeClassName="active" to="/how-to">
	                    How To Use the System
	                  </NavLink>
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
		        <Collapse isOpen={isOpen} navbar className={dimensions.width < 768 ? 'mobile-menu' : ''}>
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
              {isLoggedIn ? (
                <Menu.Item key="/my-packages" onClick={() => { setIsOpen(!isOpen) }}>
                  <NavLink activeClassName="active" to="/my-packages">My Packages</NavLink>
                </Menu.Item>  
              ) : ''}
	            <Menu.Item key="/pricing" onClick={() => { setIsOpen(!isOpen) }}>
	              <NavLink activeClassName="active" to="/pricing">Pricing</NavLink>
	            </Menu.Item>
	              <SubMenu
	                key="sub1"
	                title="About"
	              >
	                <Menu.Item key="/about" onClick={() => { setIsOpen(!isOpen) }}>
	                  <NavLink activeClassName="active" to="/about">What is SBCAdocs?</NavLink>
	                </Menu.Item>
	                <Menu.Item key="/how-to" onClick={() => { setIsOpen(!isOpen) }}>
	                  <NavLink activeClassName="active" to="/how-to">
	                    How To Use the System
	                  </NavLink>
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