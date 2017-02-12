let state = {
    sokhanActive: true,
    speechRate: 1.0
};

export default {
    setSokhanActive: (isSokhanActive = true) => {
        state.sokhanActive = isSokhanActive;
    },
    getSokhanActive: () => state.sokhanActive,
    getSpeechRate: () => state.speechRate,
    incrementSpeechRate: () => {
        state.speechRate += 1;
    },
    decrementSpeechRate: () => {
        state.speechRate -= 1;
    }
};