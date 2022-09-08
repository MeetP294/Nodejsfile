import React from "react";
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebookF } from "@fortawesome/free-brands-svg-icons";
import { Button } from "antd";

export default function FacebookButton({ className, onSuccess }) {
  return (
    <FacebookLogin
      appId="504395723594380"
      fields="name,email,picture"
      callback={onSuccess}
      render={(renderProps) => (
        <Button onClick={renderProps.onClick} className={className}>
          <FontAwesomeIcon icon={faFacebookF} />
          <span>Log in with Facebook</span>
        </Button>
      )}
    />
  );
}
