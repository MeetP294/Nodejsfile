import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../utils/api";

// Get all document collection
export const getDocuCollections = createAsyncThunk(
  "package/get-docu-collections",
  async (__, thunkAPI) => {
    const res = await API.request(`api/v1/collection`, {
      queryParams: { _format: "json" },
    });
    return res;
  }
);

// Get single document collection
export const getDocuCollection = createAsyncThunk(
  "package/get-docu-collection",
  async (nid, thunkAPI) => {
    let url = `api/v1/collection/${nid}`;
    if(typeof nid === 'string') {
      url = `api/v1/collection/alias?alias="/content/${nid}"`;
    }
    const res = await API.request(url, {
      queryParams: { _format: "json" },
    });
    console.log(res);
    return res;
  }
);

// Send document collection to user by email through this form.
export const sendCollectionByEmail = createAsyncThunk(
  "package/get-docu-collection",
  async (data, thunkAPI) => {
    const res = await API.request(`api/v1/printmail`, {
      queryParams: { _format: "json" },
      body: data
    });
    return res;
  }
);

// Get all documents
export const getDocuments = createAsyncThunk(
  "package/get-documents",
  async (__, thunkAPI) => {
    const res = await API.request(`api/v1/document`, {
      queryParams: { _format: "json" },
    });
    return res;
  }
);

// Get single document
export const getDocument = createAsyncThunk(
  "package/get-document",
  async (nid, thunkAPI) => {
    const res = await API.request(`api/v1/document/${nid}`, {
      queryParams: { _format: "json" },
    }); 
    return res;
  }
);

// Get single document
export const getDocumentsByCatalog = createAsyncThunk(
  "package/get-document-by-catalog",
  async (nid, thunkAPI) => {
    const res = await API.request(`api/v1/DocumentByCatalog/${nid}`, {
      queryParams: { _format: "json" },
    }); 
    return res;
  }
);

const emptyState = {
  data: {
    documents: [],
    single_document: {},
    docu_collections: [],
    docu_collection: {},
    catalog_docs: []
  },
};

export const { actions, reducer } = createSlice({
  name: "documents",
  initialState: emptyState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getDocuCollections.fulfilled, (state, action) => {
      state.data.docu_collections.push(action.payload)
    });

    builder.addCase(getDocuCollection.fulfilled, (state, action) => {
      Object.assign(state.data.docu_collection, action.payload[0]);
    });

    builder.addCase(getDocuments.fulfilled, (state, action) => {
      state.data.documents = action.payload;
    });

    builder.addCase(getDocument.fulfilled, (state, action) => {
      console.log(action.payload);
      Object.assign(state.data.single_document, action.payload[0]);
    });

    builder.addCase(getDocumentsByCatalog.fulfilled, (state, action) => {
      console.log(action.payload);
      state.data.catalog_docs = action.payload;
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