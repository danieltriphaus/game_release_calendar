const REGEX = {
    nonAlhpanumericChars: new RegExp("[^a-zA-Z0-9 ]"),
    fillWords: /\b(the|and|or|of)\b/,
    extraSpaces: /\s+/,
};

export const arePhrasesEquivalent = (phrases) => {
    const normalizedPhrases = phrases.map((phrase) => {
        return phrase
            .toLowerCase()
            .replace(REGEX.nonAlhpanumericChars, "")
            .replace(REGEX.fillWords, "")
            .replace(REGEX.extraSpaces, " ");
    });
    return normalizedPhrases.every((normalizedPhrase) => normalizedPhrase === normalizedPhrases[0]);
};