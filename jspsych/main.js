import { plugin, twoSizesPlugin } from "./plugin.js";

const tokenTestPluginId = "token-test";
const twoSizesTokenTestPluginId = "two-sizes-token-test";
jsPsych.plugins[tokenTestPluginId] = plugin();
jsPsych.plugins[twoSizesTokenTestPluginId] = twoSizesPlugin();
const feedback = {
  type: "html-button-response",
  stimulus() {
    return jsPsych.data.getLastTrialData().values()[0].correct
      ? `<p style="line-height:normal">"Good Job!"</p>`
      : `<p style="line-height:normal">"Try again."</p>`;
  },
  choices: ["Continue"],
};

jsPsych.init({
  timeline: [
    {
      type: twoSizesTokenTestPluginId,
      sentence:
        "Take the large white circle and the small blue square.",
      commandString: "pick up large white circle, pick up small blue square",
      timeoutMilliseconds: 10000,
    },
    feedback,
    {
      type: tokenTestPluginId,
      sentence:
        "Touch the square that is next to the square that is below the red circle.",
      commandString: "touch red square",
      timeoutMilliseconds: 10000,
    },
    feedback,
    {
      type: tokenTestPluginId,
      sentence:
        "Using the circle that is above the white square, touch the black circle.",
      commandString: "use yellow circle to touch black circle",
      timeoutMilliseconds: 10000,
    },
    feedback,
    {
      type: tokenTestPluginId,
      sentence:
        "Pick up the black circle and the red circle and the white square",
      commandString:
        "pick up black circle, pick up red circle, pick up white square",
      timeoutMilliseconds: 10000,
    },
    feedback,
    {
      type: tokenTestPluginId,
      sentence:
        "Touch the red square and the blue square and pick up the white circle and the yellow square.",
      commandString:
        "touch red square, touch blue square, pick up white circle, pick up yellow square",
      timeoutMilliseconds: 10000,
    },
    feedback,
    {
      type: tokenTestPluginId,
      sentence:
        "Touch the black circle and the white square and the blue square and the red circle.",
      commandString:
        "touch black circle, touch white square, touch blue square, touch red circle",
      timeoutMilliseconds: 10000,
    },
    feedback,
    {
      type: tokenTestPluginId,
      sentence: "Touch the square below the circle next to the red circle.",
      commandString: "touch red square",
      timeoutMilliseconds: 10000,
    },
    feedback,
    {
      type: tokenTestPluginId,
      sentence:
        "Touch the red circle and the blue circle and pick up the yellow square.",
      commandString:
        "touch red circle, touch blue circle, pick up yellow square",
      timeoutMilliseconds: 10000,
    },
    feedback,
    {
      type: tokenTestPluginId,
      sentence:
        "Before touching the yellow circle, pick up the circle above the square that is next to the yellow square.",
      commandString: "pick up white circle\ntouch yellow circle",
      timeoutMilliseconds: 10000,
    },
    feedback,
    {
      type: tokenTestPluginId,
      sentence:
        "Pick up the yellow circle and the square that is below the black circle.",
      commandString: "pick up yellow circle, pick up red square",
      timeoutMilliseconds: 10000,
    },
    feedback,
    {
      type: tokenTestPluginId,
      sentence:
        "Using the square that is below the blue circle, touch the red square.",
      commandString: "use yellow square to touch red square",
      timeoutMilliseconds: 10000,
    },
    feedback,
    {
      type: tokenTestPluginId,
      sentence:
        "Touch the circle that is next to the circle that is above the yellow square.",
      commandString: "touch white circle",
      timeoutMilliseconds: 10000,
    },
    feedback,
    {
      type: tokenTestPluginId,
      sentence:
        "Pick up the white square and the square that is below the red circle.",
      commandString: "pick up white square, pick up black square",
      timeoutMilliseconds: 10000,
    },
    feedback,
    {
      type: tokenTestPluginId,
      sentence:
        "Touch the red square and the blue square and the white circle and the yellow square.",
      commandString:
        "touch red square, touch blue square, touch white circle, touch yellow square",
      timeoutMilliseconds: 10000,
    },
    feedback,
    {
      type: tokenTestPluginId,
      sentence:
        "Pick up the yellow circle and the black square and the white circle.",
      commandString:
        "pick up yellow circle, pick up black square, pick up white circle",
      timeoutMilliseconds: 10000,
    },
    feedback,
    {
      type: tokenTestPluginId,
      sentence:
        "Touch the yellow circle and the blue square and pick up the red circle and the white square.",
      commandString:
        "touch yellow circle, touch blue square, pick up red circle, pick up white square",
      timeoutMilliseconds: 10000,
    },
    feedback,
    {
      type: tokenTestPluginId,
      sentence:
        "Before touching the red square, pick up the square next to the square that is below the white circle.",
      commandString: "pick up yellow square\ntouch red square",
      timeoutMilliseconds: 10000,
    },
    feedback,
    {
      type: tokenTestPluginId,
      sentence: "Touch the circle next to the circle above the black square.",
      commandString: "touch black circle",
      timeoutMilliseconds: 10000,
    },
    feedback,
    {
      type: tokenTestPluginId,
      sentence:
        "Pick up the blue square and the red circle and touch the black square.",
      commandString:
        "pick up blue square, pick up red circle, touch black square",
      timeoutMilliseconds: 10000,
    },
    feedback,
    {
      type: tokenTestPluginId,
      sentence:
        "Using the circle that is above the blue square, touch the black square.",
      commandString: "use white circle to touch black square",
      timeoutMilliseconds: 10000,
    },
    feedback,
    {
      type: tokenTestPluginId,
      sentence: "Touch the square next to the square below the blue circle.",
      commandString: "touch blue square",
      timeoutMilliseconds: 10000,
    },
    feedback,
    {
      type: tokenTestPluginId,
      sentence:
        "Touch the square that is below the circle that is next to the blue circle.",
      commandString: "touch blue square",
      timeoutMilliseconds: 10000,
    },
    feedback,
    {
      type: tokenTestPluginId,
      sentence:
        "Pick up the yellow circle and the black square and touch the white circle.",
      commandString:
        "pick up yellow circle, pick up black square, touch white circle",
      timeoutMilliseconds: 10000,
    },
    feedback,
    {
      type: tokenTestPluginId,
      sentence:
        "Pick up the blue square and the circle that is above the yellow square.",
      commandString: "pick up blue square, pick up blue circle",
      timeoutMilliseconds: 10000,
    },
    feedback,
    {
      type: tokenTestPluginId,
      sentence:
        "Touch the black square and the white square and pick up the blue circle and the red square.",
      commandString:
        "touch black square, touch white square, pick up blue circle, pick up red square",
      timeoutMilliseconds: 10000,
    },
    feedback,
    {
      type: tokenTestPluginId,
      sentence:
        "Touch the blue circle and the white circle and the red square and the yellow circle.",
      commandString:
        "touch blue circle, touch white circle, touch red square, touch yellow circle",
      timeoutMilliseconds: 10000,
    },
    feedback,
    {
      type: tokenTestPluginId,
      sentence:
        "Pick up the white square and the yellow square and the black circle.",
      commandString:
        "pick up white square, pick up yellow square, pick up black circle",
      timeoutMilliseconds: 10000,
    },
    feedback,
    {
      type: tokenTestPluginId,
      sentence:
        "Before touching the black square, pick up the circle next to the circle that is above the yellow square.",
      commandString: "pick up white circle\ntouch black square",
      timeoutMilliseconds: 10000,
    },
    feedback,
  ],
});
