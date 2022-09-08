import {
  createSlice,
  createAsyncThunk,
  createSelector,
} from "@reduxjs/toolkit";
import moment from "moment";
import API from "../../utils/api";
import { ASAP_PICKUP_TIME_OFFSET_MINUTES } from "../../constants";
import { toTitleCase, renderUSD } from "../../utils";
import isEqual from "lodash.isequal";

export const refreshCart = createAsyncThunk(
  "cart/refresh-cart",
  async (item, thunkAPI) => {
    const res = await API.request("api/v1/cart", {
      queryParams: { _format: "json" },
    });

    return normalizeCart(res);
  }
);

export const editItemInCart = createAsyncThunk(
  "cart/edit-item",
  async ({ orderItemId, update }, thunkAPI) => {
    // Look up the item in cart slice using its id
    const { cart, venue } = thunkAPI.getState();
    const cartItem = cart.items.find(
      (item) => item.orderItemId === orderItemId
    );
    let timeStartISO;
    if (cart.pickUpTime === null){
      timeStartISO = moment.unix(moment().unix() + ASAP_PICKUP_TIME_OFFSET_MINUTES * 60);
    } else {
      timeStartISO = moment.unix(cart.pickUpTime);
    }
    // end time is start + 15 minutes
    let timeEndISO;
    if (cart.pickUpTime === null){
      timeEndISO = moment.unix(moment().unix() + 60 * 60).toISOString();
    } else {
      timeEndISO = moment.unix(cart.pickUpTime + 15 * 60).toISOString();
    }
    timeStartISO.toISOString();
    const menuItemField = {
      variation_id: update.variationId || cartItem.variationId,
      quantity: update.quantity || cartItem.quantity,
    };

    if (cartItem.instructions || update.instructions) {
      menuItemField.instructions = update.instructions || cartItem.instructions;
    }

    // If update.modifiers contains changes
    if (!isEqual(cartItem.modifiers, update.modifiers)) {
      let counter = 0;
      menuItemField.modifier = {};
      Object.entries(update.modifiers).forEach(([id, isSelected]) => {
        if (isSelected) {
          menuItemField.modifier[counter++] = {
            id,
          };
        }
      });
    }

    const reqBody = {
      group_id: venue.data.id,
      order_id: cart.orderId,
      start_date: timeStartISO,
      end_date: timeEndISO,
      menu_items: {
        0: menuItemField,
      },
      gratuity: cart.gratuity,
    };

    const res = await API.request("api/v1/cart/add?_format=json", {
      method: "POST",
      body: reqBody,
    });

    // Refresh the cart so that it reflects the new addition
    thunkAPI.dispatch(refreshCart());

    return res;
  }
);

export const addItemToCart = createAsyncThunk(
  "cart/add-item",
  async (item, thunkAPI) => {
    const { venue, cart } = thunkAPI.getState();
    let timeStartISO;
    if (cart.pickUpTime === null){
      timeStartISO = moment.unix(moment().unix() + ASAP_PICKUP_TIME_OFFSET_MINUTES * 60);
    } else {
      timeStartISO = moment.unix(cart.pickUpTime);
    }
    // end time is start + 15 minutes
    let timeEndISO;
    if (cart.pickUpTime === null){
      timeEndISO = moment.unix(moment().unix() + 60 * 60).toISOString();
    } else {
      timeEndISO = moment.unix(cart.pickUpTime + 15 * 60).toISOString();
    }
    timeStartISO.toISOString();
    const menuItemField = {
      variation_id: item.variationId,
      quantity: item.quantity,
      instructions: item.instructions,
    };

    if (Object.values(item.modifiers).some(Boolean)) {
      let counter = 0;
      menuItemField.modifier = {};
      Object.entries(item.modifiers).forEach(([id, modifierIsSelected]) => {
        if (modifierIsSelected) {
          menuItemField.modifier[counter++] = {
            id,
          };
        }
      });
    }

    const reqBody = {
      group_id: venue.data.id,
      start_date: timeStartISO,
      end_date: timeEndISO,
      menu_items: { 0: menuItemField },
      gratuity: cart.gratuity,
    };

    if (cart.orderId) {
      reqBody.order_id = cart.orderId;
    }

    const res = await API.request("api/v1/cart/add?_format=json", {
      method: "POST",
      body: reqBody,
    });

    // Refresh the cart so that it reflects the new addition
    thunkAPI.dispatch(refreshCart());

    return res;
  }
);

export const removeItemFromCart = createAsyncThunk(
  "cart/remove-item",
  async (orderItemId, thunkAPI) => {
    const { cart } = thunkAPI.getState();

    await API.request("api/v1/cart/delete?_format=json", {
      method: "POST",
      body: {
        order_id: cart.orderId,
        ItemId: orderItemId,
      },
    });

    // Refresh the cart so that it reflects the new addition
    thunkAPI.dispatch(refreshCart());

    // return res;
    // console.log("cart/remove-item");
    // console.log("orderItemId = ", orderItemId);
  }
);

export const setTableDescription = createAsyncThunk(
  "cart/set-table-description",
  async (tableDescription, thunkAPI) => {
    const { cart, venue } = thunkAPI.getState();
    let timeStartISO;
    if (cart.pickUpTime === null){
      timeStartISO = moment.unix(moment().unix() + ASAP_PICKUP_TIME_OFFSET_MINUTES * 60);
    } else {
      timeStartISO = moment.unix(cart.pickUpTime);
    }
    // end time is start + 15 minutes
    let timeEndISO;
    if (cart.pickUpTime === null){
      timeEndISO = moment.unix(moment().unix() + 60 * 60).toISOString();
    } else {
      timeEndISO = moment.unix(cart.pickUpTime + 15 * 60).toISOString();
    }
    timeStartISO.toISOString();
    const reqBody = {
      order_id: cart.orderId,
      group_id: venue.data.id,
      start_date: timeStartISO,
      end_date: timeEndISO,
      qr_order_title: tableDescription,
    };
    await API.request("api/v1/cart/add", {
      body: reqBody,
    });
    thunkAPI.dispatch(refreshCart());
  }
)


export const setGratuity = createAsyncThunk(
  "cart/set-gratuity",
  async (percent, thunkAPI) => {
    const { cart, venue } = thunkAPI.getState();
    let timeStartISO;
    if (cart.pickUpTime === null){
      timeStartISO = moment.unix(moment().unix() + ASAP_PICKUP_TIME_OFFSET_MINUTES * 60);
    } else {
      timeStartISO = moment.unix(cart.pickUpTime);
    }
    // end time is start + 15 minutes
    let timeEndISO;
    if (cart.pickUpTime === null){
      timeEndISO = moment.unix(moment().unix() + 60 * 60).toISOString();
    } else {
      timeEndISO = moment.unix(cart.pickUpTime + 15 * 60).toISOString();
    }
    timeStartISO.toISOString();
    const reqBody = {
      gratuity: percent,
      start_date: timeStartISO,
      end_date: timeEndISO,
      group_id: venue.data.id,
    };

    if (cart.orderId) {
      reqBody.order_id = cart.orderId;
    }

    await API.request("api/v1/cart/add", {
      body: reqBody,
    });

    thunkAPI.dispatch(refreshCart());
  }
);

export const setPickUpTime = createAsyncThunk(
  "cart/set-pickup-time",
  async (pickUpRangeStart, thunkAPI) => {
    if (pickUpRangeStart === "ASAP") {
      pickUpRangeStart = moment().unix() + ASAP_PICKUP_TIME_OFFSET_MINUTES * 60;
    }

    return pickUpRangeStart;

    // @TODO: once api supports setting pick up time of order
    // as first step, this code will be needed

    // const {
    //   cart: { orderId },
    // } = thunkAPI.getState();

    // if (pickUpRangeStart === "ASAP") {
    //   pickUpRangeStart = moment().unix();
    // } else {
    //   // If not ASAP, pickUpRangeStart is a unix timestamp
    //   pickUpRangeStart = moment.unix(pickUpRangeStart);
    // }

    // // Add 30 minutes to calculate end time
    // const pickUpRangeEnd = addMinutes(pickUpRangeStart, 30);

    // const reqBody = {
    //   start_date: pickUpRangeStart.format("YYYY-MM-DD HH:mm:ss"),
    //   end_date: pickUpRangeEnd.format("YYYY-MM-DD HH:mm:ss"),
    // };

    // if (orderId) {
    //   reqBody.order_id = orderId;
    // }

    // const res = await API.request("api/v1/cart", {
    //   body: reqBody,
    // });

    // Return the integer that represents new percentage
    // return pickUpRangeStart.unix();
  }
);

const initialState = {
  loading: false,
  initialized: false,
  id: 333333,
  pickUpTime: null,
  gratuity: 20,
  items: [],
  cost: { subtotal: 1 },
};

export const { actions, reducer } = createSlice({
  name: "cart",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(refreshCart.fulfilled, (state, action) => {
      Object.assign(state, action.payload);

      state.initialized = true;
    });
    builder.addCase(addItemToCart.fulfilled, (state, action) => {
      // This would be the place to optimistically update local cart state
    });
    // builder.addCase(setGratuity.fulfilled, (state, action) => {
    //   // Update state w/ new tip value
    //   state.gratuity = action.payload;
    // });
    builder.addCase(setPickUpTime.fulfilled, (state, action) => {
      // Update state w/ new pickupTime value
      state.pickUpTime = action.payload;
    });
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

// A selector
export const cartSelector = (state) => state.cart;
export const getTotalItemQuantity = createSelector(
  [(state) => state.cart.items],
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
  [(state) => state.cart.items],
  (items) =>
    items.reduce((a, item) => {
      return a + Number(item.price);
    }, 0)
);

export const getTotal = createSelector(
  [
    getSubTotal,
    (state) => state.cart.gratuity,
    (state) => state.venue.data.taxPercentage,
  ],
  (subtotal, gratuity, taxPercentage) => {
    return (
      subtotal + (subtotal * gratuity) / 100 + (subtotal * taxPercentage) / 100
    );
  }
);

export const getCostDetails = createSelector(
  [(state) => state.cart],
  (cart) => {
    const {
      order_total,
      tax_percentage,
      Tax,
      gratuity_percentage,
      Gratuity,
    } = cart;

    const subtotal = Number(order_total) - Number(Tax) - Number(Gratuity);
    return {
      subtotal: renderUSD(subtotal),
      taxPercentage: tax_percentage,
      taxAmount: renderUSD(Tax),
      tipPercentage: gratuity_percentage,
      tipAmount: renderUSD(Gratuity),
      total: order_total ? renderUSD(order_total) : renderUSD(0),
    };
  }
);

// export const getCostDetails = createSelector(
//   [
//     getSubTotal,
//     (state) => state.venue.data.taxPercentage,
//     (state) => state.cart.gratuity,
//     getTotal,
//   ],
//   (subtotal, taxPercentage, tipPercentage, total) => {
//     const taxAmount = subtotal * (taxPercentage / 100);
//     const tipAmount = subtotal * (tipPercentage / 100);

//     return {
//       subtotal: renderUSD(subtotal),
//       taxPercentage,
//       taxAmount: renderUSD(taxAmount),
//       tipPercentage,
//       tipAmount: renderUSD(tipAmount),
//       total: renderUSD(total),
//     };
//   }
// );

export const getPickupTimeMoment = createSelector(
  [(state) => state.cart.pickUpTime],
  (time) => {
    if (time === null || time === "ASAP") {
      return time;
    } else {
      // @TODO: Pick one; either seconds (unix time), or dt string

      if (typeof time === "number") {
        return moment.unix(time);
      } else {
        return moment(time);
      }
    }
  }
);

function normalizeCart(cartObj) {
  /**
   * API returns a cart object that looks like this
    {
    "175": {
        "order_id": "175",
        "type": "taters",
        "start_date": "1969-12-31 16:00:00",
        "end_date": "1969-12-31 16:00:00",
        "order_total": "52.00",
        "event_id": "122",
        "gratuity_percentage": "5.00",
        "Gratuity": "2.60",
        "tax": "5.00",
        "Tax": "2.60",
        "order_items": [
            {
                "productID": "189",
                "orderItemId": "208",
                "title": "santa barbara uni",
                "quantity": "2.00",
                "price": "52.00",
                "currency": "USD",
                "variants": "201",
                "instructions": "testing",
                "subtotal": "52.00",
                "modifier": [
                    {
                        "name": "White Rice",
                        "price": "0.00"
                    }
                ]
            }
          ]
        }
      }
   *
   *
   */
  if (cartObj.message !== undefined) {
    // response will have message field if no cart found
    return { items: [], orderId: null };
  }

  // Take the most recent cart
  const activeCarts = Object.values(cartObj);
  const data = activeCarts[activeCarts.length - 1];

  const returnObj = { ...data };

  // console.log(returnObj);

  returnObj.id = data.order_id;
  returnObj.orderId = data.order_id;
  returnObj.type = data.type;
  returnObj.items = data.order_items.map(normalizeOrderItem);
  returnObj.gratuity_percentage = Number(data.gratuity_percentage);

  return returnObj;
}

function normalizeOrderItem(item) {
  /**
     {
      currency: "USD"
      instructions: []
      price: "572.00"
      productID: "282"
      quantity: "22.00"
      title: "santa barbara uni"
      variants: "294"
      modifier: {
        0: {
          id: "5",
          name: "Brown Rice",
          price: "1.00"
        }
      }
    }
 */
  const { orderItemId, instructions, currency /*modifiers*/ } = item;
  const quantity = Number(item.quantity);

  return {
    title: toTitleCase(item.title),
    name: toTitleCase(item.title),
    variationId: item.variants,
    itemId: item.productID,
    orderItemId,
    price: item.price,
    modifiers: Object.values(item.modifier).map((m) => m.id),
    instructions,
    quantity,
    currency,
  };
}
