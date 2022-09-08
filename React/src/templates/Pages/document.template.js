/* --------------------------------- IMPORTS -------------------------------- */

import React from "react";
import { useParams, withRouter, Link } from "react-router-dom";
import "./package.template.less";
import { getDocument } from "../../store/slices/documents";
import { PDFButton } from "../../common/pdfButton/PDFButton";
import { connect } from "react-redux";

/* -------------------------------------------------------------------------- */

/**
 * Document Package Template
 * @export
 * @class DocumentTemplate
 * @extends {Component}
 */
function DocumentTemplate(props) {
  const {
  	getDocument
  } = props;
  const { docuId } = useParams();

  React.useEffect(() => {
    getDocument(docuId);
  }, [docuId, getDocument]);

  const { single_document } = props.documents.data;
  let url = single_document?.field_catalog?.label;
  url = url?.replace('/ /g', '-');

  return (
    <div className="main-wrapper">
      
      	{ single_document && 
      		<div className="col-md-12 docu-collection--wrapper">
            <div className="row">
              <div className="col-sm-9">
          			<h1>{single_document.title}</h1>
    	      		<div dangerouslySetInnerHTML={{ __html: single_document.body }} />
                { single_document.field_pdf && 
                  <PDFButton 
                    to={single_document.field_pdf.url} 
                    text="PDF Sample"
                    target="_blank" 
                    icon_position="left" 
                    button_style="btn-info" 
                    size="btn-md"
                  />
                }
              </div>
              <div className="col-sm-3">
                { single_document?.field_image &&
                  <img src={single_document?.field_image?.url} alt="Document screenshot" />
                }
                { single_document?.field_catalog?.id && 
                  <div>
                    <strong>Catalog: </strong>
                    <Link to={`/catalog-section/${url.toLowerCase()}`}>
                      {single_document?.field_catalog?.label}
                    </Link>
                  </div>
                }
                { single_document.field_page_count && 
                  <div>
                    <strong>Page Count: </strong>
                    <span>{single_document.field_page_count[0].value}</span>
                  </div>
                }
              </div>
            </div>
      		</div>
      	}
    
    </div>
  );
}

const mapStateToProps = (state) => ({
  ...state,
  user: state.user,
  documents: state.documents
});

const mapDispatchToProps = (dispatch) => ({
  getDocument: (nid) => dispatch(getDocument(nid)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(DocumentTemplate));