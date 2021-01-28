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
  beforeEach(function () {
    this.trial = new TrialStub();
  });

  it("should submit correct trial", function () {
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

  it("should submit incorrect trial", function () {
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

  it("should submit correct unordered trial", function () {
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

  it("should submit incorrect unordered trial", function () {
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
});
