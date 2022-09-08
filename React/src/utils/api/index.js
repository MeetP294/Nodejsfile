import API from "./api";

// const url =
//   process.env.NODE_ENV !== "test" ? process.env.REACT_APP_API_URL : "";
const apiManager = new API(process.env.REACT_APP_API_URL);
// if (process.env.NODE_ENV === "test") {
// Set an arbitrary token
// apiManager.token = "abc123";
// } else {
// Retrieve real token
// Hardcode URL for now, while token endpoint violates pattern
// apiManager.requestXCSRFToken("session/token");
// apiManager.token = "";
// }

export default apiManager;


