import { plugin } from "./plugin.js";

const tokenTestPluginId = "token-test";
jsPsych.plugins[tokenTestPluginId] = plugin();
const feedback = {
  type: "html-button-response",
  stimulus() {
    return jsPsych.data.getLastTrialData().values()[0].correct
      ? `<p style="line-height:normal">"Good Job!"</p>`
      : `<p style="line-height:normal">"Try again."</p>`;
  },
  choices: ["Continue"],
}

jsPsych.init({
  timeline: [
    {
      type: tokenTestPluginId,
      sentence: "Touch the square that is next to the square that is below the red circle.",
      commandString: "touch red square"
    },
    feedback,
    {
      type: tokenTestPluginId,
      sentence: "Using the circle that is above the white square, touch the blue circle.",
      commandString: "use yellow circle to touch blue circle"
    },
    feedback,
    {
      type: tokenTestPluginId,
      sentence: "Touch the blue circle and the white square and the green square and the red circle.",
      commandString: "touch blue circle, touch white square, touch green square, touch red circle"
    },
    feedback,
    {
      type: tokenTestPluginId,
      sentence: "Touch the square below the circle next to the red circle.",
      commandString: "touch red square"
    },
    feedback,
    {
      type: tokenTestPluginId,
      sentence: "Using the square that is below the green circle, touch the red square",
      commandString: "use yellow square to touch red square"
    },
    feedback
  ],
});
