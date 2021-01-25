import { plugin } from "./plugin.js";

const tokenTestPluginId = "token-test";
jsPsych.plugins[tokenTestPluginId] = plugin();

jsPsych.init({
  timeline: [
    {
      type: tokenTestPluginId,
    },
  ],
});
