/* global Audio */

const createAudioInstance = (filePath) => new Audio(filePath);

const sounds = {
    open: createAudioInstance('sound/open.mp3'),
    ding: createAudioInstance('sound/ding.mp3'),
    trash: createAudioInstance('sound/trash.mp3'),
    swoosh: createAudioInstance('sound/swoosh.mp3'),
    volume: createAudioInstance('sound/volume.mp3')
};

export default {
    play: (type) => {
        if (sounds[type]) {
            sounds[type].play();
        }
    }
};