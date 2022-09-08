import { message } from "antd";

class API {
  constructor(basePath) {
    this.basePath = basePath;
  }

  X_CSRF_TOKEN = null;
  AUTHORIZATION = null;

  async requestXCSRFToken(endpoint) {
    this._requestingToken = true;
    this._request(endpoint).then((token) => {
      // store the token and do all the work that
      // was waiting on token retrieval
      this._requestingToken = false;
      this.X_CSRF_TOKEN = token;
      this._onTokenReadyCallbacks.forEach((cb) => cb());
    });
  }

  _onTokenReadyCallbacks = [];
  _requestingToken = false;
  onTokenReady(cb) {
    this._onTokenReadyCallbacks.push(cb);
  }

  getFullPath(subpath) {
    return `${this.basePath}/${subpath}`;
  }

  generateQueryString(queryParams) {
    const pairs = Object.entries(queryParams)
      .map(([key, val]) => {
        return `${key}=${val}`;
      })
      .join("&");
    return "?" + pairs;
  }

  async request(endpoint, { useToken = true, ...config } = {}) {
    // Get the X_CSRF_TOKEN if stored in localStorage.
    const local_CSRF_token = window.localStorage.getItem('__SBCA_token');
    if(local_CSRF_token) {
      this.X_CSRF_TOKEN = local_CSRF_token;
    }
    if (useToken) {
      if (this.X_CSRF_TOKEN) {
        const newConfig = {
          ...config,
          headers: { ...config.headers, "X-CSRF-Token": this.X_CSRF_TOKEN },
        };
        if(endpoint === 'user/login' ||
          endpoint === 'user/logout' ||
          endpoint === 'user/password' ||
          endpoint === 'user/lost-password' ||
          endpoint === 'user/lost-password-reset') {
          delete newConfig.headers["X-CSRF-Token"];
        }
        return this._request(endpoint, newConfig);
      } else {
        // Request the token if needed
        if (!this._requestingToken) {
          this.requestXCSRFToken("session/token");
        }

        // Await until token has been retrieved
        await new Promise((resolve, reject) => {
          this.onTokenReady(resolve);
        });

        const newConfig = {
          ...config,
          headers: { ...config.headers, "X-CSRF-Token": this.X_CSRF_TOKEN },
        };

        if(endpoint === 'user/login' ||
        
          endpoint === 'user/logout' ||
          endpoint === 'user/password' ||
          endpoint === 'user/lost-password' ||
          endpoint === 'user/lost-password-reset') {
          delete newConfig.headers["X-CSRF-Token"];
        }

        return this._request(endpoint, newConfig);
      }
    }

    return this._request(endpoint, config);
  }

  async _request(endpoint, { body, queryParams, ...customConfig } = {}) {
    const headers = { "content-type": "application/json" };

    // Attach token as Authorization header, if one exists
    const token = window.localStorage.getItem('authToken') || this.AUTHORIZATION;
    if(token) {
      if(endpoint !== 'user/login' ||
        endpoint !== 'user/logout' ||
        endpoint !== 'user/password' ||
        endpoint !== 'user/lost-password' ||
        endpoint !== 'user/lost-password-reset') {
        headers.Authorization = token;
      }
    }

    // If user endpoint and there is authorization we will delete it
    if(endpoint === 'user/login' ||
    endpoint==='user/email-login'||
      endpoint === 'user/logout' ||
      endpoint === 'user/password' ||
      endpoint === 'user/lost-password' ||
      endpoint === 'user/lost-password-reset') {
        delete headers.Authorization;
    }

    // Build fetch config
    let method = body ? (body.method ? body.method : "POST") : "GET";
    const config = {
      method: method,
      credentials: "include",
      redirect: "follow",
      ...customConfig,
      headers: {
        ...headers,
        ...customConfig.headers,
      },
    };

    if (body) {
      config.body = JSON.stringify(body);
    }

    // Build the URL
    let URL = this.getFullPath(endpoint);
    if (queryParams) {
      URL += this.generateQueryString(queryParams);
    }

    // Perform the fetch, parsing any JSON in the response
    return window.fetch(URL, config).then(async (response) => {
      let data;
      const contentType = response.headers.get("Content-Type");
      // Extract data from the response
      if (contentType === "application/json") {
        data = await response.json();
      } else if (contentType.includes("text")) {
        data = await response.text();
      }
      // console.log(response);
      if (response.status >= 400) {
        message.error(data.message);
        // console.log(response);
        // If the user's token was invalid
        // clearLocalAuthToken();

        // Refresh the page, to force reauthentication
        // window.location.assign(window.location);
        return;
      }

      if (response.ok) {
        return data;
      } else {
        return Promise.reject(data);
      }
    }).catch(error => {console.error("I found an error", error)});
  }
}
export default API;
