import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import SelectState from "../../common/SelectState";
import { useSelector, useDispatch } from "react-redux";
import classNames from "classnames";
import "./default.template.less";
import { getDocuCollections } from "../../store/slices/documents";
const PackageForm = (props) => {
  const userData=props?.location?.state
  const dispatch = useDispatch();
  const history = useHistory();
  const [checked, SetChecked] = useState();
  const [error, SetError] = useState({});
  const [data, SetData] = useState({
    field_job_number: "",
    field_expDate: "",
    field_notes: "",
    field_documents: "",
    field_customer_name: "",
    address_line1: "",
    address_line2: "",
    locality: "",
    administrative_area: "",
    postal_code: "",
    field_qr_code: "",
  });
  useEffect(() => {
    dispatch(getDocuCollections()); 
    userData && SetData({...data,...userData})
  }, []);

  const jobData = useSelector(
    (state) => state.documents?.data?.docu_collections[0]
  );
  const handleChange = (event) => {
    SetData({ ...data, [event.target.name]: event.target.value });
  };
  const handleCheck = (event) => {
    SetChecked(event.target.value);
    SetData({ ...data, [event.target.name]: event.target.value });
  };
  const handleClick = (e) => {
    e.preventDefault();
    if (validation()) {
      history.push({ pathname: "/preview", state: data });
    }
  };
  const validation = () => {
    var err = {};
    if (data.field_job_number === "") {
      err["field_job_number"] = "this field is required";
    }
    if (data.field_documents === "") {
      err["field_documents"] = "this field is required";
    }
    if (data.address_line1 === "") {
      err["address_line1"] = "this field is required";
    }
    if (data.locality === "") {
      err["locality"] = "this field is required";
    }
    if (data.field_expDate === "") {
      err["field_expDate"] = "this field is required";
    }
    if (data.administrative_area === "") {
      err["administrative_area"] = "this field is required";
    }
    if (data.postal_code === "") {
      err["postal_code"] = "this field is required";
    }
    SetError({ ...err });
    return Object.values(err).length < 1 && true;
  };

  return (
    <>
     
      <div className="containor">
        <div className="FormContainer">
          <h1>Create Jobsite Package</h1>
          <h3>Package Information</h3>
          <form>
            <div
              className={classNames(
                "form-item",
                error.field_job_number !== "" &&
                  error.field_job_number &&
                  "error"
              )}
            >
              <label>
                Job Number{" "}
                <span className="form-required" title="This field is required.">
                  *
                </span>
              </label>
              <input
                className="form-control"
                type="text"
                name="field_job_number"
                placeholder="Number"
                onChange={handleChange}
                value={data.field_job_number}
              />
              <span>Please enter a unique job number for this package</span>
            </div>
            <div
              className={classNames(
                "form-item",
                error.field_expDate !== "" && error.field_expDate && "error"
              )}
            >
              <label>
                Expiration Date{" "}
                <span className="form-required" title="This field is required.">
                  *
                </span>
              </label>
              <input
                className="form-control"
                type="date"
                name="field_expDate"
                placeholder="date"
                onChange={handleChange}
                value={data.field_expDate}
              />
              <span>Please enter the date that this package should expire</span>
            </div>
            <div className="form-item">
              <label>Notes</label>
              <span>
                Include any custom notes related to this jobsite package here.
                Data entered in this field will only be visible to package
                authors and site administrators
              </span>
              <textarea
                className="form-control"
                name="field_notes"
                cols="60"
                rows="2"
                onChange={handleChange}
                value={data.field_notes}
              />
            </div>
            <div
              className={classNames(
                "form-item",
                error.field_documents !== "" && error.field_documents && "error"
              )}
            >
              <label>
                Jobsite Package{" "}
                <span className="form-required" title="This field is required.">
                  *
                </span>
              </label>
              <span>Please choose a package from the list below</span>
              {jobData?.map((key) => {
                return (
                  <>
                    <div className="radio_Group">
                      <label>
                        <input
                          className="radio"
                          type="radio"
                          id="siteJob"
                          name="field_documents"
                          value={key.nid}
                          checked={checked === key.nid ? true : false}
                          onChange={handleCheck}
                        />{" "}
                        {key.title}
                      </label>
                    </div>
                  </>
                );
              })}
            </div>
            <div className="form-item">
              <label>Customer</label>
              <input
                className="form-control"
                type="text"
                placeholder="Name"
                name="field_customer_name"
                onChange={handleChange}
                value={data.field_customer_name}
              />
              <span>
                The name of the customer or client that this package is being
                generated for.
              </span>
            </div>

            <div className="form-group">
              <h3 className="bottom-border">Jobsite Address</h3>
              <span>
                Please enter the street address including specific building
                details for the jobsite using the fields below.
              </span>
              <div
                className={classNames(
                  "form-item",
                  error.address_line1 !== "" && error.address_line1 && "error"
                )}
              >
                <label>
                  Address{" "}
                  <span
                    className="form-required"
                    title="This field is required."
                  >
                    *
                  </span>
                </label>
                <input
                  className="form-control"
                  type="text"
                  name="address_line1"
                  placeholder=""
                  onChange={handleChange}
                  value={data.address_line1}
                />
              </div>
              <div className="form-item">
                <label>Address 2</label>
                <input
                  className="form-control"
                  type="text"
                  name="address_line2"
                  placeholder=""
                  onChange={handleChange}
                  value={data.address_line2}
                />
              </div>
              <div
                className={classNames(
                  "form-item",
                  error.locality !== "" && error.locality && "error"
                )}
              >
                <label>
                  City{" "}
                  <span
                    className="form-required"
                    title="This field is required."
                  >
                    *
                  </span>
                </label>
                <input
                  className="form-control"
                  type="text"
                  name="locality"
                  placeholder=""
                  onChange={handleChange}
                  value={data.locality}
                />
              </div>
              <div
                className={classNames(
                  "form-item",
                  error.state !== "" && error.state && "error"
                )}
              >
                <label>
                  State/Province{" "}
                  <span
                    className="form-required"
                    title="This field is required."
                  >
                    *
                  </span>
                </label>
                <SelectState val={data.administrative_area} method={SetData} data1={data} />
              </div>
              <div
                className={classNames(
                  "form-item",
                  error.postal_code !== "" && error.postal_code && "error"
                )}
              >
                <label>
                  Zip Code{" "}
                  <span
                    className="form-required"
                    title="This field is required."
                  >
                    *
                  </span>
                </label>
                <input
                  className="form-control"
                  type="text"
                  name="postal_code"
                  placeholder=""
                  onChange={handleChange}
                  value={data.postal_code}
                />
              </div>
            </div>

            <button className="btn btn-danger btn-md" onClick={handleClick}>
              Next
            </button>
          </form>
        </div>
      </div>
     
    </>
  );
};

export default PackageForm;
