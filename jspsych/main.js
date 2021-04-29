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

function sizedTokenTrialWithFeedback(sentenceUrl, commandString) {
  return [
    {
      type: twoSizesTokenTestPluginId,
      sentenceUrl,
      commandString,
      timeoutMilliseconds: 10000,
    },
    feedback,
  ];
}

function tokenTrialWithFeedback(sentenceUrl, commandString) {
  return [
    {
      type: tokenTestPluginId,
      sentenceUrl,
      commandString,
      timeoutMilliseconds: 10000,
    },
    feedback,
  ];
}

function audioResourcePath(stem) {
  return `token-resources/${stem}.wav`;
}

jsPsych.init({
  timeline: [
    // A
    ...sizedTokenTrialWithFeedback(
      audioResourcePath(20),
      "pick up large white circle, pick up small green square"
    ),
    ...sizedTokenTrialWithFeedback(
      audioResourcePath(21),
      "pick up small blue circle, pick up large yellow square"
    ),
    ...sizedTokenTrialWithFeedback(
      audioResourcePath(22),
      "pick up large green square, pick up large red square"
    ),
    ...sizedTokenTrialWithFeedback(
      audioResourcePath(23),
      "pick up large white square, pick up small green circle"
    ),
    // B
    ...tokenTrialWithFeedback(
      audioResourcePath(24),
      "use red circle to touch green square"
    ),
    ...tokenTrialWithFeedback(
      audioResourcePath(26),
      "use red square to touch blue circle"
    ),
    ...tokenTrialWithFeedback(
      audioResourcePath(27),
      "touch blue circle, touch red square"
    ),
    ...tokenTrialWithFeedback(
      audioResourcePath(28),
      "pick up blue circle or pick up red square"
    ),
    ...tokenTrialWithFeedback(
      audioResourcePath(29),
      "move green square away from yellow square"
    ),
    ...tokenTrialWithFeedback(audioResourcePath(31), "nothing"),
    ...tokenTrialWithFeedback(
      audioResourcePath(32),
      "pick up green square, pick up red square, pick up blue square, pick up white square"
    ),
    // Put the green square beside ...
    // Touch the squares slowly ...
    ...tokenTrialWithFeedback(
      audioResourcePath(35),
      "put red circle between yellow square and green square"
    ),
    ...tokenTrialWithFeedback(
      audioResourcePath(36),
      "touch blue circle, touch red circle, touch yellow circle, touch white circle"
    ),
    ...tokenTrialWithFeedback(audioResourcePath(37), "pick up white square"),
    ...tokenTrialWithFeedback(audioResourcePath(38), "pick up yellow circle"),
    ...tokenTrialWithFeedback(
      audioResourcePath(39),
      "pick up yellow circle, pick up blue circle"
    ),
    // C
    ...tokenTrialWithFeedback(audioResourcePath(40), "touch red square"),
    ...tokenTrialWithFeedback(
      audioResourcePath(41),
      "use yellow circle to touch blue circle"
    ),
    ...tokenTrialWithFeedback(
      audioResourcePath(42),
      "pick up blue circle, pick up red circle, pick up white square"
    ),
    ...tokenTrialWithFeedback(
      audioResourcePath(43),
      "touch red square, touch green square, pick up white circle, pick up yellow square"
    ),
    ...tokenTrialWithFeedback(
      audioResourcePath(44),
      "touch blue circle, touch white square, touch green square, touch red circle"
    ),
    ...tokenTrialWithFeedback(audioResourcePath(45), "touch red square"),
    ...tokenTrialWithFeedback(
      audioResourcePath(46),
      "touch red circle, touch green circle, pick up yellow square"
    ),
    ...tokenTrialWithFeedback(
      audioResourcePath(47),
      "pick up white circle\ntouch yellow circle"
    ),
    ...tokenTrialWithFeedback(
      audioResourcePath(48),
      "pick up yellow circle, pick up red square"
    ),
    ...tokenTrialWithFeedback(
      audioResourcePath(49),
      "use yellow square to touch red square"
    ),
    ...tokenTrialWithFeedback(audioResourcePath(50), "touch white circle"),
    ...tokenTrialWithFeedback(
      audioResourcePath(51),
      "pick up white square, pick up blue square"
    ),
    ...tokenTrialWithFeedback(
      audioResourcePath(52),
      "touch red square, touch green square, touch white circle, touch yellow square"
    ),
    ...tokenTrialWithFeedback(
      audioResourcePath(53),
      "pick up yellow circle, pick up blue square, pick up white circle"
    ),
    ...tokenTrialWithFeedback(
      audioResourcePath(54),
      "touch yellow circle, touch green square, pick up red circle, pick up white square"
    ),
    ...tokenTrialWithFeedback(
      audioResourcePath(55),
      "pick up yellow square\ntouch red square"
    ),
    ...tokenTrialWithFeedback(audioResourcePath(56), "touch blue circle"),
    ...tokenTrialWithFeedback(
      audioResourcePath(57),
      "pick up green square, pick up red circle, touch blue square"
    ),
    ...tokenTrialWithFeedback(
      audioResourcePath(58),
      "use white circle to touch blue square"
    ),
    ...tokenTrialWithFeedback(audioResourcePath(59), "touch green square"),
    ...tokenTrialWithFeedback(audioResourcePath(60), "touch green square"),
    ...tokenTrialWithFeedback(
      audioResourcePath(61),
      "pick up yellow circle, pick up blue square, touch white circle"
    ),
    ...tokenTrialWithFeedback(
      audioResourcePath(62),
      "pick up green square, pick up green circle"
    ),
    ...tokenTrialWithFeedback(
      audioResourcePath(63),
      "touch blue square, touch white square, pick up green circle, pick up red square"
    ),
    ...tokenTrialWithFeedback(
      audioResourcePath(64),
      "touch green circle, touch white circle, touch red square, touch yellow circle"
    ),
    ...tokenTrialWithFeedback(
      audioResourcePath(65),
      "pick up white square, pick up yellow square, pick up blue circle"
    ),
    ...tokenTrialWithFeedback(
      audioResourcePath(66),
      "pick up white circle\ntouch blue square"
    ),
  ],
});
