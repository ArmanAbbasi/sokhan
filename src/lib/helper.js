export default {
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