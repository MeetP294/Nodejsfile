/* --------------------------------- IMPORTS -------------------------------- */

import React from "react";
import { useParams, withRouter, Link } from "react-router-dom";
import "../package.template.less";
import { getDocuCollection } from "../../../store/slices/documents";
import { connect } from "react-redux";

/* -------------------------------------------------------------------------- */

/**
 * Collection Template
 * @export
 * @class CollectionTemplate
 * @extends {Component}
 */
function CollectionTemplate(props) {
  const {
  	getDocuCollection
  } = props;
  
  const { collectionId } = useParams();

  React.useEffect(() => {
    getDocuCollection(collectionId);
  }, [collectionId, getDocuCollection]);

  const {
    docu_collection
  } = props.documents.data;

  return (
    <div className="main-wrapper">
      { docu_collection && Object.keys(docu_collection).length > 0 &&
    		<div className="col-md-12 docu-collection--wrapper">
    			<h1>{docu_collection.title}</h1>
      		<div dangerouslySetInnerHTML={{ __html: docu_collection.body }} />
      		{ docu_collection.field_documents.length > 0 && 
      			<div className="docu-collection--documents">
	      			<strong>Documents:</strong>
	      			{docu_collection.field_documents.map((pack, id) => {
	      				return (
			      			<div key={id} className="docu-item">
			      				<Link to={`/document/${pack.id}`}>{pack.label}</Link>
			      			</div>
	      				);
	      			})}
	      		</div>
      		}
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
  getDocuCollection: (nid) => dispatch(getDocuCollection(nid)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(CollectionTemplate));