import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router";
// import SelectState from "../../common/SelectState";
import Select from "../../components/Select";
import { editUserDetails } from "../../store/slices/user";
import { getSubscribers, getLocations } from "../../store/slices/packages";
import classNames from "classnames";
import "./user.template.less";

const UserForm = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  // const [checked, SetChecked] = useState();
  // const [checked1, SetChecked1] = useState();
  const [subscribers, SetSubscribers] = useState();
  const [locations, SetLocations] = useState();
  const [error, SetError] = useState({});
  // const [auth, SetAuth] = useState({});
  const userData = useSelector((state) => state?.user?.data);
  const [data, SetData] = useState({
    uid: "",
    username: "",
    mail: "",
    password: "",
    confirmPassword: "",
    firstname: "",
    lastname: "",
    company: "",
    location: "",
    coid: "",
    locid: "",
    timezone: "",
  });

  useEffect(() => {
    // Set default value to data
    SetData({
      uid: userData?.uid,
      username: userData?.name,
      mail: userData?.email,
      firstname: userData?.firstName,
      lastname: userData?.lastName,
      coid: userData?.subscriber_coid,
      locid: userData?.locId,
      company: userData?.company,
      location: userData?.location,
      timezone: userData?.timezone,
    });

    // Get subscribers for Company field dropdown
    dispatch(getSubscribers()).then((data) => {
      SetSubscribers({ ...data.payload });
    });

    // Get location field
    dispatch(getLocations()).then((data) => {
      SetLocations({ ...data.payload });
    });
  }, [userData,dispatch]);

  const validation = () => {
    var err = {};
    var required_fields = ["username", "mail", "firstname", "lastname"];

    required_fields.map(function (field) {
      if (data[field] === "") {
        err[field] = "This field is required";
      }
    });

    if (data.password !== data.confirmPassword) {
      err["match"] = "Password doesn't match!";
    }
    SetError({ ...err });
    return Object.values(err).length < 1 && true;
  };

  const handleClick = (e) => {
    e.preventDefault();
    validation();
    if (data !== "" && validation()) {

      // Submit form details to backend.
      dispatch(editUserDetails(data)).then((data) => {
        if (data.payload) {
          history.push("/user");
        }
      });
    }
  };

  // const handleCheck = (event) => {
  //   SetChecked(event.target.value);
  //   SetChecked1(event.target.value);
  //   SetData({ ...data, [event.target.name]: event.target.value });
  // };

  const handleChange = (event) => {
    SetData({ ...data, [event.target.name]: event.target.value });
  };

  return (
    <>
     
        <h1>{userData?.name}</h1>
        <ul className="nav-tabs">
          <li>
            <a href="/user">View</a>
          </li>
          <li className="active">
            <a href="/user/edit">Edit</a>
          </li>
        </ul>
        <form>
          <div
            className={classNames(
              "form-item",
              error.username !== "" && error.username && "error"
            )}
          >
            <label>
              User Name
              <span className="form-required" title="This field is required.">
                *
              </span>
            </label>
            <input
              className="form-control"
              onChange={handleChange}
              name="username"
              value={data?.username ? data?.username : ""}
            />
            <div className="description">
              Spaces are allowed; punctuation is not allowed except for periods,
              hyphens, apostrophes, and underscores.
            </div>
          </div>

          <div
            className={classNames(
              "form-item",
              error.mail !== "" && error.mail && "error"
            )}
          >
            <label>
              E-mail Address
              <span className="form-required" title="This field is required.">
                *
              </span>
            </label>
            <input
              className="form-control"
              onChange={handleChange}
              name="mail"
              value={data?.mail ? data?.mail : ""}
            />
            <div className="description">
              A valid e-mail address. All e-mails from the system will be sent
              to this address. The e-mail address is not made public and will
              only be used if you wish to receive a new password or wish to
              receive certain news or notifications by e-mail.
            </div>
          </div>
          <div className="password--wrapper">
            <div
              className={classNames(
                "form-item",
                error.match !== "" && error.match && "error"
              )}
            >
              <label>Password</label>
              <input
                className="form-control"
                onChange={handleChange}
                name="password"
                type="password"
              />
            </div>
            <div
              className={classNames(
                "form-item",
                error.match !== "" && error.match && "error"
              )}
            >
              <label>Confirm password</label>
              <input
                className="form-control"
                onChange={handleChange}
                name="confirmPassword"
                type="password"
              />
            </div>
            <div className="description">
              To change the current user password, enter the new password in
              both fields.
            </div>
            {error.match !== "" && <span className="red">{error.match}</span>}
          </div>

          <br /><br />
          <div
            className={classNames(
              "form-item",
              error.firstname !== "" && error.firstname && "error"
            )}
          >
            <label>
              First Name
              <span className="form-required" title="This field is required.">
                *
              </span>
            </label>
            <input
              className="form-control"
              onChange={handleChange}
              name="firstname"
              value={data?.firstname ? data?.firstname : ""}
            />
          </div>
          <div
            className={classNames(
              "form-item",
              error.lastname !== "" && error.lastname && "error"
            )}
          >
            <label>
              Last Name
              <span className="form-required" title="This field is required.">
                *
              </span>
            </label>
            <input
              className="form-control"
              onChange={handleChange}
              name="lastname"
              value={data?.lastname ? data?.lastname : ""}
            />
          </div>
          <div
            className={classNames(
              "form-item",
              error.company !== "" && error.company && "error"
            )}
          >
            <label>
              Company
              <span className="form-required" title="This field is required.">
                *
              </span>
            </label>
            {subscribers && (
              <Select
                method={SetData}
                options={subscribers}
                default_value={data?.company?.nid}
                field_name="company"
                data={data}
              />
            )}
          </div>
          <div
            className={classNames(
              "form-item",
              error.location !== "" && error.location && "error"
            )}
          >
            <label>
              Location
              <span className="form-required" title="This field is required.">
                *
              </span>
            </label>
            {locations && (
              <Select
                method={SetData}
                options={locations}
                default_value={data?.location?.nid}
                field_name="location"
                data={data}
              />
            )}
          </div>
          <div className={classNames("form-item")}>
            <label>LOCID</label>
            <input
              className="form-control"
              onChange={handleChange}
              name="locid"
              value={data?.locid ? data?.locid : ""}
            />
          </div>
          <div className="description fel-field-help-text">
            Location ID from Main.{" "}
            <strong>This field will be removed Q3/2021.</strong>
          </div>
        </form>
        <button className="btn btn-success btn-md" onClick={handleClick}>
          Save
        </button>
      
    </>
  );
};

export default UserForm;
