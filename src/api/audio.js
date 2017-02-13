/**
 * Copyright (C) 2016  Arman Abbasi
 *
 * Sokhan is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>
 */
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