import { TokenModel, Action, Color, Shape } from "../lib/TokenModel.js";

class TrialStub {
  conclude(result) {
    this.result_ = result;
  }

  result() {
    return this.result_;
  }
}

function testModel(expectedInteractions, actualInteractions, expectedResult) {
  const trial = new TrialStub();
  const model = new TokenModel(trial, expectedInteractions);
  actualInteractions.forEach((interaction) =>
    model.submitSingleTokenInteraction(interaction)
  );
  expect(trial.result().correct).toEqual(expectedResult);
}

describe("Model", () => {
  it("should submit correct trial", () => {
    testModel(
      [
        {
          token: {
            color: Color.red,
            shape: Shape.square,
          },
          action: Action.touch,
        },
      ],
      [
        {
          token: {
            color: Color.red,
            shape: Shape.square,
          },
          action: Action.touch,
        },
      ],
      true
    );
  });

  it("should submit incorrect trial", () => {
    testModel(
      [
        {
          token: {
            color: Color.red,
            shape: Shape.square,
          },
          action: Action.touch,
        },
        {
          token: {
            color: Color.green,
            shape: Shape.circle,
          },
          action: Action.touch,
        },
      ],
      [
        {
          token: {
            color: Color.red,
            shape: Shape.square,
          },
          action: Action.touch,
        },
        {
          token: {
            color: Color.red,
            shape: Shape.circle,
          },
          action: Action.touch,
        },
      ],
      false
    );
  });

  it("should submit correct unordered trial", () => {
    testModel(
      [
        [
          {
            token: {
              color: Color.red,
              shape: Shape.square,
            },
            action: Action.touch,
          },
          {
            token: {
              color: Color.green,
              shape: Shape.circle,
            },
            action: Action.touch,
          },
        ],
      ],
      [
        {
          token: {
            color: Color.green,
            shape: Shape.circle,
          },
          action: Action.touch,
        },
        {
          token: {
            color: Color.red,
            shape: Shape.square,
          },
          action: Action.touch,
        },
      ],
      true
    );
  });

  it("should submit incorrect unordered trial", () => {
    testModel(
      [
        [
          {
            token: {
              color: Color.red,
              shape: Shape.square,
            },
            action: Action.touch,
          },
          {
            token: {
              color: Color.green,
              shape: Shape.circle,
            },
            action: Action.touch,
          },
        ],
      ],
      [
        {
          token: {
            color: Color.green,
            shape: Shape.circle,
          },
          action: Action.touch,
        },
        {
          token: {
            color: Color.red,
            shape: Shape.circle,
          },
          action: Action.touch,
        },
      ],
      false
    );
  });

  it("should submit correct partially unordered trial", () => {
    testModel(
      [
        [
          {
            token: {
              color: Color.red,
              shape: Shape.square,
            },
            action: Action.touch,
          },
          {
            token: {
              color: Color.green,
              shape: Shape.circle,
            },
            action: Action.touch,
          },
        ],
        {
          token: {
            color: Color.yellow,
            shape: Shape.circle,
          },
          action: Action.touch,
        },
      ],
      [
        {
          token: {
            color: Color.green,
            shape: Shape.circle,
          },
          action: Action.touch,
        },
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
      ],
      true
    );
  });
});
