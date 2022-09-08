import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from '@fortawesome/fontawesome-svg-core'
import { faFilePdf } from '@fortawesome/free-regular-svg-icons';
import classNames from "classnames";
import "./PDFButton.less";
import { Link } from "react-router-dom";
library.add(faFilePdf);

export function PDFButton(props) {
  const { size } = props;
  let button_style = props.button_style ? props.button_style : 'btn-danger';
  let position = props.icon_position ? props.icon_position : 'right';
  let target = props.target ? props.target : '';
  return (
  	<Link to={{ pathname: props.to }} target={target} className={classNames(
        "btn",
        button_style,
        "icon-pos-" + position,
        size
      )}>
      { position === 'left' && <FontAwesomeIcon icon={['far', 'file-pdf']} /> }
  		{ props.text ? props.text : 'PDF' }
      { position === 'right' && <FontAwesomeIcon icon={['far', 'file-pdf']} /> }
  	</Link>
  );
}
