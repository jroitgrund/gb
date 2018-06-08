import { returnFive } from "./cpu";

test("cpu", () => {
  expect(returnFive()).toBe(5);
});
