import {
  Action,
  Color,
  InAnyOrder,
  InOrder,
  Shape,
  Size,
} from "../lib/TokenModel.js";
import { parseTokenInteractions } from "../lib/TokenTrialConfigurationParser.js";

function expectYields(interactions, text) {
  expect(parseTokenInteractions(text)).toEqual(interactions);
}

describe("Parser", () => {
  it("should parse one single token interaction", () => {
    expectYields(
      new InAnyOrder({
        token: {
          color: Color.red,
          shape: Shape.square,
        },
        action: Action.touch,
      }),
      "touch red square"
    );
  });

  it("should parse one pick-up token interaction", () => {
    expectYields(
      new InAnyOrder({
        token: {
          color: Color.red,
          shape: Shape.square,
        },
        action: Action.pickUp,
      }),
      "pick up red square"
    );
  });

  it("should parse one single sized token interaction", () => {
    expectYields(
      new InAnyOrder({
        token: {
          color: Color.red,
          shape: Shape.square,
          size: Size.small,
        },
        action: Action.touch,
      }),
      "touch small red square"
    );
  });

  it("should parse multiple single token interactions", () => {
    expectYields(
      new InOrder([
        new InAnyOrder({
          token: {
            color: Color.red,
            shape: Shape.square,
          },
          action: Action.touch,
        }),
        new InAnyOrder({
          token: {
            color: Color.yellow,
            shape: Shape.circle,
          },
          action: Action.touch,
        }),
        new InAnyOrder({
          token: {
            color: Color.green,
            shape: Shape.square,
          },
          action: Action.pickUp,
        }),
      ]),
      "touch red square\ntouch yellow circle\npick up green square"
    );
  });

  it("should parse unordered single token interactions", () => {
    expectYields(
      new InAnyOrder([
        {
          token: {
            color: Color.red,
            shape: Shape.square,
          },
          action: Action.touch,
        },
        {
          token: {
            color: Color.yellow,
            shape: Shape.circle,
          },
          action: Action.touch,
        },
      ]),
      "touch red square, touch yellow circle"
    );
  });

  it("should parse unordered single sized token interactions", () => {
    expectYields(
      new InAnyOrder([
        {
          token: {
            color: Color.red,
            shape: Shape.square,
            size: Size.small,
          },
          action: Action.touch,
        },
        {
          token: {
            color: Color.yellow,
            shape: Shape.circle,
            size: Size.large,
          },
          action: Action.touch,
        },
      ]),
      "touch small red square, touch large yellow circle"
    );
  });

  it("should parse partially unordered single token interactions", () => {
    expectYields(
      new InOrder([
        new InAnyOrder([
          {
            token: {
              color: Color.red,
              shape: Shape.square,
            },
            action: Action.touch,
          },
          {
            token: {
              color: Color.yellow,
              shape: Shape.circle,
            },
            action: Action.touch,
          },
        ]),
        new InAnyOrder({
          token: {
            color: Color.white,
            shape: Shape.circle,
          },
          action: Action.pickUp,
        }),
      ]),
      "touch red square, touch yellow circle\npick up white circle"
    );
  });

  it("should parse one dual token interaction", () => {
    expectYields(
      new InAnyOrder({
        firstToken: {
          color: Color.white,
          shape: Shape.square,
        },
        secondToken: {
          color: Color.yellow,
          shape: Shape.circle,
        },
        action: Action.useToTouch,
      }),
      "use white square to touch yellow circle"
    );
  });
});
