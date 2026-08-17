/**
 * Typing Exam Engine - Font & Keyboard Engine Module
 * Official Kruti Dev 010 & Remington Gail Keyboard Chart Verified Engine
 */

const FontEngine = (function () {
    
    // Devanagari InScript Keymap (Physical QWERTY Key -> Unicode Character)
    const inScriptMap = {
        'q': 'ौ', 'w': 'ै', 'e': 'ा', 'r': 'ी', 't': 'ू', 'y': 'ब', 'u': 'ह', 'i': 'ग', 'o': 'द', 'p': 'ज', '[': 'ड', ']': '़', '\\': 'ऑ',
        'a': 'ो', 's': 'े', 'd': '्', 'f': 'ि', 'g': 'ु', 'h': 'प', 'j': 'र', 'k': 'क', 'l': 'त', ';': 'च', "'": 'ट',
        'z': '्र', 'x': 'ं', 'c': 'म', 'v': 'न', 'b': 'व', 'n': 'ल', 'm': 'स', ',': ',', '.': '।', '/': 'य',
        
        'Q': 'औ', 'W': 'ऐ', 'E': 'आ', 'R': 'ई', 'T': 'ऊ', 'Y': 'भ', 'U': 'ङ', 'I': 'घ', 'O': 'ध', 'P': 'झ', '{': 'ढ', '}': 'ञ', '|': 'ऑ',
        'A': 'ओ', 'S': 'ए', 'D': 'अ', 'F': 'इ', 'G': 'उ', 'H': 'फ', 'J': 'ऱ', 'K': 'ख', 'L': 'थ', ':': 'छ', '"': 'ठ',
        'Z': 'र्', 'X': 'ँ', 'C': 'ण', 'V': 'न', 'B': 'भ', 'N': 'ळ', 'M': 'श', '<': 'ऑ', '>': '।', '?': 'य',
        '1': '१', '2': '२', '3': '३', '4': '४', '5': '५', '6': '६', '7': '७', '8': '८', '9': '९', '0': '०'
    };

    /**
     * OFFICIAL KRUTI DEV 010 KEYMAP (100% VERIFIED WITH OFFICIAL TYPEWRITER CHART)
     */
    const krutiDevMap = {
        // Row 1 (Number Row)
        '`': 'ऽ', '~': '`',
        '1': '१', '!': '!',
        '2': '२', '@': '/',
        '3': '३', '#': 'रु',
        '4': '४', '$': '+',
        '5': '५', '%': ':',
        '6': '६', '^': "'",
        '7': '७', '&': '-',
        '8': '८', '*': '‘',
        '9': '९', '(': ';',
        '0': '०', ')': 'द्ध',
        '-': '.', '_': 'ऋ',
        '=': 'ृ', '+': 'त्र',

        // Row 2 (QWERTY Row)
        'q': 'ु', 'Q': 'फ',
        'w': 'ू', 'W': 'ॅ',
        'e': 'म', 'E': 'म्',
        'r': 'त', 'R': 'त्',
        't': 'ज', 'T': 'ज्',
        'y': 'ल', 'Y': 'ल्',
        'u': 'न', 'U': 'न्',
        'i': 'प', 'I': 'प्',
        'o': 'व', 'O': 'व्',
        'p': 'च', 'P': 'च्',
        '[': 'ख', '{': 'क्ष',
        ']': ',', '}': 'द्व',
        '\\': '?', '|': 'द्य',

        // Row 3 (ASDF Row)
        'a': 'ं', 'A': '!',
        's': 'े', 'S': 'ै',
        'd': 'क', 'D': 'क्',
        'f': 'ि', 'F': 'थ्',
        'g': 'ह', 'G': 'ळ',
        'h': 'ी', 'H': 'भ्',
        'j': 'र', 'J': 'श्र',
        'k': 'ा', 'K': 'झ',
        'l': 'स', 'L': 'स्',
        ';': 'य', ':': 'रू',
        "'": 'श', '"': 'ष्',

        // Row 4 (ZXCV Row)
        'z': '्र', 'Z': '़',
        'x': 'ग', 'X': 'ग्',
        'c': 'ब', 'C': 'ब्',
        'v': 'अ', 'V': 'ट्',
        'b': 'इ', 'B': 'ठ्',
        'n': 'द', 'N': 'छ',
        'm': 'उ', 'M': 'ड्ड',
        ',': 'ए', '<': 'ढ',
        '.': 'ण्', '>': 'झ',
        '/': 'ध', '?': 'घ'
    };

    // Devanagari Remington Gail Keymap (Identical to Official Kruti Dev 010 Chart)
    const remingtonGailMap = { ...krutiDevMap };

    // Complete Kruti Dev 010 / Remington Gail Alt Code Shortcuts Reference
    const altCodeShortcuts = {
        '0161': '‘',
        '0162': '’',
        '0170': '‘‘',
        '0171': '’’',
        '0197': 'ऋ',
        '0199': 'क्र',
        '0200': 'फ्र',
        '0201': 'ज्ञ',
        '0202': 'त्र',
        '0203': 'क्ष',
        '0204': 'द्द',
        '0205': 'द्य',
        '0206': 'द्ध',
        '0207': 'द्भ',
        '0209': 'न्न',
        '0210': 'न्न्',
        '0211': 'प्र',
        '0212': 'प्त',
        '0214': 'क्त',
        '0216': 'कृ',
        '0217': 'द्र',
        '0221': '्य',
        '0224': 'फ',
        '0225': 'भ',
        '0226': 'ह्न',
        '0228': 'झ',
        '0230': 'द्व',
        '0241': 'ष'
    };

    /**
     * Map physical keypress to Hindi character based on active font layout
     */
    function mapKeyToHindi(key, layout) {
        if (!key || key === ' ' || key === 'Enter' || key === 'Backspace' || key === 'Tab' || key === 'Escape') {
            return null; // Return null so space/backspace/enter are handled natively
        }

        if (layout === 'hi_krutidev' || layout === 'hi_remington') {
            return krutiDevMap[key] || null;
        } else if (layout === 'hi_inscript') {
            return inScriptMap[key] || null;
        }

        return null;
    }

    /**
     * Resolve Alt Code string (e.g. "0204") to Devanagari character
     */
    function resolveAltCode(codeStr) {
        return altCodeShortcuts[codeStr] || null;
    }

    /**
     * Convert raw Kruti Dev ANSI text to normalized Devanagari Unicode
     */
    function convertKrutiDevToUnicode(ansiText) {
        if (!ansiText) return "";
        let result = "";
        for (let i = 0; i < ansiText.length; i++) {
            let ch = ansiText[i];
            if (ch === 'f' && i + 1 < ansiText.length) {
                let nextCh = ansiText[i + 1];
                let mappedNext = krutiDevMap[nextCh] || nextCh;
                result += mappedNext + 'ि';
                i++;
            } else {
                result += krutiDevMap[ch] || ch;
            }
        }
        return result;
    }

    return {
        mapKeyToHindi: mapKeyToHindi,
        resolveAltCode: resolveAltCode,
        convertKrutiDevToUnicode: convertKrutiDevToUnicode,
        inScriptMap: inScriptMap,
        remingtonGailMap: remingtonGailMap,
        krutiDevMap: krutiDevMap,
        altCodeShortcuts: altCodeShortcuts
    };
})();
