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
      type: tokenTestPluginId,
      sentence:
        "Touch the square that is next to the square that is below the red circle.",
      commandString: "touch red square",
    },
    feedback,
    {
      type: tokenTestPluginId,
      sentence:
        "Using the circle that is above the white square, touch the black circle.",
      commandString: "use yellow circle to touch black circle",
    },
    feedback,
    {
      type: tokenTestPluginId,
      sentence:
        "Pick up the black circle and the red circle and the white square",
      commandString:
        "pick up black circle, pick up red circle, pick up white square",
    },
    feedback,
    {
      type: tokenTestPluginId,
      sentence:
        "Touch the red square and the green square and pick up the white circle and the yellow square.",
      commandString:
        "touch red square, touch green square, pick up white circle, pick up yellow square",
    },
    feedback,
    {
      type: tokenTestPluginId,
      sentence:
        "Touch the black circle and the white square and the green square and the red circle.",
      commandString:
        "touch black circle, touch white square, touch green square, touch red circle",
    },
    feedback,
    {
      type: tokenTestPluginId,
      sentence: "Touch the square below the circle next to the red circle.",
      commandString: "touch red square",
    },
    feedback,
    {
      type: tokenTestPluginId,
      sentence:
        "Touch the red circle and the green circle and pick up the yellow square.",
      commandString:
        "touch red circle, touch green circle, pick up yellow square",
    },
    feedback,
    {
      type: tokenTestPluginId,
      sentence:
        "Before touching the yellow circle, pick up the circle above the square that is next to the yellow square.",
      commandString: "pick up white circle\ntouch yellow circle",
    },
    feedback,
    {
      type: tokenTestPluginId,
      sentence:
        "Pick up the yellow circle and the square that is below the black circle.",
      commandString: "pick up yellow circle, pick up red square",
    },
    feedback,
    {
      type: tokenTestPluginId,
      sentence:
        "Using the square that is below the green circle, touch the red square.",
      commandString: "use yellow square to touch red square",
    },
    feedback,
    {
      type: tokenTestPluginId,
      sentence:
        "Touch the circle that is next to the circle that is above the yellow square.",
      commandString: "touch white circle",
    },
    feedback,
    {
      type: tokenTestPluginId,
      sentence:
        "Pick up the white square and the square that is below the red circle.",
      commandString: "pick up white square, pick up black square",
    },
    feedback,
    {
      type: tokenTestPluginId,
      sentence:
        "Touch the red square and the green square and the white circle and the yellow square.",
      commandString:
        "touch red square, touch green square, touch white circle, touch yellow square",
    },
    feedback,
    {
      type: tokenTestPluginId,
      sentence:
        "Pick up the yellow circle and the black square and the white circle.",
      commandString:
        "pick up yellow circle, pick up black square, pick up white circle",
    },
    feedback,
    {
      type: tokenTestPluginId,
      sentence:
        "Touch the yellow circle and the green square and pick up the red circle and the white square.",
      commandString:
        "touch yellow circle, touch green square, pick up red circle, pick up white square",
    },
    feedback,
    {
      type: tokenTestPluginId,
      sentence:
        "Before touching the red square, pick up the square next to the square that is below the white circle.",
      commandString: "pick up yellow square\ntouch red square",
    },
    feedback,
    {
      type: tokenTestPluginId,
      sentence: "Touch the circle next to the circle above the black square.",
      commandString: "touch black circle",
    },
    feedback,
    {
      type: tokenTestPluginId,
      sentence:
        "Pick up the green square and the red circle and touch the black square.",
      commandString:
        "pick up green square, pick up red circle, touch black square",
    },
    feedback,
    {
      type: tokenTestPluginId,
      sentence:
        "Using the circle that is above the green square, touch the black square.",
      commandString: "use white circle to touch black square",
    },
    feedback,
    {
      type: tokenTestPluginId,
      sentence: "Touch the square next to the square below the green circle.",
      commandString: "touch green square",
    },
    feedback,
    {
      type: tokenTestPluginId,
      sentence:
        "Touch the square that is below the circle that is next to the green circle.",
      commandString: "touch green square",
    },
    feedback,
    {
      type: tokenTestPluginId,
      sentence:
        "Pick up the yellow circle and the black square and touch the white circle.",
      commandString:
        "pick up yellow circle, pick up black square, touch white circle",
    },
    feedback,
    {
      type: tokenTestPluginId,
      sentence:
        "Pick up the green square and the circle that is above the yellow square.",
      commandString: "pick up green square, pick up green circle",
    },
    feedback,
    {
      type: tokenTestPluginId,
      sentence:
        "Touch the black square and the white square and pick up the green circle and the red square.",
      commandString:
        "touch black square, touch white square, pick up green circle, pick up red square",
    },
    feedback,
    {
      type: tokenTestPluginId,
      sentence:
        "Touch the green circle and the white circle and the red square and the yellow circle.",
      commandString:
        "touch green circle, touch white circle, touch red square, touch yellow circle",
    },
    feedback,
    {
      type: tokenTestPluginId,
      sentence:
        "Pick up the white square and the yellow square and the black circle.",
      commandString:
        "pick up white square, pick up yellow square, pick up black circle",
    },
    feedback,
    {
      type: tokenTestPluginId,
      sentence:
        "Before touching the black square, pick up the circle next to the circle that is above the yellow square.",
      commandString: "pick up white circle\ntouch black square",
    },
    feedback,
  ],
});
