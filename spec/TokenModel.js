import { TokenModel, Action, Color, Shape } from "../lib/TokenModel.js";

class TrialStub {
  conclude(result) {
    this.result_ = result;
  }

  result() {
    return this.result_;
  }
}

function submitDualTokenInteraction(model, interaction) {
  model.submitDualTokenInteraction(interaction);
}

function submitSingleTokenInteraction(model, interaction) {
  model.submitSingleTokenInteraction(interaction);
}

function testModel(
  expectedInteractions,
  actualInteractions,
  expectedResult,
  submit
) {
  const trial = new TrialStub();
  const model = new TokenModel(trial, expectedInteractions);
  actualInteractions.forEach((interaction) => submit(model, interaction));
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
      true,
      submitSingleTokenInteraction
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
      false,
      submitSingleTokenInteraction
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
      true,
      submitSingleTokenInteraction
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
      false,
      submitSingleTokenInteraction
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
      true,
      submitSingleTokenInteraction
    );
  });

  it("should submit incorrect partially unordered trial", () => {
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
            shape: Shape.square,
          },
          action: Action.touch,
        },
      ],
      false,
      submitSingleTokenInteraction
    );
  });

  it("should submit correct dual token interaction only trial", () => {
    testModel(
      [
        {
          firstToken: {
            color: Color.red,
            shape: Shape.circle,
          },
          secondToken: {
            color: Color.green,
            shape: Shape.square,
          },
          action: Action.useToTouch,
        },
        {
          firstToken: {
            color: Color.yellow,
            shape: Shape.square,
          },
          secondToken: {
            color: Color.white,
            shape: Shape.circle,
          },
          action: Action.useToTouch,
        },
      ],
      [
        {
          firstToken: {
            color: Color.red,
            shape: Shape.circle,
          },
          secondToken: {
            color: Color.green,
            shape: Shape.square,
          },
          action: Action.useToTouch,
        },
        {
          firstToken: {
            color: Color.yellow,
            shape: Shape.square,
          },
          secondToken: {
            color: Color.white,
            shape: Shape.circle,
          },
          action: Action.useToTouch,
        },
      ],
      true,
      submitDualTokenInteraction
    );
  });

  it("should submit incorrect dual token interaction only trial", () => {
    testModel(
      [
        {
          firstToken: {
            color: Color.red,
            shape: Shape.circle,
          },
          secondToken: {
            color: Color.green,
            shape: Shape.square,
          },
          action: Action.useToTouch,
        },
        {
          firstToken: {
            color: Color.yellow,
            shape: Shape.square,
          },
          secondToken: {
            color: Color.white,
            shape: Shape.circle,
          },
          action: Action.useToTouch,
        },
      ],
      [
        {
          firstToken: {
            color: Color.red,
            shape: Shape.circle,
          },
          secondToken: {
            color: Color.green,
            shape: Shape.square,
          },
          action: Action.useToTouch,
        },
        {
          firstToken: {
            color: Color.yellow,
            shape: Shape.square,
          },
          secondToken: {
            color: Color.white,
            shape: Shape.square,
          },
          action: Action.useToTouch,
        },
      ],
      false,
      submitDualTokenInteraction
    );
  });

  it("should submit correct dual token interaction only unordered trial", () => {
    testModel(
      [
        [
          {
            firstToken: {
              color: Color.red,
              shape: Shape.circle,
            },
            secondToken: {
              color: Color.green,
              shape: Shape.square,
            },
            action: Action.useToTouch,
          },
          {
            firstToken: {
              color: Color.yellow,
              shape: Shape.square,
            },
            secondToken: {
              color: Color.white,
              shape: Shape.circle,
            },
            action: Action.useToTouch,
          },
        ],
      ],
      [
        {
          firstToken: {
            color: Color.yellow,
            shape: Shape.square,
          },
          secondToken: {
            color: Color.white,
            shape: Shape.circle,
          },
          action: Action.useToTouch,
        },
        {
          firstToken: {
            color: Color.red,
            shape: Shape.circle,
          },
          secondToken: {
            color: Color.green,
            shape: Shape.square,
          },
          action: Action.useToTouch,
        },
      ],
      true,
      submitDualTokenInteraction
    );
  });

  it("should submit incorrect dual token interaction only unordered trial", () => {
    testModel(
      [
        [
          {
            firstToken: {
              color: Color.red,
              shape: Shape.circle,
            },
            secondToken: {
              color: Color.green,
              shape: Shape.square,
            },
            action: Action.useToTouch,
          },
          {
            firstToken: {
              color: Color.yellow,
              shape: Shape.square,
            },
            secondToken: {
              color: Color.white,
              shape: Shape.circle,
            },
            action: Action.useToTouch,
          },
        ],
      ],
      [
        {
          firstToken: {
            color: Color.yellow,
            shape: Shape.square,
          },
          secondToken: {
            color: Color.white,
            shape: Shape.circle,
          },
          action: Action.useToTouch,
        },
        {
          firstToken: {
            color: Color.yellow,
            shape: Shape.square,
          },
          secondToken: {
            color: Color.white,
            shape: Shape.circle,
          },
          action: Action.useToTouch,
        },
      ],
      false,
      submitDualTokenInteraction
    );
  });

  it("should submit correct mixed token interaction trial", () => {
    const trial = new TrialStub();
    const model = new TokenModel(trial, [
      {
        token: {
          color: Color.red,
          shape: Shape.square,
        },
        action: Action.touch,
      },
      {
        firstToken: {
          color: Color.yellow,
          shape: Shape.square,
        },
        secondToken: {
          color: Color.white,
          shape: Shape.circle,
        },
        action: Action.useToTouch,
      },
    ]);
    model.submitSingleTokenInteraction({
      token: {
        color: Color.red,
        shape: Shape.square,
      },
      action: Action.touch,
    });
    model.submitDualTokenInteraction({
      firstToken: {
        color: Color.yellow,
        shape: Shape.square,
      },
      secondToken: {
        color: Color.white,
        shape: Shape.circle,
      },
      action: Action.useToTouch,
    });
    expect(trial.result().correct).toEqual(true);
  });

  it("should submit correct mixed token interaction unordered trial", () => {
    const trial = new TrialStub();
    const model = new TokenModel(trial, [
      [
        {
          token: {
            color: Color.red,
            shape: Shape.square,
          },
          action: Action.touch,
        },
        {
          firstToken: {
            color: Color.yellow,
            shape: Shape.square,
          },
          secondToken: {
            color: Color.white,
            shape: Shape.circle,
          },
          action: Action.useToTouch,
        },
      ],
    ]);
    model.submitDualTokenInteraction({
      firstToken: {
        color: Color.yellow,
        shape: Shape.square,
      },
      secondToken: {
        color: Color.white,
        shape: Shape.circle,
      },
      action: Action.useToTouch,
    });
    model.submitSingleTokenInteraction({
      token: {
        color: Color.red,
        shape: Shape.square,
      },
      action: Action.touch,
    });
    expect(trial.result().correct).toEqual(true);
  });

  it("should submit incorrect mixed token interaction unordered trial", () => {
    const trial = new TrialStub();
    const model = new TokenModel(trial, [
      [
        {
          token: {
            color: Color.red,
            shape: Shape.square,
          },
          action: Action.touch,
        },
        {
          firstToken: {
            color: Color.yellow,
            shape: Shape.square,
          },
          secondToken: {
            color: Color.white,
            shape: Shape.circle,
          },
          action: Action.useToTouch,
        },
      ],
    ]);
    model.submitSingleTokenInteraction({
      token: {
        color: Color.red,
        shape: Shape.square,
      },
      action: Action.touch,
    });
    model.submitSingleTokenInteraction({
      token: {
        color: Color.red,
        shape: Shape.square,
      },
      action: Action.touch,
    });
    expect(trial.result().correct).toEqual(false);
  });
});
