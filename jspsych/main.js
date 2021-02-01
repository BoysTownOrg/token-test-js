import { plugin } from "./plugin.js";

const tokenTestPluginId = "token-test";
jsPsych.plugins[tokenTestPluginId] = plugin();

jsPsych.init({
  timeline: [
    {
      type: tokenTestPluginId,
    },
    {
      type: "html-button-response",
      stimulus() {
        return jsPsych.data.getLastTrialData().values()[0].correct
          ? `<p style="line-height:normal">"Good Job!"</p>`
          : `<p style="line-height:normal">"Too bad."</p>`;
      },
      choices: ["Continue"],
    },
  ],
});
