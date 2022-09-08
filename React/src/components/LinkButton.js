import React from "react";
import { Button } from "antd";
import { useHistory, useLocation } from "react-router-dom";

export default function LinkButton({ to, append, ...props }) {
  const history = useHistory();
  const location = useLocation();

  let target = to;
  if (append) {
    target = location.pathname + to;
    // Ensure no double slash silliness
    target = target.replace(/\/\//g, "/");
  }

  return (
    <Button
      onClick={() => {
        // perform onClick prop before navigating
        props.onClick && props.onClick();
        history.push(target);
        window.scrollTo(0, 0);
      }}
      {...props}
    >
      {props.children}
    </Button>
  );
}
