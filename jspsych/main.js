import { plugin, twoSizesPlugin } from "./plugin.js";

const tokenTestPluginId = "token-test";
const twoSizesTokenTestPluginId = "two-sizes-token-test";
jsPsych.plugins[tokenTestPluginId] = plugin();
jsPsych.plugins[twoSizesTokenTestPluginId] = twoSizesPlugin();
const feedback = {
  type: "html-button-response",
  stimulus() {
    return jsPsych.data.getLastTrialData().values()[0].correct
      ? '<p style="line-height:normal">"Good Job!"</p>'
      : `<p style="line-height:normal">"Try again."</p>`;
  },
  choices: ["Continue"],
};

function sizedTokenTrialWithFeedback(sentence, commandString) {
  return [
    {
      type: twoSizesTokenTestPluginId,
      sentence,
      commandString,
      timeoutMilliseconds: 10000,
    },
    feedback,
  ];
}

function tokenTrialWithFeedback(sentence, commandString) {
  return [
    {
      type: tokenTestPluginId,
      sentence,
      commandString,
      timeoutMilliseconds: 10000,
    },
    feedback,
  ];
}

jsPsych.init({
  timeline: [
    // A
    ...sizedTokenTrialWithFeedback(
      "Take the large white circle and the small blue square.",
      "pick up large white circle, pick up small blue square"
    ),
    ...sizedTokenTrialWithFeedback(
      "Take the small black circle and the large yellow square.",
      "pick up small black circle, pick up large yellow square"
    ),
    ...sizedTokenTrialWithFeedback(
      "Take the large blue square and the large red square.",
      "pick up large blue square, pick up large red square"
    ),
    ...sizedTokenTrialWithFeedback(
      "Take the large white square and the small blue circle.",
      "pick up large white square, pick up small blue circle"
    ),
    // B
    ...tokenTrialWithFeedback(
      "Put the red circle on the blue square.",
      "use red circle to touch blue square"
    ),
    ...tokenTrialWithFeedback(
      "Touch the black circle with the red square.",
      "use red square to touch black circle"
    ),
    ...tokenTrialWithFeedback(
      "Touch the black circle and the red square.",
      "touch black circle, touch red square"
    ),
    ...tokenTrialWithFeedback(
      "Pick up the black circle OR the red square.",
      "pick up black circle or pick up red square"
    ),
    ...tokenTrialWithFeedback(
      "Move the blue square away from the yellow square.",
      "move blue square away from yellow square"
    ),
    ...tokenTrialWithFeedback(
      "If there is a black circle, pick up the red square.",
      "pick up red square"
    ),
    // Put the green square beside ...
    // Touch the squares slowly ...
    ...tokenTrialWithFeedback(
      "Put the red circle between the yellow square and the blue square.",
      "put red circle between yellow square and blue square"
    ),
    ...tokenTrialWithFeedback(
      "Touch all circles, except the blue one.",
      "touch black circle, touch red circle, touch yellow circle, touch white circle"
    ),
    ...tokenTrialWithFeedback(
      "Pick up the red circle - no - the white square.",
      "pick up white square"
    ),
    ...tokenTrialWithFeedback(
      "Instead of the white square, pick up the yellow circle.",
      "pick up yellow circle"
    ),
    ...tokenTrialWithFeedback(
      "Together with the yellow circle, pick up the black circle",
      "pick up yellow circle, pick up black circle"
    ),
    // C
    ...tokenTrialWithFeedback(
      "Touch the square that is next to the square that is below the red circle.",
      "touch red square"
    ),
    ...tokenTrialWithFeedback(
      "Using the circle that is above the white square, touch the black circle.",
      "use yellow circle to touch black circle"
    ),
    ...tokenTrialWithFeedback(
      "Pick up the black circle and the red circle and the white square",
      "pick up black circle, pick up red circle, pick up white square"
    ),
    ...tokenTrialWithFeedback(
      "Touch the red square and the blue square and pick up the white circle and the yellow square.",
      "touch red square, touch blue square, pick up white circle, pick up yellow square"
    ),
    ...tokenTrialWithFeedback(
      "Touch the black circle and the white square and the blue square and the red circle.",
      "touch black circle, touch white square, touch blue square, touch red circle"
    ),
    ...tokenTrialWithFeedback(
      "Touch the square below the circle next to the red circle.",
      "touch red square"
    ),
    ...tokenTrialWithFeedback(
      "Touch the red circle and the blue circle and pick up the yellow square.",
      "touch red circle, touch blue circle, pick up yellow square"
    ),
    ...tokenTrialWithFeedback(
      "Before touching the yellow circle, pick up the circle above the square that is next to the yellow square.",
      "pick up white circle\ntouch yellow circle"
    ),
    ...tokenTrialWithFeedback(
      "Pick up the yellow circle and the square that is below the black circle.",
      "pick up yellow circle, pick up red square"
    ),
    ...tokenTrialWithFeedback(
      "Using the square that is below the blue circle, touch the red square.",
      "use yellow square to touch red square"
    ),
    ...tokenTrialWithFeedback(
      "Touch the circle that is next to the circle that is above the yellow square.",
      "touch white circle"
    ),
    ...tokenTrialWithFeedback(
      "Pick up the white square and the square that is below the red circle.",
      "pick up white square, pick up black square"
    ),
    ...tokenTrialWithFeedback(
      "Touch the red square and the blue square and the white circle and the yellow square.",
      "touch red square, touch blue square, touch white circle, touch yellow square"
    ),
    ...tokenTrialWithFeedback(
      "Pick up the yellow circle and the black square and the white circle.",
      "pick up yellow circle, pick up black square, pick up white circle"
    ),
    ...tokenTrialWithFeedback(
      "Touch the yellow circle and the blue square and pick up the red circle and the white square.",
      "touch yellow circle, touch blue square, pick up red circle, pick up white square"
    ),
    ...tokenTrialWithFeedback(
      "Before touching the red square, pick up the square next to the square that is below the white circle.",
      "pick up yellow square\ntouch red square"
    ),
    ...tokenTrialWithFeedback(
      "Touch the circle next to the circle above the black square.",
      "touch black circle"
    ),
    ...tokenTrialWithFeedback(
      "Pick up the blue square and the red circle and touch the black square.",
      "pick up blue square, pick up red circle, touch black square"
    ),
    ...tokenTrialWithFeedback(
      "Using the circle that is above the blue square, touch the black square.",
      "use white circle to touch black square"
    ),
    ...tokenTrialWithFeedback(
      "Touch the square next to the square below the blue circle.",
      "touch blue square"
    ),
    ...tokenTrialWithFeedback(
      "Touch the square that is below the circle that is next to the blue circle.",
      "touch blue square"
    ),
    ...tokenTrialWithFeedback(
      "Pick up the yellow circle and the black square and touch the white circle.",
      "pick up yellow circle, pick up black square, touch white circle"
    ),
    ...tokenTrialWithFeedback(
      "Pick up the blue square and the circle that is above the yellow square.",
      "pick up blue square, pick up blue circle"
    ),
    ...tokenTrialWithFeedback(
      "Touch the black square and the white square and pick up the blue circle and the red square.",
      "touch black square, touch white square, pick up blue circle, pick up red square"
    ),
    ...tokenTrialWithFeedback(
      "Touch the blue circle and the white circle and the red square and the yellow circle.",
      "touch blue circle, touch white circle, touch red square, touch yellow circle"
    ),
    ...tokenTrialWithFeedback(
      "Pick up the white square and the yellow square and the black circle.",
      "pick up white square, pick up yellow square, pick up black circle"
    ),
    ...tokenTrialWithFeedback(
      "Before touching the black square, pick up the circle next to the circle that is above the yellow square.",
      "pick up white circle\ntouch black square"
    ),
  ],
});
