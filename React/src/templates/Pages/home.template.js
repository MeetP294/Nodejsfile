/* --------------------------------- IMPORTS -------------------------------- */

import React from "react";
import { withRouter } from "react-router-dom";
import "./page.template.less";
import { getPage } from "../../store/slices/sitewide";
import { getMyPackages } from "../../store/slices/packages";
import { connect } from "react-redux";
import MyPackages from "../Account/My-Packages";
import { ThreeDots } from 'react-loader-spinner';

/* -------------------------------------------------------------------------- */

/**
 * Homepage Template
 * @export
 * @class HomeTemplate
 * @extends {Component}
 */
function HomeTemplate(props) {
  const {
    getPage,
    getMyPackages,
    user,
  } = props;

  React.useEffect(() => {
    window.localStorage.setItem('current_page', 'home');
    getPage('home');
  }, [getPage]);

  React.useEffect(() => {
    if(user.isLoggedIn) {
          getMyPackages(user.data.uid);
    }
  }, [user.isLoggedIn, user.data.uid, user.data.roles, getMyPackages]);
  const { home } = props.sitewide.data.node;
  const { my_packages } = props.packages.data;

 
  return (
    <div className="main-wrapper">
      <div className="col-md-12 app-page--baner">
        { !home ?
          <ThreeDots className="loader" color="#DDDDDD" height={50} width={50} />
          :
          home &&
            <div dangerouslySetInnerHTML={{ __html: home?.body[0]?.value }} />
        }

        { user.isLoggedIn && my_packages && my_packages.length > 0 && 
          <MyPackages/>
        }
      </div>
    </div>
  );
}

const mapStateToProps = (state) => ({
  ...state,
  user: state.user,
  packages: state.packages
});

const mapDispatchToProps = (dispatch) => ({
  getPage: (pageId) => dispatch(getPage(pageId)),
  getMyPackages: (userId) => dispatch(getMyPackages(userId)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(HomeTemplate));