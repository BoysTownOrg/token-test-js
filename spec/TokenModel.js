import {
  TokenModel,
  SizedTokenModel,
  Action,
  Color,
  Shape,
  Size,
} from "../lib/TokenModel.js";

class TrialStub {
  conclude(result) {
    this.result_ = result;
  }

  result() {
    return this.result_;
  }
}

class TimerStub {
  milliseconds() {
    return this.milliseconds_;
  }

  setMilliseconds(x) {
    this.milliseconds_ = x;
  }
}

function submitDualTokenInteraction(model, interaction) {
  model.submitDualTokenInteraction(interaction);
}

function submitSingleTokenInteraction(model, interaction) {
  model.submitSingleTokenInteraction(interaction);
}

function testModelWithFactory(
  create,
  expectedInteractions,
  actualInteractions,
  expectedResult,
  submit
) {
  const trial = new TrialStub();
  const timer = new TimerStub();
  const model = create(trial, timer, expectedInteractions);
  actualInteractions.forEach((interaction) => submit(model, interaction));
  model.concludeTrial();
  expect(trial.result().correct).toEqual(expectedResult);
}

function testModel(
  expectedInteractions,
  actualInteractions,
  expectedResult,
  submit
) {
  testModelWithFactory(
    (trial, timer, expectedInteractions_) =>
      new TokenModel(trial, timer, expectedInteractions_),
    expectedInteractions,
    actualInteractions,
    expectedResult,
    submit
  );
}

function testSizedModel(
  expectedInteractions,
  actualInteractions,
  expectedResult,
  submit
) {
  testModelWithFactory(
    (trial, timer, expectedInteractions_) =>
      new SizedTokenModel(trial, timer, expectedInteractions_),
    expectedInteractions,
    actualInteractions,
    expectedResult,
    submit
  );
}

describe("TokenModel", () => {
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

  it("should record one single token interaction", () => {
    const trial = new TrialStub();
    const timer = new TimerStub();
    const model = new TokenModel(trial, timer, [
      {
        token: {
          color: Color.green,
          shape: Shape.circle,
        },
        action: Action.pickUp,
      },
    ]);
    timer.setMilliseconds(1);
    submitSingleTokenInteraction(model, {
      token: {
        color: Color.red,
        shape: Shape.square,
      },
      action: Action.touch,
    });
    model.concludeTrial();
    expect(trial.result().tokenInteractions).toEqual([
      {
        token: {
          color: Color.red,
          shape: Shape.square,
        },
        action: Action.touch,
        milliseconds: 1,
      },
    ]);
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
    const model = new TokenModel(trial, new TimerStub(), [
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
    model.concludeTrial();
    expect(trial.result().correct).toEqual(true);
  });

  it("should submit correct mixed token interaction unordered trial", () => {
    const trial = new TrialStub();
    const model = new TokenModel(trial, new TimerStub(), [
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
    model.concludeTrial();
    expect(trial.result().correct).toEqual(true);
  });

  it("should submit incorrect mixed token interaction unordered trial", () => {
    const trial = new TrialStub();
    const model = new TokenModel(trial, new TimerStub(), [
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
    model.concludeTrial();
    expect(trial.result().correct).toEqual(false);
  });
});

describe("SizedTokenModel", () => {
  it("should submit correct single token trial ", () => {
    testSizedModel(
      [
        {
          token: {
            color: Color.red,
            shape: Shape.square,
            size: Size.small,
          },
          action: Action.touch,
        },
      ],
      [
        {
          token: {
            color: Color.red,
            shape: Shape.square,
            size: Size.small,
          },
          action: Action.touch,
        },
      ],
      true,
      submitSingleTokenInteraction
    );
  });

  it("should submit correct dual token interaction trial", () => {
    testModel(
      [
        {
          firstToken: {
            color: Color.red,
            shape: Shape.circle,
            size: Size.small,
          },
          secondToken: {
            color: Color.green,
            shape: Shape.square,
            size: Size.large,
          },
          action: Action.useToTouch,
        },
      ],
      [
        {
          firstToken: {
            color: Color.red,
            shape: Shape.circle,
            size: Size.small,
          },
          secondToken: {
            color: Color.green,
            shape: Shape.square,
            size: Size.large,
          },
          action: Action.useToTouch,
        },
      ],
      true,
      submitDualTokenInteraction
    );
  });
});
