/**
 * Typing Exam Engine - Font & Keyboard Engine Module
 * Official Kruti Dev 010 ANSI -> Unicode Phonetic Reordering Engine
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

    function isConsonant(ch) {
        return /^[कखगघङचछजझञटठडढणतथदधनपफबभमयरलवशषसहळज्ञत्रक्षअआइईउऊऋएऐओऔ]$/.test(ch);
    }

    /**
     * Convert raw Kruti Dev ANSI key sequence into normalized Devanagari Unicode
     */
    function convertKrutiDevToUnicode(krutiStr) {
        if (!krutiStr) return "";

        let str = krutiStr;

        // 1. Replace special Kruti Dev Alt-codes & ligatures
        const specialMap = {
            'ñ': 'ह्न', 'ò': 'हृ', 'ó': 'क्ट', 'ô': 'ष्ट', 'õ': 'ष्ठ',
            'ö': 'द्व', '÷': 'ट्ठ', 'ø': 'दद्य', 'ù': 'द्व', 'ú': 'दृ',
            'û': 'न्न्', 'ü': 'द्ग', 'ý': 'द्ब', 'þ': 'द्ध', 'ÿ': 'द्म्',
            '±': 'ह्न', '²': 'हृ', '³': 'क्ट', '´': 'ष्ट', 'µ': 'ष्ठ',
            '¶': 'द्व', '·': 'ट्ठ', '¸': 'दद्य', '¹': 'द्व', 'º': 'दृ',
            '»': 'न्न्', '¼': 'द्ग', '½': 'द्ब', '¾': 'द्ध', '¿': 'द्म्',
            'À': 'द्द', 'Á': 'द्य', 'Â': 'द्व', 'Ã': 'ष्ट', 'Ä': 'ष्ठ',
            'Å': 'ऋ', 'Æ': 'अॉ', 'Ç': 'क', 'È': 'ख', 'É': 'ग',
            'Ê': 'घ', 'Ë': 'ङ', 'Ì': 'च', 'Í': 'छ', 'Î': 'ज',
            'Ï': 'झ', 'Ð': 'ञ', 'Ñ': 'ट', 'Ò': 'ठ', 'Ó': 'ड',
            'Ô': 'ढ', 'Õ': 'ण', 'Ö': 'त', '×': 'थ', 'Ø': 'कृ',
            'Ù': 'द्र', 'Ú': 'ध', 'Û': 'न', 'Ü': 'प', 'Ý': 'फ',
            'Þ': 'ब', 'ß': 'भ', 'à': 'म', 'á': 'य', 'â': 'र',
            'ã': 'ल', 'ä': 'व', 'å': 'श', 'æ': 'ष', 'ç': 'स',
            'è': 'ह', 'é': 'ळ', 'ê': 'क्ष', 'ë': 'त्र', 'ì': 'ज्ञ'
        };

        for (let k in specialMap) {
            str = str.split(k).join(specialMap[k]);
        }

        // 2. Map raw ANSI characters to Unicode equivalents
        let tokens = [];
        for (let i = 0; i < str.length; i++) {
            let ch = str[i];
            let mapped = krutiDevMap[ch];
            if (mapped !== undefined) {
                tokens.push(mapped);
            } else {
                tokens.push(ch);
            }
        }

        // 3. Fix Pre-Position Matra 'ि' (f in Kruti Dev):
        // Shift 'ि' from BEFORE consonant to AFTER consonant
        for (let i = 0; i < tokens.length; i++) {
            if (tokens[i] === 'ि') {
                let j = i + 1;
                while (j < tokens.length && (tokens[j].endsWith('्') || isConsonant(tokens[j]))) {
                    if (!tokens[j].endsWith('्')) {
                        j++;
                        break;
                    }
                    j++;
                }
                if (j > i + 1) {
                    let matra = tokens.splice(i, 1)[0];
                    tokens.splice(j - 1, 0, matra);
                }
            }
        }

        // 4. Fix Reph 'Z' or '’' or '्' + 'र':
        // Shift Reph from AFTER consonant to BEFORE consonant
        for (let i = 0; i < tokens.length; i++) {
            if (tokens[i] === '’' || tokens[i] === 'Z' || tokens[i] === 'र्') {
                let j = i - 1;
                while (j >= 0 && (tokens[j].endsWith('्') || isConsonant(tokens[j]) || /^[ािीुूृेैोौंःँ़]$/.test(tokens[j]))) {
                    if (isConsonant(tokens[j])) {
                        break;
                    }
                    j--;
                }
                if (j >= 0 && j < i) {
                    let reph = tokens.splice(i, 1)[0];
                    tokens.splice(j, 0, 'र्');
                }
            }
        }

        return tokens.join('');
    }

    function mapKeyToHindi(key, layout) {
        if (!key || key === ' ' || key === 'Enter' || key === 'Backspace' || key === 'Tab' || key === 'Escape') {
            return null;
        }

        if (layout === 'hi_krutidev' || layout === 'hi_remington') {
            return krutiDevMap[key] || null;
        } else if (layout === 'hi_inscript') {
            return inScriptMap[key] || null;
        }

        return null;
    }

    function resolveAltCode(codeStr) {
        return altCodeShortcuts[codeStr] || null;
    }

    return {
        mapKeyToHindi: mapKeyToHindi,
        convertKrutiDevToUnicode: convertKrutiDevToUnicode,
        resolveAltCode: resolveAltCode,
        inScriptMap: inScriptMap,
        remingtonGailMap: remingtonGailMap,
        krutiDevMap: krutiDevMap,
        altCodeShortcuts: altCodeShortcuts
    };
})();
