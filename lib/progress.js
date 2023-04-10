export function trialsWithProgress(trials, jsPsych) {
  for (let i = 0; i < trials.length; i++) {
    trials[i].totalTrials = trials.length;
    trials[i].currentTrial = i + 1;
    trials[i].on_finish = function () {
      jsPsych.setProgressBar((i + 1) / trials.length);
    };
  }
  return trials;
}
