import { Action, Color, Shape } from "../lib/TokenModel.js";
import { parseTokenInteractions } from "../lib/TokenTrialConfigurationParser.js";

function expectYields(interactions, text) {
  expect(parseTokenInteractions(text)).toEqual(interactions);
}

describe("Parser", () => {
  it("should parse one single token interaction", () => {
    expectYields(
      [
        {
          token: {
            color: Color.red,
            shape: Shape.square,
          },
          action: Action.touch,
        },
      ],
      "touch red square"
    );
  });
});
