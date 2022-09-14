import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import SelectState from "../../common/SelectState";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import { message } from "antd";
import classNames from "classnames";
import "./default.template.less";
import { getDocuCollections } from "../../store/slices/documents";
const PackageForm = (props) => {
  const userData = props?.location?.state;
  const dispatch = useDispatch();
  const history = useHistory();
  const [checked, SetChecked] = useState();
  const [error, SetError] = useState({});
  const [data, SetData] = useState({
    field_job_number: "",
    field_expDate: moment().format('YYYY-MM-DD'),
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
    console.log(validation());
    if (validation()) {
      history.push({ pathname: "/preview", state: data });
    }
  };
  const validation = () => {
    var err = {};
    if (data.field_job_number === "") {
      err["field_job_number"] = "This field is required";
    }
    if (data.field_documents === "") {
      err["field_documents"] = "This field is required";
    }
    if (data.address_line1 === "") {
      err["address_line1"] = "This field is required";
    }
    if (data.locality === "") {
      err["locality"] = "This field is required";
    }
    if (data.field_expDate === "") {
      err["field_expDate"] = "This field is required";
    }
    if (data.administrative_area === "") {
      err["administrative_area"] = "This field is required";
    }
    if (data.state === "") {
      err["state"] = "This field is required";
    }
    if (data.postal_code === "") {
      err["postal_code"] = "This field is required";
    }
    SetError({ ...err });
    return Object.values(err).length < 1 && true;
  };

  return (
    <>
      <div className="FormContainer">
        <h1 className="page-header no-mrgn-top">Create Jobsite Package</h1>
        <h3 className="legend-title">Package Information</h3>
        <form>
          <div
            className={classNames(
              "form-item",
              error.field_job_number !== "" && error.field_job_number && "error"
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
              defaultValue={data?.field_job_number}
              onChange={handleChange}
            />
            <span>Please enter a unique job number for this package</span>
            { error.field_job_number !== "" &&
              <span className="error error-msg">{error.field_job_number}</span>
            }
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
              defaultValue={data?.field_expDate}
              onChange={handleChange}
            />
            <span className="help-block">Please enter the date that this package should expire</span>
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
            { error.field_documents !== "" &&
              <span className="error error-msg">{error.field_documents}</span>
            }
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
              defaultValue={data?.field_customer_name}
              onChange={handleChange}
            />
            <span>
              The name of the customer or client that this package is being
              generated for.
            </span>
            { error.field_customer_name !== "" &&
              <span className="error error-msg">{error.field_customer_name}</span>
            }
          </div>

          <div className="form-group">
            <h3 className="legend-title mt30">Jobsite Address</h3>
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
                defaultValue={data?.address_line1}
                onChange={handleChange}
              />
              { error.address_line1 !== "" &&
                <span className="error error-msg">{error.address_line1}</span>
              }
            </div>
            <div className="form-item">
              <label>Address 2</label>
              <input
                className="form-control"
                type="text"
                name="address_line2"
                placeholder=""
                defaultValue={data?.address_line2}
                onChange={handleChange}
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
                defaultValue={data?.locality}
                onChange={handleChange}
              />
              { error.locality !== "" &&
                <span className="error error-msg">{error.locality}</span>
              }
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
              { error.state !== "" &&
                <span className="error error-msg">{error.state}</span>
              }
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
                defaultValue={data?.postal_code}
                onChange={handleChange}
              />
              { error.postal_code !== "" &&
                <span className="error error-msg">{error.postal_code}</span>
              }
            </div>
          </div>

          <button className="btn btn-danger btn-md" onClick={handleClick}>
            Next
          </button>
        </form>
      </div>
    </>
  );
};

export default PackageForm;
