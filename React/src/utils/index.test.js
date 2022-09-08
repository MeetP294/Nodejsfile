import { toTitleCase, toMilitaryTime } from "./index.js";

test("toTitleCase converts ", () => {
  const inputs = ["the_lord_of_the_rings", "the lord of the rings"];
  const expected = "The Lord Of The Rings";

  const res = inputs.map(toTitleCase);

  for (let i = 0; i < inputs.length; i++) {
    expect(res[i]).toEqual(expected);
  }
});

test("toMilitaryTime converts correctly", () => {
  const inputs = ["12:30am", "10:33 am", "12:30 pm", "5:14pm"];
  const expected = ["0:30", "10:33", "12:30", "17:14"];

  const res = inputs.map(toMilitaryTime);

  for (let i = 0; i < res.length; i++) {
    expect(res[i]).toEqual(expected[i]);
  }
});
