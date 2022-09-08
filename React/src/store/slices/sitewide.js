import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { siteBanner } from "../../utils/api/constants";
import SiteLogo from "../../assets/images/logos/sbca-docs-logo-new.png";
import API from "../../utils/api";

export const globalSettings = createAsyncThunk(
  "site/info",
  async (__, thunkAPI) => {
    const res = await API.request(`api/v1/site-info?_format=json`);
    return res;
  }
);

// Get basic page content
export const getPage = createAsyncThunk(
  "page/get-content",
  async (page, thunkAPI) => {
    // If we have already loaded this page and stored in the state,
    // we will just collect it there to load faster.
    if (thunkAPI.getState().sitewide.data.node[`${page}`]) {
      let storedPageContent = thunkAPI.getState().sitewide.data.node[`${page}`];
      if (storedPageContent) {
        return storedPageContent;
      }
    } else {
      let nid = 393332;
      switch (page) {
        case 'pricing':
          nid = 393331;
          break;
        case 'about':
          nid = 393333;
          break;
        case 'how-to':
          nid = 393334;
          break;
        case 'help':
          nid = 393335;
          break;
        default:
          nid = 393332;
          break;
      }

      // Change password, must have temp password from email first
      const res = await API.request(`node/${nid}`, {
        queryParams: { _format: "json" },
      });
      return res;
    }
  }
);

// Get node content
export const getContent = createAsyncThunk(
  "page/get-node-content",
  async (nid, thunkAPI) => {
    const res = await API.request(`node/${nid}`, {
      queryParams: { _format: "json" },
    });
    return res;
  }
);

const emptyState = {
  data: {
    banner: SiteLogo,
    title: "SBCA Docs",
    copyright_text: "",
    node: {},
    content: {}
  },
};

export const { actions, reducer } = createSlice({
  name: "sitewide",
  initialState: emptyState,
  reducers: {},
  extraReducers: (builder) => {
    // builder.addCase(globalSettings.fulfilled, (state, action) => {
    //   state.data = { ...state.data, ...action.payload };
    //   state.data.banner = pantheonSiteURL + "/sites/default/files/sbca-docs-logo-new.png";
    // });

    builder.addCase(getPage.fulfilled, (state, action) => {
      let obj = {};
      let current_page = window.localStorage.getItem('current_page');
      console.log(current_page, action.payload);
      obj[current_page] = action.payload;
      Object.assign(state.data.node, obj);
    });

    builder.addCase(getContent.fulfilled, (state, action) => {
      state.isLoggedIn = true;
      Object.assign(state.data.content, action.payload);
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
