/* --------------------------------- IMPORTS -------------------------------- */

import React from "react";
import { withRouter } from "react-router-dom";
import "./default.template.less";
import { getPage } from "../../store/slices/sitewide";
import { ThreeDots } from 'react-loader-spinner';
import { connect } from "react-redux";

/* -------------------------------------------------------------------------- */

/**
 * Default Template
 * @export
 * @class DefaultTemplate
 * @extends {Component}
 */
function DefaultTemplate(props) {
  const {
    sitewide,
    getPage
  } = props;

  const current_page = window.localStorage.getItem('current_page');

  React.useEffect(() => {
    let page = props.location.pathname.replace('/', '');
    window.localStorage.setItem('current_page', page);
    getPage(page);
  }, [props.location.pathname, getPage]);

  return (
    <div className="main-wrapper">
     
          <div className="app-page--wrapper">
            { !sitewide.data.node[`${current_page}`] ?
              <ThreeDots className="loader" color="#DDDDDD" height={50} width={50} />
              :
              sitewide.data.node[`${current_page}`] &&
                <>
                  <h1 className="page-header">{ sitewide.data.node[`${current_page}`].title[0].value }</h1>
                  <div dangerouslySetInnerHTML={{ __html: sitewide.data.node[`${current_page}`].body[0].value }} />
                </>
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
  getPage: (pageId) => dispatch(getPage(pageId))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(DefaultTemplate));