import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../utils/api";
import { message } from "antd";

export const changePassword = createAsyncThunk(
  "user/change-password",
  async (data, thunkAPI) => {
    // Change password, must have temp password from email first
    let body = {
      name: data.email,
      temp_pass: data.temp_password,
      new_pass: data.password
    };
    await API.request("user/lost-password-reset", {
      body,
      queryParams: { _format: "json" },
    });
  }
)

export const signUpWithEmail = createAsyncThunk(
  "user/signup-with-email",
  async (data, thunkAPI) => {
    // === Step 1: create User account
    let body = {
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      phone: data.mobile_phone,
      password: data.password,
    };
    // === Step 1: Create user
    await API.request("api/v1/people", {
      body,
      queryParams: { _format: "json" },
    });

    // === Step 2: log in as the new user
    const credentials = { name: data.email, pass: data.password };
    const loginRes = await API.request("user/login", {
      queryParams: {
        _format: "json",
      },
      body: credentials,
    });
    // Store returned token
    API.X_CSRF_TOKEN = loginRes.csrf_token;
    // Store authorization token
    let authKey = "Basic " + window.btoa(data.email+":"+data.password);
    saveToLocalStorage("authToken", authKey);
    API.AUTHORIZATION = authKey;

    // Retrieve order-id, if exists, we know we need to ...
    const orderId = thunkAPI.getState().cart.orderId;
    if (orderId) {
      // === Step 3: PATCH user with order_id
      // (This step must follow login, b/c permission is required to perform it)
      body = {
        email: data.email,
        order_id: orderId,
      };
      // console.log('This is the order', orderId);
      // console.log('This is the body', body);

      await API.request("api/v1/people", {
        body,
        method: "PATCH",
        queryParams: { _format: "json" },
      });
    }

    thunkAPI.dispatch(requestUserDetails(loginRes.current_user.uid));

    return loginRes;
  }
);

export const loginWithEmail = createAsyncThunk(
  "user/login-with-email",
  async (credentials, thunkAPI) => {

    const res = await API.request("user/login", {
      queryParams: {
        _format: "json",
      },
      body: {
        name: credentials.email,
        pass: credentials.password,
      },
    });

    // Store the user credentials in storage to use for basic auth later
    let current_user = {
      name: credentials.email,
      pass: credentials.password,
    };
    window.localStorage.setItem('current_user', JSON.stringify(current_user));
    console.log(window.btoa(current_user.name+":"+credentials.password));
    if(res) {
      // Store fresh user data in local storage
      saveUserDataToStorage(res);
      console.log(res);
      // Store returned token
      API.X_CSRF_TOKEN = res.csrf_token;
      // Store authorization token
      let authKey = "Basic " + window.btoa(current_user.name+":"+credentials.password);
      console.log(authKey);
      saveToLocalStorage("authToken", authKey);
      console.log(current_user.name+":"+credentials.password, authKey);
      API.AUTHORIZATION = authKey;
      
      console.log(res.current_user.uid);
      thunkAPI.dispatch(requestUserDetails(res.current_user.uid));
    }

    return res;
  }
);

export const requestUserDetails = createAsyncThunk(
  "user/request-details",
  async (uid, thunkAPI) => {
    const res = await API.request(`/api/v1/getuser/${uid}`, {
      queryParams: { _format: "json" },
    });
    return normalizeUser(res);
  }
);

export const editUserDetails = createAsyncThunk(
  "user/edit-details",
  async (data, thunkAPI) => {
    console.log(data);
    let uid = data?.uid;
    let body = {
      method: "PUT",
      name: data.username,
      mail: data.mail,
      first_name: data.firstname,
      last_name: data.lastname,
      company: data.company,
      location: data.location,
      locid: data.locid,
      timezone: data.timezone,
    };
    const res = await API.request(`api/v1/users/${uid}`, {
      body,
      queryParams: { _format: "json" },
    });

    // Everytime we update user details, we update the API.Authorization
    // with correct data so we don't get 403 response from endpoint.
    let currentUserCreds = JSON.parse(window.localStorage.getItem('current_user'));
    let userPass = currentUserCreds.pass;

    // Store authorization token
    let authKey = "Basic " + window.btoa(data.username+":"+userPass);
    console.log(authKey);
    saveToLocalStorage("authToken", authKey);
    console.log('new auth -' + authKey);
    API.AUTHORIZATION = authKey;

    thunkAPI.dispatch(requestUserDetails(uid));
    return res;
  }
);

export const checkUserAuthStatus = createAsyncThunk(
  "user/check-user-auth-status",
  async (__, thunkAPI) => {
    // Check local storage for user data
    let data = retrieveUserDataFromLocalStorage();

    if (data) {
      let csrf_token = retrieveFromLocalStorage("__SBCA_token");
      API.X_CSRF_TOKEN = csrf_token;
      let authorization = retrieveFromLocalStorage("authToken");
      API.AUTHORIZATION = authorization;
      return data;
    } else {
      // Treat the user as unauthenticated and clear stored local data.
      clearUserData();
      return null;
    }
  }
);

export const forgotPassword = createAsyncThunk(
  "user/lost-password",
  async (data, thunkAPI) => {
    let body = {
      mail: data.email
    };
    const res = await API.request("user/lost-password", {
      body,
      queryParams: { _format: "json" },
    });
    return res;
  }
)

export const userLogout = createAsyncThunk(
  "user/logout",
  async (credentials, thunkAPI) => {
    message.info('Logging out.');
    let logout_token = retrieveFromLocalStorage('__SBCA_logout_token');
    const res = await API.request("user/logout", {
      queryParams: {
        _format: "json",
        token: logout_token
      }
    });
    return res;
  }
)

const emptyState = {
  isLoggedIn: false,
  token: null,
  changePass: false,
  data: {
    uid: null,
    email: "",
    username: "",
    roles: [],
    firstName: "",
    lastName: "",
    locId: null,
    subscriber_coid: null,
    location: null,
    company: null,
  },
};

export const { actions, reducer } = createSlice({
  name: "user",
  initialState: emptyState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(loginWithEmail.fulfilled, (state, action) => {
      console.log(
        "User logged in using email\nThe response looked like this:\n",
        action.payload
      );

      if(action.payload) {
        
        state.token = action.payload.csrf_token;
        saveToLocalStorage("__SBCA_token", state.token);
        // Store email, UID in localstorage
        saveToLocalStorage(
          "SBCA__user",
          JSON.stringify(action.payload.current_user)
        );

        // Logout token
        state.logout_token = action.payload.logout_token;
        saveToLocalStorage("__SBCA_logout_token", state.logout_token);

        state.isLoggedIn = true;
        state.data = { ...state.data, ...action.payload.current_user };
      }
    });

    builder.addCase(signUpWithEmail.fulfilled, (state, action) => {
      console.log(
        "User logged in using email\nThe response looked like this:\n",
        action.payload
      );
      state.token = action.payload.csrf_token;
      saveToLocalStorage("__SBCA_token", state.token);
      // Store email, UID in localstorage
      saveToLocalStorage(
        "SBCA__user",
        JSON.stringify(action.payload.current_user)
      );

      state.isLoggedIn = true;
    });

    builder.addCase(requestUserDetails.fulfilled, (state, action) => {
      console.log(action.payload);
      if(action.payload) {
        state.isLoggedIn = true;
        state.data = { ...state.data, ...action.payload };
      }
    });

    builder.addCase(editUserDetails.fulfilled, (state, action) => {
      if(action.payload.status === 1) {
        message.success('The changes have been saved.');
      }
    });

    builder.addCase(checkUserAuthStatus.fulfilled, (state, action) => {
      if(action.payload !== null) {
        state.isLoggedIn = true;
      }
      state.data = { ...state.data, ...action.payload };
    });

    builder.addCase(userLogout.fulfilled, (state, action) => {
      state.isLoggedIn = false;
      state.data = {};
      window.localStorage.clear();
    });

    builder.addCase(forgotPassword.fulfilled, (state, action) => {
      if(action.payload !== undefined && action.payload !== null) {
        state.isLoggedIn = true;
        state.changePass = true;
      }
      state.data = { ...state.data, ...action.payload };
    });

    builder.addMatcher(
      (action) => action.type.endsWith("pending"),
      (state, action) => {
        // console.log("inside user matcher thingy (user slice");
        state.loading = true;
      }
    );
    builder.addMatcher(
      (action) =>
        action.type.endsWith("rejected") || action.type.endsWith("fulfilled"),
      (state, action) => {
        state.loading = false;
      }
    );
  },
});

function saveToLocalStorage(key, value) {
  // console.log(`Saving key-value pair to local storage...\n\t${key} = ${value}`);

  window.localStorage.setItem(key, value);
}

function retrieveFromLocalStorage(key) {
  return window.localStorage.getItem(key);
}

function clearLocalStorageByKey(key) {
  saveToLocalStorage(key, "");
}

function saveUserDataToStorage(data) {
  const serialized = JSON.stringify(data);

  saveToLocalStorage("SBCA__user", serialized);
}

export function retrieveUserDataFromLocalStorage() {
  const res = retrieveFromLocalStorage("SBCA__user");

  if (!!res) {
    return JSON.parse(res);
  } else {
    return null;
  }
}

function clearUserData() {
  clearLocalStorageByKey("SBCA__user");
}

function timeSince(date) {
  var seconds = Math.floor((new Date() - date) / 1000);
  var interval = seconds / 31536000;

  if (interval > 1) {
    let plural = (Math.floor(interval) > 1) ? 's'  : '';
    return Math.floor(interval) + " year" + plural;
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    let plural = (Math.floor(interval) > 1) ? 's'  : '';
    return Math.floor(interval) + " month" + plural;
  }
  interval = seconds / 86400;
  if (interval > 1) {
    let plural = (Math.floor(interval) > 1) ? 's'  : '';
    return Math.floor(interval) + " day" + plural;
  }
  interval = seconds / 3600;
  if (interval > 1) {
    let plural = (Math.floor(interval) > 1) ? 's'  : '';
    return Math.floor(interval) + " hour" + plural;
  }
  interval = seconds / 60;
  if (interval > 1) {
    let plural = (Math.floor(interval) > 1) ? 's'  : '';
    return Math.floor(interval) + " minute" + plural;
  }
  return Math.floor(seconds) + " seconds";
}

function normalizeUser(user) {
  const returnObj = {};
  console.log(user);

  if(user) {
    returnObj.uid = user?.uid;
    returnObj.email = user?.mail;
    returnObj.name = user?.name;
    returnObj.roles = user?.roles;
    returnObj.firstName = (user?.field_first_name) ? user?.field_first_name[0].value : '';
    returnObj.lastName = (user?.field_last_name) ? user?.field_last_name[0].value : '';
    returnObj.status = (user?.status) ? user?.status : '';
    returnObj.locId = (user?.field_locid) ? user?.field_locid[0].value : '';
    returnObj.subscriber_coid = (user?.field_subscriber_coid) ? user?.field_subscriber_coid[0].value : '';
    returnObj.location = (user?.location_detail) ? user?.location_detail[0] : '';
    returnObj.company = (user?.company_detail) ? user?.company_detail[0] : '';
    returnObj.created = user?.created;
    returnObj.access = user?.access;
    returnObj.memberFor = timeSince(new Date(user?.created));
    returnObj.lastAccess = timeSince(new Date(user?.access));
    returnObj.timezone = user?.timezone;
  }

  saveUserDataToStorage(returnObj);
  return returnObj;
}
