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
  DoNothing,
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

function submitDualTokenInteraction(model, interaction, tokenRelation) {
  model.submitDualTokenInteraction(interaction, tokenRelation);
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
    (trial, timer, rule_) => new TokenModel(trial, timer, rule_),
    rule,
    interactions,
    expectedResult,
    submit,
    tokenRelation
  );
}

class TokenRelationStub {
  constructor() {
    this.movedTokenIsFurtherFrom_ = false;
    this.movedTokenIsBetween_ = false;
    this.movedTokenIsLeftOf_ = false;
  }

  setMovedTokenIsLeftOf() {
    this.movedTokenIsLeftOf_ = true;
  }

  movedTokenIsFurtherFrom(token) {
    return this.movedTokenIsFurtherFrom_;
  }

  setMovedTokenIsFurtherFrom() {
    this.movedTokenIsFurtherFrom_ = true;
  }

  setMovedTokenIsBetween() {
    this.movedTokenIsBetween_ = true;
  }

  movedTokenIsBetween(a, b) {
    return this.movedTokenIsBetween_;
  }

  movedTokenIsLeftOf(a) {
    return this.movedTokenIsLeftOf_;
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

  it("should honor that moving a token is technically touching it", () => {
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
          action: Action.move,
        },
      ],
      true,
      submitSingleTokenInteraction
    );
  });

  it("should honor that using a token is technically touching it", () => {
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
          firstToken: {
            color: Color.red,
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

  it("should honor that picking up a token is technically touching it", () => {
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
          action: Action.pickUp,
        },
      ],
      true,
      submitSingleTokenInteraction
    );
  });

  it("should consider nothing as correct for do nothing", () => {
    testModel(new DoNothing(), [], true, submitSingleTokenInteraction);
  });

  it("should consider something as incorrect for do nothing", () => {
    testModel(
      new DoNothing(),
      [
        {
          token: {
            color: Color.red,
            shape: Shape.square,
          },
          action: Action.pickUp,
        },
      ],
      false,
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
          color: "red",
          shape: "square",
        },
        action: "touch",
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

  it("should count moves as correct for touches", () => {
    testModel(
      new InAnyOrder([
        new TokenInteraction({
          token: {
            color: Color.green,
            shape: Shape.circle,
          },
          action: Action.touch,
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
            color: Color.red,
            shape: Shape.square,
          },
          action: Action.move,
        },
        {
          token: {
            color: Color.green,
            shape: Shape.circle,
          },
          action: Action.move,
        },
      ],
      true,
      submitSingleTokenInteraction
    );
  });

  it("should count two 'use to touch' as correct for two 'touches'", () => {
    testModel(
      new InAnyOrder([
        new TokenInteraction({
          token: {
            color: Color.green,
            shape: Shape.circle,
          },
          action: Action.touch,
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
          firstToken: {
            color: Color.red,
            shape: Shape.square,
          },
          secondToken: {
            color: Color.red,
            shape: Shape.circle,
          },
          action: Action.useToTouch,
        },
        {
          firstToken: {
            color: Color.green,
            shape: Shape.circle,
          },
          secondToken: {
            color: Color.yellow,
            shape: Shape.square,
          },
          action: Action.useToTouch,
        },
      ],
      true,
      submitDualTokenInteraction
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

  it("should submit correct move away from action even when dropping token on another", () => {
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
          firstToken: {
            color: Color.green,
            shape: Shape.square,
          },
          secondToken: {
            color: Color.red,
            shape: Shape.square,
          },
          action: Action.useToTouch,
        },
      ],
      true,
      submitDualTokenInteraction,
      tokenRelation
    );
  });

  it("should submit correct move away from action even when picking it up", () => {
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
          action: Action.pickUp,
        },
      ],
      true,
      submitSingleTokenInteraction,
      tokenRelation
    );
  });

  it("should submit correct put left of action", () => {
    const tokenRelation = new TokenRelationStub();
    tokenRelation.setMovedTokenIsLeftOf();
    testModel(
      new TokenInteraction({
        firstToken: {
          color: Color.red,
          shape: Shape.circle,
        },
        secondToken: {
          color: Color.yellow,
          shape: Shape.square,
        },
        action: Action.putLeftOf,
      }),
      [
        {
          token: {
            color: Color.red,
            shape: Shape.circle,
          },
          action: Action.move,
        },
      ],
      true,
      submitSingleTokenInteraction,
      tokenRelation
    );
  });

  it("should submit correct put left of action even when token dropped onto another", () => {
    const tokenRelation = new TokenRelationStub();
    tokenRelation.setMovedTokenIsLeftOf();
    testModel(
      new TokenInteraction({
        firstToken: {
          color: Color.red,
          shape: Shape.circle,
        },
        secondToken: {
          color: Color.yellow,
          shape: Shape.square,
        },
        action: Action.putLeftOf,
      }),
      [
        {
          firstToken: {
            color: Color.red,
            shape: Shape.circle,
          },
          secondToken: {
            color: Color.yellow,
            shape: Shape.square,
          },
          action: Action.useToTouch,
        },
      ],
      true,
      submitDualTokenInteraction,
      tokenRelation
    );
  });

  it("should submit correct put between action", () => {
    const tokenRelation = new TokenRelationStub();
    tokenRelation.setMovedTokenIsBetween();
    testModel(
      new TokenInteraction({
        firstToken: {
          color: Color.red,
          shape: Shape.circle,
        },
        secondToken: {
          color: Color.yellow,
          shape: Shape.square,
        },
        thirdToken: {
          color: Color.green,
          shape: Shape.square,
        },
        action: Action.putBetween,
      }),
      [
        {
          token: {
            color: Color.red,
            shape: Shape.circle,
          },
          action: Action.move,
        },
      ],
      true,
      submitSingleTokenInteraction,
      tokenRelation
    );
  });

  it("should submit correct put between action even when token dropped onto another", () => {
    const tokenRelation = new TokenRelationStub();
    tokenRelation.setMovedTokenIsBetween();
    testModel(
      new TokenInteraction({
        firstToken: {
          color: Color.red,
          shape: Shape.circle,
        },
        secondToken: {
          color: Color.yellow,
          shape: Shape.square,
        },
        thirdToken: {
          color: Color.green,
          shape: Shape.square,
        },
        action: Action.putBetween,
      }),
      [
        {
          firstToken: {
            color: Color.red,
            shape: Shape.circle,
          },
          secondToken: {
            color: Color.yellow,
            shape: Shape.square,
          },
          action: Action.useToTouch,
        },
      ],
      true,
      submitDualTokenInteraction,
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
