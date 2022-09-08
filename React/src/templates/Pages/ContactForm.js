import React, { useEffect, useState } from "react";
import { message } from "antd";
import classNames from "classnames";
import { useDispatch } from "react-redux";
import { addContact } from "../../store/slices/packages";

const ContactForm = () => {
  const dispatch = useDispatch();
  const [error, SetError] = useState({});
  const [data, SetData] = useState({
    email: [{ value: "" }],
    firstname: [{ value: "" }],
    lastname: [{ value: "" }],
    comments: [{ value: "" }],
  });

  useEffect(() => {
    dispatch(addContact({ val: data }));
  }, [data,dispatch]);
  const validation = () => {
    var err = {};
    if (data.email?.[0].value === "") {
      err["email"] = "this field is required";
    }
    if (data.firstname?.[0].value === "") {
      err["firstname"] = "this field is required";
    }
    if (data.lastname?.[0].value === "") {
      err["lastname"] = "this field is required";
    }
    SetError({ ...err });
    return Object.values(err).length < 1 && true;
  };

  const handleClick = (e) => {
    e.preventDefault();
    if (validation()) {
      dispatch(
        addContact({ body: { val: data } })
      ).then((data) => {
        if (data.payload) {
          message.success('The changes have been saved.');
        } else {
          message.error('There was an error saving data. Please contact site administrator.');
        }
      });
    }
  };
  const handleChange = (event) => {
    SetData({ ...data, [event.target.name]: [{ value: event.target.value }] });
  };

  return (
    <>
     
        <h1>Contact</h1>
        <form className="form-group">
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
            />
          </div>
          <div
            className={classNames(
              "form-item",
              error.email !== "" && error.email && "error"
            )}
          >
            <label>
              Email Address
              <span className="form-required" title="This field is required.">
                *
              </span>
            </label>
            <input
              className="form-control"
              onChange={handleChange}
              name="email"
            />
          </div>
          <label>
            Comment
            <span
              className="form-required"
              title="This field is required."
            ></span>
          </label>
          <input
            type="text"
            className="form-control"
            onChange={handleChange}
            name="comments"
          />
        </form>
        <button className="btn btn-danger btn-md" onClick={handleClick}>
          Submit
        </button>
     
    </>
  );
};

export default ContactForm;
