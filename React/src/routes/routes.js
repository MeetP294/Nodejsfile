import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import DefaultTemplate from "../templates/Global/default.template";
import LoginTemplate from "../templates/Account/login.template";
import HomeTemplate from "../templates/Pages/home.template";
import PackageTemplate from "../templates/Pages/package.template";
import CollectionTemplate from "../templates/Pages/Collection/collection.template";
import LocationTemplate from "../templates/Pages/location.template";
import DocumentTemplate from "../templates/Pages/document.template";
import CatalogTemplate from "../templates/Pages/document-catalog.template";
import PackageForm from "../templates/Global/package-form.template";
import PreviewForm from "../templates/Global/preview-form.template";
import My_Packages from "../templates/Account/My-Packages";
import SubscriberTemplate from "../templates/Pages/subscriber.template";
import UserForm from "../templates/Account/UserForm";
import UserDetail from "../templates/Account/UserDetail";
import ContactForm from "../templates/Pages/ContactForm";
import PackagesEditForm from "../templates/Pages/PackagesEditForm";
import MergePdf from "../templates/MergePdf";
const ROUTES = [
  {
    path: "/",
    key: "HOME",
    exact: true,
    component: HomeTemplate,
  },
  {
    path: "/user/login",
    key: "USER-LOGIN",
    exact: true,
    component: LoginTemplate,
  },
  {
    path: "/package/:subscriber/:packageId",
    key: "PACKAGE",
    exact: true,
    component: PackageTemplate,
  },
  {
    path: "/content/:collectionId",
    key: "COLLECTION",
    exact: true,
    component: CollectionTemplate,
  },
  {
    path: "/location/:id",
    key: "LOCATION",
    exact: true,
    component: LocationTemplate,
  },
  {
    path: "/document/:docuId",
    key: "DOCUMENT",
    exact: true,
    component: DocumentTemplate,
  },
  {
    path: "/catalog-section/:catalog",
    key: "DOCUMENT-CATALOG",
    exact: true,
    component: CatalogTemplate,
  },
  {
    path: "/packages/add",
    key: "ADD-PACKAGE",
    exact: true,
    component: PackageForm,
  },
  {
    path: "/preview",
    key: "PREVIEW-PACKAGE",
    exact: true,
    component: PreviewForm,
  },
  {
    path: "/my-packages",
    key: "MY-PACKAGES",
    exact: true,
    component:My_Packages,
  },
  {
    path: "/pricing",
    key: "PRICING",
    exact: true,
    component: DefaultTemplate,
  },
  {
    path: "/about",
    key: "ABOUT",
    exact: true,
    component: DefaultTemplate,
  },
  {
    path: "/how-to",
    key: "HOW-TO",
    exact: true,
    component: DefaultTemplate,
  },
  {
    path: "/subscribers/:subscriberId",
    key: "SUBSCRIBER",
    exact: true,
    component: SubscriberTemplate,
  },
  {
    path: "/user/edit",
    key: "USER-EDIT",
    exact: true,
    component: UserForm,
  },
  {
    path: "/user",
    key: "USER",
    exact: true,
    component: UserDetail,
  },
  {
    path: "/contact",
    key: "",
    exact: true,
    component: ContactForm,
  },
  {
    path: "/package/edit",
    key: "Userid",
    exact: false,
    component: PackagesEditForm,
  },
  {
    path:"/merge",
    key: "Userid",
    exact: false,
    component: MergePdf,
  }
];

export default ROUTES;

/**
 * Render a route with potential sub routes
 * https://reacttraining.com/react-router/web/example/route-config
 */
function RouteWithSubRoutes(route) {
  return (
    <Route
      path={route.path}
      exact={route.exact}
      render={(props) => <route.component {...props} routes={route.routes} />}
    />
  );
}

/**
 * Use this component for any new section of routes (any config object that has a "routes" property
 */
export function RenderRoutes({ routes }) {
  return (
    <Switch>
      {routes.map((route, i) => {
        return <RouteWithSubRoutes key={route.key} {...route} />;
      })}
      <Route component={() => <h1>Not Found!</h1>} />
    </Switch>
  );
}
