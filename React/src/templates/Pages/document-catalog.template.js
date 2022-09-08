/* --------------------------------- IMPORTS -------------------------------- */

import React from "react";
import { useParams, withRouter, Link } from "react-router-dom";
import { format } from 'date-fns';
import "./page.template.less";
import { getDocumentsByCatalog } from "../../store/slices/documents";
import { connect } from "react-redux";

/* -------------------------------------------------------------------------- */

/**
 * Document Catalog Template
 * @export
 * @class CatalogTemplate
 * @extends {Component}
 */
function CatalogTemplate(props) {
	const {
  	getDocumentsByCatalog,
    user
  } = props;
  const { catalog } = useParams();

  React.useEffect(() => {
    getDocumentsByCatalog(catalog);
  }, [catalog, getDocumentsByCatalog]);

	const { catalog_docs } = props.documents.data;
	let catalog_name = catalog?.replace('/-/g', ' ');

  return (
    <div className="main-wrapper">
     
      	<h1>{catalog_name?.toUpperCase()}</h1>
      	{user.isLoggedIn && Object.keys(catalog_docs).length > 0 && Object.keys(catalog_docs).map((key, id) => {
    			let docu = catalog_docs[key];
    			let created = new Date(docu?.created[0]?.value);
    			return (
    				<div className="document-teaser" key={id}>
    					<h2>
    						<Link to={`/document/${docu?.nid[0]?.value}`}>
                  {docu?.title[0]?.value}
                </Link>
               </h2>
    					<span className="submitted">
    						Submitted by <Link to={`/document/${docu?.uid[0]?.target_id}`}>User</Link> on {format(created, 'PPPPp')}
    					</span>
    					<div className="text-left" dangerouslySetInnerHTML={{ __html: docu?.body[0]?.value }} />
    					<div className="footer">
    						<div><strong>Catalog:&nbsp;</strong>
    							<Link to={`/document/${docu?.nid[0]?.value}`}>{catalog_name?.toUpperCase()}</Link>
    						</div>
    						<Link to={`/document/${docu?.nid[0]?.value}`}>Read More</Link>
    					</div>
    				</div>
    			);
    		})}
      
    </div>
  );
}

const mapStateToProps = (state) => ({
  ...state,
  user: state.user,
  documents: state.documents
});

const mapDispatchToProps = (dispatch) => ({
  getDocumentsByCatalog: (nid) => dispatch(getDocumentsByCatalog(nid)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(CatalogTemplate));