import React from "react";

// import "./worker.config.js";

import "./themes/antd-sbca.less";
import "./themes/sbca-global.less";
import "./App.css";
import ROUTES, { RenderRoutes } from "./routes/routes";
// import { ModalProvider, ModalContainer } from "./hooks/useModal";
import { checkUserAuthStatus } from "./store/slices/user";
import { Provider, connect } from "react-redux";
import { configureAppStore } from "./store/configureStore";
import TagManager from "react-gtm-module";

// import { AppFooter } from "../../layout/app-footer/app-footer.layout";
import { Container } from "reactstrap";
import AppTopNav from "./layout/app-top-nav/app-top-nav.layout";
import {AppFooter} from "./layout/app-footer/app-footer.layout";


const tagManagerArgs = {
  gtmId: "GTM-5T7QRZH",
};

TagManager.initialize(tagManagerArgs);

const store = configureAppStore();
// function App({ globalSettings, checkUserAuthStatus }) {
// const { venueId } = useParams();

function App({ checkUserAuthStatus }) {
  React.useEffect(() => {
    checkUserAuthStatus();
  }, [checkUserAuthStatus]);

  return (
    <div className="app-wrapper-g">
      <AppTopNav />
      <Container>
        <RenderRoutes routes={ROUTES} />
      </Container>
      <AppFooter />
    </div>
  );
}

const ConnectedApp = connect(
  (state) => ({ user: state.user }),
  (dispatch) => ({
    checkUserAuthStatus: () => dispatch(checkUserAuthStatus()),
  })
)(App);

export default () => (
  <Provider store={store}>
    <ConnectedApp />
  </Provider>
);
