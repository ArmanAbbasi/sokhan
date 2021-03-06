let state = {
    sokhanActive: true,
    speechRate: 1.0,
    gender: 'male'
};

export default {
    setSokhanActive: (isSokhanActive = true) => {
        state.sokhanActive = isSokhanActive;
    },
    toggleSokhanActive: () => {
        state.sokhanActive = !state.sokhanActive;
        return state.sokhanActive;
    },
    getSokhanActive: () => state.sokhanActive,
    getSpeechRate: () => state.speechRate,
    incrementSpeechRate: () => {
        state.speechRate += 1;
    },
    decrementSpeechRate: () => {
        state.speechRate -= 1;
    },
    setGender: (gender) => {
        state.gender = gender;
    },
    getGender: () => {
        return state.gender;
    }
};