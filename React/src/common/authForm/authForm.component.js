import React from "react";
import "./authForm.less";
import { useDispatch, connect } from "react-redux";
import { Input, Button, Form } from "antd";
import PhoneInput from "../../components/PhoneInput";
import { message } from "antd";
import { toTitleCase, createDummyPassword } from "../../utils";
import { loginWithEmail, signUpWithEmail, forgotPassword, changePassword } from "../../store/slices/user";

// @TODO: Add social logins
// import FacebookButton from "../FacebookButton";

const mapModeToTitleText = (mode) => {
  switch (mode) {
    case "LOG_IN":
      return "Log In";
    case "GUEST":
      return "Guest Checkout";
    case "FORGOT":
      return "Reset Your Password";
    case "CHANGE_PASSWORD":
      return "Change Your Password";
    default:
      return "Sign Up";
  }
};

const mapModeToActionButtonText = (mode) => {
  switch (mode) {
    case "LOG_IN":
      return "Log In";
    case "INIT":
      return "Sign Up With Email";
    case "EMAIL_SIGN_UP":
      return "Sign Up";
    case "GUEST":
      return "Continue to Checkout";
    case "FORGOT":
      return "E-mail new password";
    case "CHANGE_PASSWORD":
      return "Next";
    default:
      return "Sign Up";
  }
};

const MyForm = ({ fields, onSubmit, ...props }) => {
  /* fields = [
    {
      name,
      (inputElement)
      ...ant form item props
    }
  ]
  */
  return (
    <Form
      // validateMessages={{ required: "${name} is required." }}
      onFinish={onSubmit}
    >
      {fields.map(({ name, inputProps, InputComponent, ...props }) => (
        <>
          <label>{toTitleCase(name)}</label>
          <Form.Item name={name} {...props}>
            {InputComponent ? <InputComponent /> : <Input {...inputProps} />}
          </Form.Item>
        </>
      ))}
      <Form.Item>
        <Button
          loading={props.loading}
          type="primary"
          htmlType="submit"
          className="MyForm__btn"
        >
          {props.submitBtnText}
        </Button>
      </Form.Item>
    </Form>
  );
};

const AuthForm = (props) => {
  const dispatch = useDispatch();
  const [mode, setMode] = React.useState(props.initMode || "LOG_IN");

  const { onSuccess, user } = props;

  React.useEffect(() => {
    // Once user is logged in, perform onSuccess callback and
    if (user.isLoggedIn) {
      onSuccess();
    }
  }, [onSuccess, user.isLoggedIn]);

  const createGuestUser = (data) => {
    // Attach a fake password and pass along to sign up function
    data.password = createDummyPassword();
    // console.log("Creating a guest user with this password ", data.password);
    props.signUpWithEmail(data);
  };

  const sendNewPassword = (data) => {
    // Send new password
    dispatch(
      forgotPassword(data)
    ).then((res) => {
      console.log(res);
      if(res.payload !== undefined) {
        message.success(res.payload.message);
        // Only change the mode when successful.
        setMode("CHANGE_PASSWORD");
      }
    });
  }

  const doneNewPassword = (data) => {
    // Send new password
    dispatch(
      changePassword(data)
    ).then((res) => {
      console.log(res);
      if(res.payload !== undefined) {
        message.success(res.payload.message);
        // Change form state to login after successful reset password.
        setMode("LOG_IN");
      }
    });
  }

  const passwordField = {
      name: "password",
      rules: [{ required: true }],
      inputProps: {
        type: "password",
      },
    },
    tempPasswordField = {
      name: "temp_password",
      rules: [{ required: true }],
      inputProps: {
        type: "password",
      },
    },
    emailField = {
      name: "email",
      rules: [{ required: true }],
    },
    nameFields = ["first_name", "last_name"].map((name) => ({
      name,
      rules: [{ required: true }],
    })),
    phoneField = {
      name: "mobile_phone",
      InputComponent: PhoneInput,
      rules: [{ required: true }],
    };

  const formProps = {
    loading: user.loading || false,
  };
  if (mode === "LOG_IN") {
    formProps.fields = [emailField, passwordField];
    formProps.onSubmit = props.loginWithEmail;
  } else if (mode === "EMAIL_SIGN_UP") {
    formProps.fields = [...nameFields, phoneField, emailField, passwordField];
    formProps.onSubmit = props.signUpWithEmail;
  } else if (mode === "GUEST") {
    formProps.fields = [...nameFields, phoneField, emailField];
    formProps.onSubmit = createGuestUser;
  } else if (mode === "FORGOT") {
    formProps.fields = [emailField];
    formProps.onSubmit = sendNewPassword;
  } else if (mode === "CHANGE_PASSWORD") {
    formProps.fields = [emailField, tempPasswordField, passwordField];
    formProps.onSubmit = doneNewPassword;
  }
  formProps.submitBtnText = mapModeToActionButtonText(mode);
  const wrapHandler = (handler) => async (data) => {
    await handler(data);
    // props.onSuccess();
  };
  formProps.onSubmit = wrapHandler(formProps.onSubmit);

  return (
    <div className="AuthForm">
      <h3 className="AuthForm__title">{mapModeToTitleText(mode)}</h3>
      {mode === "FORGOT" && (
        <p>To reset your password, enter your email.</p>
      )}
      {mode === "CHANGE_PASSWORD" && (
        <p>Check your email for your temporary password.</p>
      )}
      <MyForm {...formProps} />

      <div className="AuthForm__footer">
        {mode !== "LOG_IN" && (
          <span>
            Already have an account?{" "}
            <span
              style={{ cursor: "pointer" }}
              onClick={() => {
                setMode("LOG_IN");
              }}
              className="brand-color"
            >
              Log In
              <br />
            </span>
          </span>
        )}
        {mode !== "FORGOT" && (
          <span
            style={{ marginTop: 5, cursor: "pointer" }}
            onClick={() => {
              setMode("FORGOT");
            }}
            className="AuthForm__guest"
          >
            Need or Forgot Your Password?
            <br />
          </span>
        )}
      </div>
    </div>
  );
};

export default connect(
  (state) => ({ user: state.user }),
  (dispatch) => ({
    signUpWithEmail: (userData) => dispatch(signUpWithEmail(userData)),
    loginWithEmail: (credentials) => dispatch(loginWithEmail(credentials)),
  })
)(AuthForm);
