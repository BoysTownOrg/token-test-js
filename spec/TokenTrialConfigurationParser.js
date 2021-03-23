import {
  Action,
  Color,
  InAnyOrder,
  InOrder,
  Shape,
  TokenInteraction,
  Size,
} from "../lib/TokenModel.js";
import { parseTokenInteractionRule } from "../lib/TokenTrialConfigurationParser.js";

function expectYields(rule, text) {
  expect(parseTokenInteractionRule(text)).toEqual(rule);
}

describe("Parser", () => {
  it("should parse one single token interaction", () => {
    expectYields(
      new InAnyOrder(
        new TokenInteraction({
          token: {
            color: Color.red,
            shape: Shape.square,
          },
          action: Action.touch,
        })
      ),
      "touch red square"
    );
  });

  it("should parse one pick-up token interaction", () => {
    expectYields(
      new InAnyOrder(
        new TokenInteraction({
          token: {
            color: Color.red,
            shape: Shape.square,
          },
          action: Action.pickUp,
        })
      ),
      "pick up red square"
    );
  });

  it("should parse one single sized token interaction", () => {
    expectYields(
      new InAnyOrder(
        new TokenInteraction({
          token: {
            color: Color.red,
            shape: Shape.square,
            size: Size.small,
          },
          action: Action.touch,
        })
      ),
      "touch small red square"
    );
  });

  it("should parse multiple single token interactions", () => {
    expectYields(
      new InOrder([
        new InAnyOrder(
          new TokenInteraction({
            token: {
              color: Color.red,
              shape: Shape.square,
            },
            action: Action.touch,
          })
        ),
        new InAnyOrder(
          new TokenInteraction({
            token: {
              color: Color.yellow,
              shape: Shape.circle,
            },
            action: Action.touch,
          })
        ),
        new InAnyOrder(
          new TokenInteraction({
            token: {
              color: Color.green,
              shape: Shape.square,
            },
            action: Action.pickUp,
          })
        ),
      ]),
      "touch red square\ntouch yellow circle\npick up green square"
    );
  });

  it("should parse unordered single token interactions", () => {
    expectYields(
      new InAnyOrder([
        new TokenInteraction({
          token: {
            color: Color.red,
            shape: Shape.square,
          },
          action: Action.touch,
        }),
        new TokenInteraction({
          token: {
            color: Color.yellow,
            shape: Shape.circle,
          },
          action: Action.touch,
        }),
      ]),
      "touch red square, touch yellow circle"
    );
  });

  it("should parse unordered single sized token interactions", () => {
    expectYields(
      new InAnyOrder([
        new TokenInteraction({
          token: {
            color: Color.red,
            shape: Shape.square,
            size: Size.small,
          },
          action: Action.touch,
        }),
        new TokenInteraction({
          token: {
            color: Color.yellow,
            shape: Shape.circle,
            size: Size.large,
          },
          action: Action.touch,
        }),
      ]),
      "touch small red square, touch large yellow circle"
    );
  });

  it("should parse partially unordered single token interactions", () => {
    expectYields(
      new InOrder([
        new InAnyOrder([
          new TokenInteraction({
            token: {
              color: Color.red,
              shape: Shape.square,
            },
            action: Action.touch,
          }),
          new TokenInteraction({
            token: {
              color: Color.yellow,
              shape: Shape.circle,
            },
            action: Action.touch,
          }),
        ]),
        new InAnyOrder(
          new TokenInteraction({
            token: {
              color: Color.white,
              shape: Shape.circle,
            },
            action: Action.pickUp,
          })
        ),
      ]),
      "touch red square, touch yellow circle\npick up white circle"
    );
  });

  it("should parse one dual token interaction", () => {
    expectYields(
      new InAnyOrder(
        new TokenInteraction({
          firstToken: {
            color: Color.white,
            shape: Shape.square,
          },
          secondToken: {
            color: Color.yellow,
            shape: Shape.circle,
          },
          action: Action.useToTouch,
        })
      ),
      "use white square to touch yellow circle"
    );
  });
});
