var alphabet = {
    'آ': {
        default: 'a'
    },
    'ا': {
        default: 'á',
        followedBy: {
            '*': ''
        },
        precededBy: {
            '*': ''
        }
    },
    'ب': {
        default: 'b',
        followedBy: {
            'ر': 'bá',
            'ک': 'bá',
            'ا': 'ba'
        }
    },
    'پ': {
        default: 'p',
        followedBy: {
            'ن': 'pá',
            'ا': 'pa'
        }
    },
    'ت': {
        default: 't',
        followedBy: {
            'ق': 'te',
            'ا': 'ta',
            'ه': 'te'
        }
    },
    'ث': {
        default: 'c'
    },
    'ج': {
        default: 'dzsa',
        precededBy: {
            '*': 'dzs',
            'ا': 'dzsa'
        },
        followedBy: {
            'م': 'dzso'
        }
    },
    'چ': {
        default: 'Cs',
        followedBy: {
            'ا': 'Csa'
        }
    },
    'ح': {
        default: 'H',
        followedBy: {
            'ض': 'há'
        }
    },
    'خ': {
        default: 'h',
        followedBy: {
            'ر': 'há'
        }
    },
    'د': {
        default: 'd',
        followedBy: {
            'م': 'dá',
            'ه': 'dá',
            'ر': 'dá',
            'ا': 'da',
            'و': 'do'
        }
    },
    'ذ': {
        default: 'z',
        followedBy: {
            'ا': 'za'
        }
    },
    'ر': {
        default: 'r',
        followedBy: {
            'ک': 'r',
            'ش': 're',
            'د': 're',
            'ا': 'ra',
            'ت': 'rá'
        },
        precededBy: {
        }
    },
    'ز': {
        default: 'z',
        followedBy: {
            'ا': 'za'
        }
    },
    'ژ': {
        default: 'Zs',
        followedBy: {
            'ا': 'Zsa'
        }

    },
    'س': {
        default: 'Sz',
        followedBy: {
            'ا': 'Sza'
        },
        precededBy: {
            'ا': 'eSz',
            'ی': 'sz'
        }
    },
    'ش': {
        default: 'Si',
        followedBy: {
            'ر': 'se',
            'ش': 'Si',
            'د': 'so',
            'ن': 'sa',
            'ب': 'sa',
            'ا': 'sa'
        },
        precededBy: {
            '*': 'ss'
        }
    },
    'ص': {
        default: 'c',
        followedBy: {
            'د': 'ce',
            'ا': 'ca'
        },
        precededBy: {

        }
    },
    'ض': {
      default: 'z'
    },
    'ط': {
        default: 't'
    },
    'ظ': {
        default: 'z',
        followedBy: {
        }
    },
    'ع': {
        default: 'Á'
    },
    'غ': {
        default: 'g'
    },
    'ف': {
        default: 'f',
        precededBy: {
        },
        followedBy: {
            'ا': 'fa'
        }
    },
    'ق': {
        default: 'g',
        followedBy: {
            'ا': 'ga'
        }
    },
    'ک': {
        default: 'k',
        followedBy: {
          'ت': 'ka',
          'ا': 'ka'
        }
    },
    'گ': {
        default: 'g',
        followedBy: {
            'ز': 'go',
            'ا': 'ga',
            'ل': 'ge'
        }
    },
    'ل': {
        default: 'l',
        followedBy: {
            'ا': 'la',
            'ت': 'lá'
        }
    },
    'م': {
        default: 'm',
        followedBy: {
            'ا': 'ma'
        }
    },
    'ن': {
        default: 'n',
        followedBy: {
            'ف': 'ná',
            'ا': 'na'
        },
        precededBy: {
            'ا': 'en'
        }
    },
    'و': {
        default: 'vá',
        followedBy: {
            'ا': 'v',
            undefined: '',
            'ظ': 'o'
        },
        precededBy: {
            'ه': 'hő',
            'خ': 'o',
            'د': 'o'
        }
    },
    'ه': {
        default: 'h',
        precededBy: {
            'س': 'e',
            'ن': 'o',
            'د': '',
            'چ': 'a',
            'ب': 'e',
            'ی': 'jée',
            'ک': 'e',
            'ا': 'ha'
        },
        followedBy: {
            'ف': 'há',
            'ش': 'há',
            'ا': 'ha'
        }
    },
    'ی': {
        default: 'é',
        followedBy: {
            'ک': 'Je',
            'ا': 'Ja',
            'س': 'í'
        },
        precededBy: {
            'ا': 'í',
            'م': 'í'
        }
    },
    '،': ' -- ',
    '۱': {
        default: 'Jek'
    },
    '۲': {
        default: 'do'
    },
    '۳': {
        default: 'Sze'
    },
    '۴': {
        default: 'Csahar'
    },
    '۵': {
        default: 'pándzs'
    },
    '۶': {
        default: 'Siss'
    },
    '۷': {
        default: 'háft'
    },
    '۸': {
        default: 'hásst'
    },
    '۹': {
        default: 'no'
    },
    '۰': {
        default: 'cefr'
    }
};



var text = 'یک دو سه چهار پنج شش هفت هشت نه ده',
    speech = window.speechSynthesis,
    say = text.replace(/[\u0626-\u0700]+/gi, function (word, idx, sentence) {
        return word.replace(/[\u0626-\u0700]/gi, function (letter, idx, word2) {
                var followedBy = alphabet[letter].followedBy,
                    followedByExists = followedBy && followedBy[word2[idx + 1]],
                    precededBy = alphabet[letter].precededBy,
                    precededByExists = precededBy && (typeof precededBy[word2[idx - 1]] === 'string' ? precededBy[word2[idx - 1]] : alphabet[letter].precededBy['*']),
                    str = (typeof followedByExists === 'string' ? followedByExists : (typeof precededByExists === 'string' ? precededByExists : alphabet[letter].default));

                console.warn(str);
                return str;
            });
    }),
    utter = new SpeechSynthesisUtterance(say); utter.rate = 1.0;
utter.voice = window.speechSynthesis.getVoices().filter(function (voice) {
    return voice.name == 'Mariska';
})[0];
speech.speak(utter);
