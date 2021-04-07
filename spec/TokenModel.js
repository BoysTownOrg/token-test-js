import {
  TokenModel,
  Action,
  Color,
  Shape,
  Size,
  InAnyOrder,
  InOrder,
  SizedTokenInteraction,
  TokenInteraction,
  FirstOrSecond,
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

function submitSingleTokenInteraction(model, interaction, tokenRelation) {
  model.submitSingleTokenInteraction(interaction, tokenRelation);
}

function testModelWithFactory(
  create,
  rule,
  interactions,
  expectedResult,
  submit,
  tokenRelation
) {
  const trial = new TrialStub();
  const timer = new TimerStub();
  const model = create(trial, timer, rule);
  interactions.forEach((interaction) =>
    submit(model, interaction, tokenRelation)
  );
  model.concludeTrial();
  expect(trial.result().correct).toEqual(expectedResult);
}

function testModel(rule, interactions, expectedResult, submit, tokenRelation) {
  testModelWithFactory(
    (trial, timer, rule) => new TokenModel(trial, timer, rule),
    rule,
    interactions,
    expectedResult,
    submit,
    tokenRelation
  );
}

class TokenRelationStub {
  constructor() {
    this.movedTokenIsFurtherFrom_ = true;
  }

  movedTokenIsFurtherFrom(token) {
    return this.movedTokenIsFurtherFrom_;
  }

  setMovedTokenIsFurtherFrom() {
    this.movedTokenIsFurtherFrom_ = true;
  }
}

describe("TokenModel", () => {
  it("should submit correct trial", () => {
    testModel(
      new TokenInteraction({
        token: {
          color: Color.red,
          shape: Shape.square,
        },
        action: Action.touch,
      }),
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
    const model = new TokenModel(
      trial,
      timer,
      new TokenInteraction({
        token: {
          color: Color.green,
          shape: Shape.circle,
        },
        action: Action.pickUp,
      })
    );
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

  it("should not count more token interactions than expected as correct", () => {
    testModel(
      new TokenInteraction({
        token: {
          color: Color.green,
          shape: Shape.circle,
        },
        action: Action.pickUp,
      }),
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
          action: Action.pickUp,
        },
      ],
      false,
      submitSingleTokenInteraction
    );
  });

  it("should not count initially correct as correct", () => {
    testModel(
      new TokenInteraction({
        token: {
          color: Color.green,
          shape: Shape.circle,
        },
        action: Action.pickUp,
      }),
      [
        {
          token: {
            color: Color.green,
            shape: Shape.circle,
          },
          action: Action.pickUp,
        },
        {
          token: {
            color: Color.red,
            shape: Shape.square,
          },
          action: Action.touch,
        },
      ],
      false,
      submitSingleTokenInteraction
    );
  });

  it("should not count eventually correct as correct", () => {
    testModel(
      new InAnyOrder([
        new TokenInteraction({
          token: {
            color: Color.green,
            shape: Shape.circle,
          },
          action: Action.pickUp,
        }),
        new TokenInteraction({
          token: {
            color: Color.red,
            shape: Shape.square,
          },
          action: Action.touch,
        }),
      ]),
      [
        {
          token: {
            color: Color.yellow,
            shape: Shape.circle,
          },
          action: Action.pickUp,
        },
        {
          token: {
            color: Color.green,
            shape: Shape.circle,
          },
          action: Action.pickUp,
        },
        {
          token: {
            color: Color.red,
            shape: Shape.square,
          },
          action: Action.touch,
        },
      ],
      false,
      submitSingleTokenInteraction
    );
  });

  it("should submit incorrect trial", () => {
    testModel(
      new InOrder([
        new TokenInteraction({
          token: {
            color: Color.red,
            shape: Shape.square,
          },
          action: Action.touch,
        }),
        new TokenInteraction({
          token: {
            color: Color.green,
            shape: Shape.circle,
          },
          action: Action.touch,
        }),
      ]),
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
            color: Color.green,
            shape: Shape.circle,
          },
          action: Action.touch,
        }),
      ]),
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
            color: Color.green,
            shape: Shape.circle,
          },
          action: Action.touch,
        }),
      ]),
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
              color: Color.green,
              shape: Shape.circle,
            },
            action: Action.touch,
          }),
        ]),
        new TokenInteraction({
          token: {
            color: Color.yellow,
            shape: Shape.circle,
          },
          action: Action.touch,
        }),
      ]),
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
              color: Color.green,
              shape: Shape.circle,
            },
            action: Action.touch,
          }),
        ]),
        new TokenInteraction({
          token: {
            color: Color.yellow,
            shape: Shape.circle,
          },
          action: Action.touch,
        }),
      ]),
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
      new InOrder([
        new TokenInteraction({
          firstToken: {
            color: Color.red,
            shape: Shape.circle,
          },
          secondToken: {
            color: Color.green,
            shape: Shape.square,
          },
          action: Action.useToTouch,
        }),
        new TokenInteraction({
          firstToken: {
            color: Color.yellow,
            shape: Shape.square,
          },
          secondToken: {
            color: Color.white,
            shape: Shape.circle,
          },
          action: Action.useToTouch,
        }),
      ]),
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

  it("should submit correct move away from action", () => {
    const tokenRelation = new TokenRelationStub();
    tokenRelation.setMovedTokenIsFurtherFrom();
    testModel(
      new TokenInteraction({
        firstToken: {
          color: Color.green,
          shape: Shape.square,
        },
        secondToken: {
          color: Color.yellow,
          shape: Shape.square,
        },
        action: Action.moveAwayFrom,
      }),
      [
        {
          token: {
            color: Color.green,
            shape: Shape.square,
          },
          action: Action.move,
        },
      ],
      true,
      submitSingleTokenInteraction,
      tokenRelation
    );
  });

  it("should submit incorrect dual token interaction only trial", () => {
    testModel(
      new InOrder([
        new TokenInteraction({
          firstToken: {
            color: Color.red,
            shape: Shape.circle,
          },
          secondToken: {
            color: Color.green,
            shape: Shape.square,
          },
          action: Action.useToTouch,
        }),
        new TokenInteraction({
          firstToken: {
            color: Color.yellow,
            shape: Shape.square,
          },
          secondToken: {
            color: Color.white,
            shape: Shape.circle,
          },
          action: Action.useToTouch,
        }),
      ]),
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
      new InAnyOrder([
        new TokenInteraction({
          firstToken: {
            color: Color.red,
            shape: Shape.circle,
          },
          secondToken: {
            color: Color.green,
            shape: Shape.square,
          },
          action: Action.useToTouch,
        }),
        new TokenInteraction({
          firstToken: {
            color: Color.yellow,
            shape: Shape.square,
          },
          secondToken: {
            color: Color.white,
            shape: Shape.circle,
          },
          action: Action.useToTouch,
        }),
      ]),
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
      new InAnyOrder([
        new TokenInteraction({
          firstToken: {
            color: Color.red,
            shape: Shape.circle,
          },
          secondToken: {
            color: Color.green,
            shape: Shape.square,
          },
          action: Action.useToTouch,
        }),
        new TokenInteraction({
          firstToken: {
            color: Color.yellow,
            shape: Shape.square,
          },
          secondToken: {
            color: Color.white,
            shape: Shape.circle,
          },
          action: Action.useToTouch,
        }),
      ]),
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
    const model = new TokenModel(
      trial,
      new TimerStub(),
      new InOrder([
        new TokenInteraction({
          token: {
            color: Color.red,
            shape: Shape.square,
          },
          action: Action.touch,
        }),
        new TokenInteraction({
          firstToken: {
            color: Color.yellow,
            shape: Shape.square,
          },
          secondToken: {
            color: Color.white,
            shape: Shape.circle,
          },
          action: Action.useToTouch,
        }),
      ])
    );
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
    const model = new TokenModel(
      trial,
      new TimerStub(),
      new InAnyOrder([
        new TokenInteraction({
          token: {
            color: Color.red,
            shape: Shape.square,
          },
          action: Action.touch,
        }),
        new TokenInteraction({
          firstToken: {
            color: Color.yellow,
            shape: Shape.square,
          },
          secondToken: {
            color: Color.white,
            shape: Shape.circle,
          },
          action: Action.useToTouch,
        }),
      ])
    );
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
    testModel(
      new InAnyOrder([
        new TokenInteraction({
          token: {
            color: Color.red,
            shape: Shape.square,
          },
          action: Action.touch,
        }),
        new TokenInteraction({
          firstToken: {
            color: Color.yellow,
            shape: Shape.square,
          },
          secondToken: {
            color: Color.white,
            shape: Shape.circle,
          },
          action: Action.useToTouch,
        }),
      ]),
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
            shape: Shape.square,
          },
          action: Action.touch,
        },
      ],
      false,
      submitSingleTokenInteraction
    );
  });

  it("should submit correct option trial", () => {
    testModel(
      new FirstOrSecond(
        new TokenInteraction({
          token: {
            color: Color.red,
            shape: Shape.square,
          },
          action: Action.touch,
        }),
        new TokenInteraction({
          token: {
            color: Color.green,
            shape: Shape.circle,
          },
          action: Action.touch,
        })
      ),
      [
        {
          token: {
            color: Color.green,
            shape: Shape.circle,
          },
          action: Action.touch,
        },
      ],
      true,
      submitSingleTokenInteraction
    );
  });
});

describe("SizedTokenModel", () => {
  it("should submit correct single token trial ", () => {
    testModel(
      new SizedTokenInteraction({
        token: {
          color: Color.red,
          shape: Shape.square,
          size: Size.small,
        },
        action: Action.touch,
      }),
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
      new SizedTokenInteraction({
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
      }),
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
