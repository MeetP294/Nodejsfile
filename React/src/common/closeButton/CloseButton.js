import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWindowClose } from "@fortawesome/free-solid-svg-icons";

export default function CloseButton(props) {
  return <FontAwesomeIcon {...props} icon={faWindowClose} />;
}
