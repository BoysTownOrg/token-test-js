import { trialsWithProgress } from "../lib/progress.js";
import { plugin, twoSizesPlugin } from "./plugin.js";

const jsPsych = initJsPsych({
  on_finish() {
    window.close();
  },
});

const tokenPlugin = plugin(jsPsychModule);
const sizedTokenPlugin = twoSizesPlugin(jsPsychModule);

function audioResourcePath(stem) {
  return `${tokenResourcePath}/${stem}.wav`;
}

function tokenAudioResourcePath(stem) {
  return audioResourcePath(`token_${stem}`);
}

function commonTokenTrialWithFeedback(sentenceNumber, sentence, commandString) {
  return {
    sentenceNumber,
    sentenceUrl: tokenAudioResourcePath(sentenceNumber),
    sentence,
    commandString,
    timeoutMilliseconds: 10000,
    beepUrl: audioResourcePath("beep"),
    tokenDropUrl: audioResourcePath("token-drop"),
  };
}

function sizedTokenTrialWithFeedback(sentenceNumber, sentence, commandString) {
  return {
    type: sizedTokenPlugin,
    ...commonTokenTrialWithFeedback(sentenceNumber, sentence, commandString),
  };
}

function tokenTrialWithFeedback(sentenceNumber, sentence, commandString) {
  return {
    type: tokenPlugin,
    ...commonTokenTrialWithFeedback(sentenceNumber, sentence, commandString),
    boxUrl: `${tokenResourcePath}/nicubunu_Open_box.svg`,
  };
}

function arrayToHtml(lines) {
  let html = "";
  for (const line of lines) {
    html += `<p style="line-height:normal">${line}</p>`;
  }
  return html;
}

fetch(`${tokenResourcePath}/instructions.txt`)
  .then((p) => p.text())
  .then((instructionText) => {
    jsPsych.run([
      {
        type: jsPsychPreload,
        auto_preload: true,
      },
      {
        type: jsPsychSurveyText,
        questions: [
          {
            prompt: "If the ID displayed is not correct, please enter it now.",
            placeholder: jsPsych.data.urlVariables().subjectID,
          },
        ],
        preamble: "",
        button_label: "Click to enter ID",
      },
      {
        type: jsPsychHtmlButtonResponse,
        stimulus: arrayToHtml(instructionText.split("\n")),
        choices: ["Start"],
      },
      {
        timeline: trialsWithProgress([
          sizedTokenTrialWithFeedback(
            1,
            "Click on the large white circle and the small orange square.",
            "touch large white circle, touch small orange square"
          ),
          sizedTokenTrialWithFeedback(
            2,
            "Click on the small blue circle and the large brown square.",
            "touch small blue circle, touch large brown square"
          ),
          sizedTokenTrialWithFeedback(
            3,
            "Click on the large orange square and the large red square.",
            "touch large orange square, touch large red square"
          ),
          sizedTokenTrialWithFeedback(
            4,
            "Click on the large white square and the small orange circle.",
            "touch large white square, touch small orange circle"
          ),
          tokenTrialWithFeedback(
            5,
            "Put the red circle on the orange square.",
            "use red circle to touch orange square"
          ),
          tokenTrialWithFeedback(
            6,
            "Touch the blue circle with the red square.",
            "use red square to touch blue circle"
          ),
          tokenTrialWithFeedback(
            7,
            "Click on the blue circle and the red square.",
            "touch blue circle, touch red square"
          ),
          tokenTrialWithFeedback(
            8,
            "Drag the blue circle or the red square to the box.",
            "pick up blue circle or pick up red square"
          ),
          tokenTrialWithFeedback(
            9,
            "Move the orange square away from the brown square.",
            "move orange square away from brown square"
          ),
          tokenTrialWithFeedback(
            10,
            "If there is a black circle, drag the red square to the box",
            "nothing"
          ),

          // beside?
          tokenTrialWithFeedback(
            11,
            "Put the orange square beside the red circle",
            "put orange square left of red circle"
          ),

          tokenTrialWithFeedback(
            12,
            "Click on the squares first and the circles second",
            "touch red square, touch blue square, touch white square, touch brown square, touch orange square\ntouch red circle, touch blue circle, touch white circle, touch brown circle, touch orange circle"
          ),
          tokenTrialWithFeedback(
            13,
            "Put the red circle between the brown square and the orange square.",
            "put red circle between brown square and orange square"
          ),
          tokenTrialWithFeedback(
            14,
            "Click on all circles, except the orange one.",
            "touch blue circle, touch red circle, touch brown circle, touch white circle"
          ),
          tokenTrialWithFeedback(
            15,
            "Drag the red circle - no - the white square to the box.",
            "pick up white square"
          ),
          tokenTrialWithFeedback(
            16,
            "Instead of the white square, drag the brown circle to the box.",
            "pick up brown circle"
          ),
          tokenTrialWithFeedback(
            17,
            "Click on the square that is next to the square that is below the red circle",
            "touch red square"
          ),
          tokenTrialWithFeedback(
            18,
            "Using the circle that is above the white square, touch the blue circle.",
            "use brown circle to touch blue circle"
          ),
          tokenTrialWithFeedback(
            19,
            "Drag the blue circle and the red circle and the white square to the box.",
            "pick up blue circle, pick up red circle, pick up white square"
          ),
          tokenTrialWithFeedback(
            20,
            "Click on the red square and the orange square and drag the white circle and the brown square to the box.",
            "touch red square, touch orange square, pick up white circle, pick up brown square"
          ),
          tokenTrialWithFeedback(
            21,
            "Click on the blue circle and the white square and the orange square and the red circle.",
            "touch blue circle, touch white square, touch orange square, touch red circle"
          ),
          tokenTrialWithFeedback(
            22,
            "Click on the square below the circle next to the red circle.",
            "touch red square"
          ),
          tokenTrialWithFeedback(
            23,
            "Click on the red circle and the orange circle and drag the brown square to the box.",
            "touch red circle, touch orange circle, pick up brown square"
          ),
          tokenTrialWithFeedback(
            24,
            "Before clicking on the brown circle, drag the circle above the square that is next to the brown square to the box.",
            "pick up white circle\ntouch brown circle"
          ),
          tokenTrialWithFeedback(
            25,
            "Drag the brown circle and the square that is below the blue circle to the box.",
            "pick up brown circle, pick up red square"
          ),
          tokenTrialWithFeedback(
            26,
            "Using the square that is below the orange circle, touch the red square.",
            "use brown square to touch red square"
          ),
          tokenTrialWithFeedback(
            27,
            "Click on the circle that is next to the circle that is above the brown square.",
            "touch white circle"
          ),
          tokenTrialWithFeedback(
            28,
            "Drag the white square and the square that is below the red circle to the box.",
            "pick up white square, pick up blue square"
          ),
          tokenTrialWithFeedback(
            29,
            "Click on the red square and the orange square and the white circle and the brown circle.",
            "touch red square, touch orange square, touch white circle, touch brown circle"
          ),
          tokenTrialWithFeedback(
            30,
            "Drag the brown circle and the blue square and the white circle to the box.",
            "pick up brown circle, pick up blue square, pick up white circle"
          ),
          tokenTrialWithFeedback(
            31,
            "Click on the brown circle and the orange square and drag the red circle and the white square to the box.",
            "touch brown circle, touch orange square, pick up red circle, pick up white square"
          ),
          tokenTrialWithFeedback(
            32,
            "Before clicking on the red square, drag the square next to the square that is below the white circle to the box.",
            "pick up brown square or pick up white square\ntouch red square"
          ),
          tokenTrialWithFeedback(
            33,
            "Click on the circle next to the circle above the blue square.",
            "touch blue circle"
          ),
          tokenTrialWithFeedback(
            34,
            "Drag the orange square and the red circle to the box and click on the blue square.",
            "pick up orange square, pick up red circle, touch blue square"
          ),
          tokenTrialWithFeedback(
            35,
            "Using the circle that is above the orange square, touch the blue square.",
            "use white circle to touch blue square"
          ),
          tokenTrialWithFeedback(
            36,
            "Click on the square next to the square below the orange circle.",
            "touch orange square"
          ),
          tokenTrialWithFeedback(
            37,
            "Click on the square that is below the circle that is next to the orange circle.",
            "touch orange square"
          ),
          tokenTrialWithFeedback(
            38,
            "Drag the brown circle and the blue square to the box and click on the white circle.",
            "pick up brown circle, pick up blue square, touch white circle"
          ),

          tokenTrialWithFeedback(
            39,
            "Drag the orange square and the circle that is above the brown square to the box.",
            "pick up orange square, pick up orange circle"
          ),

          tokenTrialWithFeedback(
            40,
            "Click on the blue square and the white square and drag the orange circle and the red circle to the box.",
            "touch blue square, touch white square, pick up orange circle, pick up red circle"
          ),
          tokenTrialWithFeedback(
            41,
            "Click on the orange circle and the white circle and the red square and the brown circle.",
            "touch orange circle, touch white circle, touch red square, touch brown circle"
          ),
          tokenTrialWithFeedback(
            42,
            "Drag the white square and the brown square and the blue circle to the box.",
            "pick up white square, pick up brown square, pick up blue circle"
          ),
          tokenTrialWithFeedback(
            43,
            "Before clicking on the blue square, drag the circle next to the circle that is above the brown square to the box.",
            "pick up white circle\ntouch blue square"
          ),
        ]),
      },
      {
        type: jsPsychHtmlButtonResponse,
        stimulus: "Thanks for participating! Press Done to finish.",
        choices: ["Done"],
      },
    ]);
  });
