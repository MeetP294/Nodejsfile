// Import all reducers in this file and export as
// single root reducer

import { reducer as sitewideReducer } from "./sitewide";
import { reducer as userReducer } from "./user";
import { reducer as packageReducer } from "./packages";
import { reducer as documentReducer } from "./documents";
import { reducer as cartReducer } from "./cart";


export const rootReducer = {
  sitewide: sitewideReducer,
  user: userReducer,
  packages: packageReducer,
  documents: documentReducer,
  cart: cartReducer,
};




