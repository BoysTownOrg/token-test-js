import { trialsWithProgress } from "../lib/progress.js";

describe("trial-progress", () => {
  it("should add currentTrial and totalTrials properties to each trial", function () {
    const withProgress = trialsWithProgress([
      {
        type: "idk",
        x: 3,
      },
      {
        type: "idk",
        x: 2,
      },
      {
        type: "idk",
        x: 5,
      },
      {
        type: "idk",
        x: 7,
      },
      {
        type: "idk",
        x: 11,
      },
    ]);
    expect(withProgress[0].currentTrial).toBe(1);
    expect(withProgress[1].currentTrial).toBe(2);
    expect(withProgress[2].currentTrial).toBe(3);
    expect(withProgress[3].currentTrial).toBe(4);
    expect(withProgress[4].currentTrial).toBe(5);

    expect(withProgress[0].totalTrials).toBe(5);
    expect(withProgress[1].totalTrials).toBe(5);
    expect(withProgress[2].totalTrials).toBe(5);
    expect(withProgress[3].totalTrials).toBe(5);
    expect(withProgress[4].totalTrials).toBe(5);

    expect(withProgress[0].x).toBe(3);
    expect(withProgress[1].x).toBe(2);
    expect(withProgress[2].x).toBe(5);
    expect(withProgress[3].x).toBe(7);
    expect(withProgress[4].x).toBe(11);
  });
});
