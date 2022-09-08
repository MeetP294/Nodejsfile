import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../utils/api";

// Get all packages
export const getPackages = createAsyncThunk(
  "package/get-all",
  async (__, thunkAPI) => {
    const res = await API.request(`api/v1/package`, {
      queryParams: { _format: "json" },
    });
    return res;
  }
);

// Get single package details
export const getSinglePackage = createAsyncThunk(
  "package/get-single",
  async (nid, thunkAPI) => {
    // Change password, must have temp password from email first
    const res = await API.request(`api/v1/package/${nid}`, {
      queryParams: { _format: "json" },
    });
    return res;
  }
);

// Get packages of current user
export const getMy-Packages = createAsyncThunk(
  "package/my-packages",
  async (uid, thunkAPI) => {
    // Change password, must have temp password from email first
    const res = await API.request(`api/v1/my-packages/${uid}`);
    return res;
  }
);

// Get all subscribers
export const getSubscribers = createAsyncThunk(
  "/subscribers",
  async (__, thunkAPI) => {
    const res = await API.request(`api/v1/subscriber`, {
      queryParams: { _format: "json" },
    });
    return res;
  }
);

// Get subscriber of current user
export const getSubscriber = createAsyncThunk(
  "/subscriber",
  async (nid, thunkAPI) => {
    const res = await API.request(`api/v1/subscriber/${nid}`, {
      queryParams: { _format: "json" },
    });
    return res;
  }
);

// Get all locations
export const getLocations = createAsyncThunk(
  "/locations",
  async (__, thunkAPI) => {
    const res = await API.request(`api/v1/location`, {
      queryParams: { _format: "json" },
    });
    return res;
  }
);

// Get single locations
export const getLocation = createAsyncThunk(
  "/get-locations",
  async (nid, thunkAPI) => {
    const res = await API.request(`api/v1/location/${nid}`, {
      queryParams: { _format: "json" },
    });
    return res;
  }
);

const emptyState = {
  data: {
    all_packages: [],
    current_package: {},
    my_packages: [],
    subscribers: [],
    subscriber:{},
    locations: [],
    location: {}
  },
};

export const { actions, reducer } = createSlice({
  name: "packages",
  initialState: emptyState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getPackages.fulfilled, (state, action) => {
      state.data = { ...state.data, ...action.payload };
    });

    builder.addCase(getSinglePackage.fulfilled, (state, action) => {
      if(action.payload) {
        Object.assign(state.data.current_package, action.payload[0]);
      }
    });

    builder.addCase(getMy-Packages.fulfilled, (state, action) => {
      Object.assign(state.data.my_packages, action.payload); 
    });

    builder.addCase(getSubscribers.fulfilled, (state, action) => {
      Object.assign(state.data.subscribers, action.payload);
    });

    builder.addCase(getSubscriber.fulfilled, (state, action) => {
      if(action.payload) {
        Object.assign(state.data.subscriber, action.payload[0]); 
      }
    });

    builder.addCase(getLocations.fulfilled, (state, action) => {
      Object.assign(state.data.locations, action.payload);
    });

    builder.addCase(getLocation.fulfilled, (state, action) => {
      if(action.payload) {
        Object.assign(state.data.location, action.payload[0]);
      }
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