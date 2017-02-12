let watched = {};

const getTextFromAria = (el) => {
    const ariaLabel = el.hasAttribute('aria-label');
    const ariaLabeledBy = el.hasAttribute('aria-labelledby');
    const ariaDescribedBy = el.hasAttribute('aria-describedby');

    let text = '';

    if (ariaLabel) {
        text += `Label: ${el.getAttribute('aria-label')}.`;
    } else if (ariaLabeledBy) {
        const ariaLabeledByEl = document.getElementById('aria-labelledby');

        if (ariaLabeledByEl && ariaLabeledByEl.textContent) {
            text += `Label: ${ariaLabeledByEl.textContent}.`;
        }
    }

    if (ariaDescribedBy) {
        const ariaDescribedByEl = document.getElementById('aria-describedby');

        if (ariaDescribedByEl && ariaDescribedByEl.textContent) {
            text += `Description: ${ariaDescribedByEl.textContent}`;
        }
    }

    return text;
};

const getTextFromCommonAttributes = (el) => {
    const title = el.hasAttribute('title');
    const placeHolder = el.hasAttribute('placeholder');
    const id = el.hasAttribute('id');
};

const getTextFromSelectionEl = (el) => {
    const ariaText = getTextFromAria(el);

    for (let key of attributes) {
        console.log(key);
    }

};

const elementActions = {
    SELECT: getTextFromSelectionEl
};

export default {
    isElementHidden(el) {
        const computedStyle = window.getComputedStyle(el);
        return computedStyle.display === 'none' || computedStyle.visibility === 'hidden' || computedStyle.opacity === '0' || el.tagName === 'NOSCRIPT' && (el.offsetWidth === 0 || el.offsetHeight === 0);
    },
    isElementInViewport(el) {
        const rect = el.getBoundingClientRect();

        return rect.top >= 0 && rect.left >= 0 && rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && rect.right <= (window.innerWidth || document.documentElement.clientWidth);
    },
    watch(id, el, callback) {
        if (watched[id]) { return; }

        watched[id] = {
            lastEl: el,
            interval: setInterval(() => {
                if (watched[id].lastEl !== document.activeElement) {
                    watched[id].lastEl = document.activeElement;
                    callback.call(this, watched[id].lastEl);
                }
            }, 200)
        };
    },
    findParentLink: (target) => {
        let i = 0;
        let tmp = target;

        while (target && target.tagName !== 'A' && i < 5) {
            tmp = tmp.parentElement;
            if (tmp.tagName === 'A') {
                break;
            }
            i += 1;
        }

        return tmp.tagName === 'A' ? tmp : target;
    },

    getAttribute: (el, refAttr) => {
        while(el && el.parentElement) {
            if (el.getAttribute(refAttr)) {
                return el.getAttribute(refAttr);
            } else {
                el = el.parentElement;
            }
        }
        return false;
    }
};