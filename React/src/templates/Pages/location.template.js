import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import "./page.template.less";
import { getLocation } from "../../store/slices/packages";

const LocationTemplate = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  useEffect(() => {
    if(id) {
      dispatch(getLocation(id));
    }
  }, [dispatch, id]);
  const location = useSelector((state) => state?.packages?.data?.location);

  return (
    <>
    
        <div className="location--wrapper">
          <h1 className="page-header">{location?.title}</h1>
          {location?.field_testing?.length > 0 &&
            <div className="location--testing inline-text">
              <label>Testing:&nbsp;</label>
              <div className="field-item">
                {location?.field_testing[0].value === true ? 'On' : 'Off'}
              </div>
            </div>
          }
          {location?.field_coid?.length > 0 &&
            <div className="location--coid inline-text">
              <label>COID:&nbsp;</label>
              <div className="field-item">
                {location?.field_coid[0].value}
              </div>
            </div>
          }
          {location?.field_locid?.length > 0 &&
            <div className="location--locid inline-text">
              <label>LOCID:&nbsp;</label>
              <div className="field-item">
                {location?.field_locid[0].value}
              </div>
            </div>
          }
          {location?.field_address?.length > 0 &&
            <div className="location--address">
              <label>Mailing Address:&nbsp;</label>
              <div className="field-item">
                {location?.field_address[0].address_line1}
              </div>
            </div>
          }
          {location?.field_address?.length > 0 &&
            <div className="location--address inline-text">
              <label>City:&nbsp;</label>
              <div className="field-item">
                {location?.field_address[0].administrative_area}
              </div>
            </div>
          }
          {location?.field_address?.length > 0 &&
            <div className="location--address inline-text">
              <label>State:&nbsp;</label>
              <div className="field-item">
                {location?.field_address[0].locality}
              </div>
            </div>
          }
        </div>
    
    </>
    );
  };

  export default LocationTemplate;
