
export const parseSentence = (sentence: string): string[] => {
  return sentence.split('_____________');
};

export const checkAnswers = (selected: (string | null)[], correct: string[]): boolean => {
  if (selected.length !== correct.length) return false;
  
  for (let i = 0; i < selected.length; i++) {
    if (selected[i] !== correct[i]) {
      return false;
    }
  }
  
  return true;
};
