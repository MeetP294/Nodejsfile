import { rest } from "msw";
import testUser from "./user.json";
import testMenu from "./menu.json";
import testCart from "./cart.json";

const data = {
  user: testUser,
  menu: testMenu,
  cart: testCart,
};

const handlers = [
  rest.post("*", (req, res, ctx) => {
    logRequest(req);
    res(ctx.json({ success: true }));
  }),
  rest.get("*/session/token", (req, res, ctx) => {
    console.log("inside handler 1");
    logRequest(req);
    return res(ctx.text("abcdefg"));
  }),
  
  rest.get("*", (req, res, ctx) => {
    // // console.log("inside handler 4");
    logRequest(req);
    return res(ctx.text("abcdefg"));
  }),
  rest.post("*/api/v1/cart", (req, res, ctx) => {
    logRequest(req);
    return res(ctx.json({ stuff: "things" }));
  }),
  rest.post("*/api/v1/cart/add?_format=json", (req, res, ctx) => {
    logRequest(req);
    return res(ctx.json({}));
  }),
];

export { handlers };

function logRequest(req) {
  // console.log("Intercepted a request to", JSON.stringify(req.url));
}

function logResponse(res) {
  // console.log("Responding with...\n", JSON.stringify(res));
}
