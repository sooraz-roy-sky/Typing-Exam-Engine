/**
 * Typing Exam Engine - Font & Keyboard Engine Module
 * Robust Kruti Dev 010, Remington Gail & InScript Keymap & Alt-Code Shortcut Translator
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

    // Devanagari Remington Gail Keymap (Physical QWERTY Key -> Unicode Character)
    const remingtonGailMap = {
        'q': 'ु', 'w': 'ू', 'e': 'म', 'r': 'त', 't': 'ज', 'y': 'ल', 'u': 'न', 'i': 'ग', 'o': 'द', 'p': 'च', '[': 'ख', ']': 'ध', '\\': '?',
        'a': 'ं', 's': 'े', 'd': 'क', 'f': 'ि', 'g': 'ह', 'h': 'प', 'j': 'र', 'k': 'ा', 'l': 'स', ';': 'य', "'": 'श',
        'z': 'ज', 'x': 'ग', 'c': 'म', 'v': 'अ', 'b': 'इ', 'n': 'द', 'm': 'उ', ',': 'ए', '.': '्', '/': 'य',

        'Q': 'फ', 'W': 'ऑ', 'E': 'म्', 'R': 'त्', 'T': 'ज्', 'Y': 'ल्', 'U': 'न्', 'I': 'ग्', 'O': 'द्', 'P': 'च्', '{': 'ख्', '}': 'ध्', '|': '?',
        'A': '।', 'S': 'ै', 'D': 'क्', 'F': 'थ्', 'G': 'ळ', 'H': 'फ्', 'J': 'श्र', 'K': 'ज्ञ', 'L': 'स्', ':': 'य्', '"': 'श्',
        'Z': 'ज्', 'X': 'ग्', 'C': 'ण', 'V': 'ट', 'B': 'ठ', 'N': 'छ', 'M': 'ड्', '<': 'ऑ', '>': '।', '?': 'घ',
        '1': '१', '2': '२', '3': '३', '4': '४', '5': '५', '6': '६', '7': '७', '8': '८', '9': '९', '0': '०'
    };

    // DEFAULT HINDI ENGINE: Kruti Dev 010 Keymap (Physical QWERTY Key -> Devanagari Unicode)
    const krutiDevMap = {
        'q': 'ु', 'w': 'ू', 'e': 'म', 'r': 'त', 't': 'ज', 'y': 'ल', 'u': 'न', 'i': 'ग', 'o': 'द', 'p': 'च', '[': 'ख', ']': 'ध', '\\': '?',
        'a': 'ं', 's': 'े', 'd': 'क', 'f': 'ि', 'g': 'ह', 'h': 'प', 'j': 'र', 'k': 'ा', 'l': 'स', ';': 'य', "'": 'श',
        'z': 'ज', 'x': 'ग', 'c': 'म', 'v': 'अ', 'b': 'इ', 'n': 'द', 'm': 'उ', ',': 'ए', '.': '्', '/': 'य',

        'Q': 'फ', 'W': 'ऑ', 'E': 'म्', 'R': 'त्', 'T': 'ज्', 'Y': 'ल्', 'U': 'न्', 'I': 'ग्', 'O': 'द्', 'P': 'च्', '{': 'ख्', '}': 'ध्', '|': '?',
        'A': '।', 'B': 'ठ', 'C': 'ण', 'D': 'क्', 'F': 'थ्', 'G': 'ळ', 'H': 'फ्', 'J': 'श्र',
        'K': 'ज्ञ', 'L': 'स्', 'M': 'ड्', 'N': 'छ', 'S': 'ै', 'V': 'ट', 'W': 'ऑ', 'X': 'ग्', 'Y': 'ल्', 'Z': 'ज्',
        '1': '१', '2': '२', '3': '३', '4': '४', '5': '५', '6': '६', '7': '७', '8': '८', '9': '९', '0': '०'
    };

    // Alt Code Shortcuts for Kruti Dev 010 / Remington Gail Legal Texts
    const altCodeShortcuts = {
        '0204': 'द्द',
        '0216': 'कृ',
        '0226': 'ह्न',
        '0197': 'ऋ',
        '0205': 'द्य',
        '0217': 'द्र',
        '0230': 'द्व',
        '0161': '‘',
        '0162': '’',
        '0170': '‘‘',
        '0171': '’’'
    };

    /**
     * Map physical keypress to Hindi character based on active font layout
     */
    function mapKeyToHindi(key, layout) {
        if (!key || key === ' ' || key === 'Enter' || key === 'Backspace' || key === 'Tab' || key === 'Escape') {
            return null; // Return null so space/backspace/enter are handled natively
        }

        if (layout === 'hi_krutidev') {
            return krutiDevMap[key] || null;
        } else if (layout === 'hi_remington') {
            return remingtonGailMap[key] || null;
        } else if (layout === 'hi_inscript') {
            return inScriptMap[key] || null;
        }

        return null;
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
        convertKrutiDevToUnicode: convertKrutiDevToUnicode,
        inScriptMap: inScriptMap,
        remingtonGailMap: remingtonGailMap,
        krutiDevMap: krutiDevMap,
        altCodeShortcuts: altCodeShortcuts
    };
})();
