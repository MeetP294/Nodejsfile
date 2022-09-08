import API from "./api";

describe("API helper", () => {
  let apiHelper;

  beforeAll(() => {
    global.fetch = jest.fn((path) =>
      Promise.resolve({
        ok: true,
        headers: {
          get: (header) => {
            if (header === "Content-Type") {
              return "application/json";
            }
          },
        },
        json: () =>
          !!path.match(/fail/)
            ? Promise.resolve({ success: false, foo: "bar" })
            : Promise.resolve({ success: true, foo: "bar" }),
      })
    );
    apiHelper = new API("http://basepath.com");
    apiHelper.token = "abcdef";
  });

  test("should handle query parameters correctly", () => {
    expect(
      apiHelper.generateQueryString({ key1: "value1", key2: "value2" })
    ).toEqual("?key1=value1&key2=value2");
  });

  test("should build full URL path correctly", () => {
    expect(apiHelper.getFullPath("subpath")).toEqual(
      "http://basepath.com/subpath"
    );
  });

  describe("GET method", () => {
    test("should return parsed response", async () => {
      const res = await apiHelper.request("users");

      expect(resIsParsed(res)).toBeTruthy();
    });
    test("should throw when response is unsuccessful", async () => {
      try {
        await apiHelper.get("fail");
        expect(true).toBeFalsy();
      } catch (error) {
        expect(error).toBeTruthy();
      }
    });
  });
  describe("POST method", () => {
    test("should return parsed response", async () => {
      const res = await apiHelper.request("users", { body: { foo: "bar" } });

      expect(resIsParsed(res)).toBeTruthy();
    });
    test("should throw when response is unsuccessful", async () => {
      try {
        await apiHelper.postJson("fail");
        expect(true).toBeFalsy();
      } catch (error) {
        expect(error).toBeTruthy();
      }
    });
  });
});

function resIsParsed(body) {
  return typeof body !== "string";
}
