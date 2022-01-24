export function trialsWithProgress(trials) {
  for (let i = 0; i < trials.length; i++) {
    trials[i].totalTrials = trials.length;
    trials[i].currentTrial = i + 1;
  }
  return trials;
}
