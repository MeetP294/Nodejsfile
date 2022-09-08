import {
  createSlice,
  createAsyncThunk,
  createSelector,
} from "@reduxjs/toolkit";
import moment from "moment";
import { renderUSD, toTitleCase } from "../../utils";
import API from "../../utils/api";
// import {endpoints} from '../../utils/api/constants';

export const requestOrderDetails = createAsyncThunk(
  "order/request-order-details",
  async (orderId, thunkAPI) => {
    const order = await API.request("api/v1/taters-order", {
      queryParams: { order_id: orderId, _format: "json" },
    });

    return normalizeOrder(order);
  }
);
export const orderCheckout = createAsyncThunk(
  "order/checkout",
  async({body}, thunkAPI) => {
    // const resp = await API.request(endpoints.cartCheckout, {
    //   body
    // });
    // // console.log("orderCheckout: ", body);

    // thunkAPI.dispatch(requestOrderDetails(resp.order_id));
  }
)

const initialState = {
  id: null,
  cost: {},
  pickUpTime: null,
  group_id: null,
  items: [],
};

export const { actions, reducer } = createSlice({
  name: "order",
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(requestOrderDetails.fulfilled, (state, action) => {
      state.id = action.payload.order_id;
      Object.assign(state, action.payload);
    });
    builder.addCase(orderCheckout.rejected, (state, action) => {
      state.error = action.error;
    })

    builder.addMatcher(
      (action) => action.type.endsWith("pending"),
      (state, action) => {
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

export const getTotalItemQuantity = createSelector(
  [(state) => state.order.menu_items],
  (items) => {
    let total = 0;

    if (!items) return total;

    for (let item of items) {
      total += item.quantity;
    }

    return total;
  }
);

export const getSubTotal = createSelector(
  [
    (state) => state.order.total_paid,
    (state) => state.order.gratuity,
    (state) => state.order.tax,
  ],
  (totalPaid, gratuityAmount, taxAmt) => {
    return (
      totalPaid - gratuityAmount - taxAmt
    );
  }
);

export const getCostDetails = createSelector(
  [
    (state) => state.order.total_paid,
    (state) => state.order.tax_percent,
    (state) => state.order.gratuity_percent,
    (state) => state.order.tax,
    (state) => state.order.gratuity,
    getSubTotal,
  ],
  (total, taxPercentage, tipPercentage, taxAmount, tipAmount, subTotal) => {

    return {
      total: renderUSD(total),
      taxPercentage,
      tipPercentage,
      taxAmount: renderUSD(taxAmount),
      tipAmount: renderUSD(tipAmount),
      subtotal: renderUSD(subTotal),
    };
  }
);

export const getPickupTimeMoment = createSelector(
  [(state) => state.order.pickup_time],
  (time) => {
    if (time === undefined) {
      return time;
    }
    if (typeof time === "string") {
      return moment(time);
    } else {
      throw new Error(
        "order.pickup_time should always be a simplified ISO string. Instead it had typeof " +
          typeof time +
          "with value = " +
          time
      );
    }
  }
);

export const getOrderPlacedTimeMoment = createSelector(
  [(state) => state.order.completed],
  (time) => {
    if (time === undefined) {
      return time;
    }
    if (typeof time === "string") {
      return moment(time);
    } else {
      throw new Error(
        "order.pickup_time should always be a simplified ISO string. Instead it had typeof " +
          typeof time +
          "with value = " +
          time
      );
    }
  }
);

function normalizeOrder(order) {
  const returnObj = Object.assign({}, order);

  returnObj.id = order.order_id;
  returnObj.subtotal = Number(order.order_subtotal.slice(1));
  returnObj.items = normalizeItems(order.menu_items);
  returnObj.gratuity = order.gratuity;

  return returnObj;
}

function normalizeItems(items) {
  return items.map((item) => {
    return {
      ...item,
      instructions: item.special_instructions,
      quantity: Number(item.quantity),
      price: Number(item.price.slice(1)),
      title: toTitleCase(item.title),
    };
  });
}
