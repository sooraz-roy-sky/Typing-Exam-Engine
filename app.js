/**
 * Typing Test Portal - Enterprise Assessment Controller
 * Hindi Devanagari Passage Titles & Kruti Dev 010 Priority Engine
 */

document.addEventListener('DOMContentLoaded', () => {

    // --- PRE-COMPUTED SHA-256 HASH OF DEFAULT MASTER PASSWORD 'admin123' ---
    const ADMIN_PASSWORD_SHA256 = '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9';

    // Helper: Compute SHA-256 hash using Web Crypto API
    async function hashSHA256(text) {
        try {
            const encoder = new TextEncoder();
            const data = encoder.encode(text);
            const hashBuffer = await crypto.subtle.digest('SHA-256', data);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        } catch (e) {
            let hash = 0;
            for (let i = 0; i < text.length; i++) {
                hash = ((hash << 5) - hash) + text.charCodeAt(i);
                hash |= 0;
            }
            return Math.abs(hash).toString(16).padStart(16, 'a').toUpperCase();
        }
    }

    async function getOrComputeRecordHash(candidate, timestamp, netWpm) {
        const payload = `${candidate.name || 'Candidate'}|${candidate.dob || 'DOB'}|${netWpm || '0'}|${timestamp || 'Date'}`;
        const raw = await hashSHA256(payload);
        return raw.substring(0, 16).toUpperCase();
    }

    // --- 1. DEFAULT PASSAGE DATABASE (ALL HINDI TITLES WRITTEN IN HINDI DEVANAGARI) ---
    const defaultPassages = [
        {
            id: 'hi_krutidev_01',
            title: 'हिन्दी न्यायिक मूल्यांकन पाठ #1 (कृतिदेव 010)',
            lang: 'hi_krutidev',
            text: 'भारत एक विशाल देश है। इस देश में विविध संस्कृति एवं भाषाएं हैं। उच्च न्यायालय एवं उच्चतम न्यायालय देश की न्यायिक संरचना का मुख्य अंग हैं। न्यायिक स्वतंत्रता भारतीय संविधान की मुख्य विशेषता है।'
        },
        {
            id: 'hi_remington_01',
            title: 'हिन्दी न्यायपालिका गद्य पाठ #2 (रेमिंगटन गेल)',
            lang: 'hi_remington',
            text: 'भारतीय न्यायपालिका स्वतंत्र एवं निष्पक्ष कार्यप्रणाली के लिए जानी जाती है। राज्य विधायिका द्वारा पारित विधेयकों की संवैधानिकता की समीक्षा करने की शक्ति उच्च न्यायालय तथा उच्चतम न्यायालय में निहित है। जनहित याचिकाओं के माध्यम से आम नागरिकों को त्वरित न्याय सुलभ कराया जाता है।'
        },
        {
            id: 'hi_inscript_01',
            title: 'हिन्दी प्रशासनिक मानक पाठ #3 (इनस्क्रिप्ट)',
            lang: 'hi_inscript',
            text: 'भारत एक सम्प्रभुतासम्पन्न, समाजवादी, पंथनिरपेक्ष, लोकतांत्रिक गणराज्य है। संविधान सभा द्वारा २६ नवम्बर १९४९ को संविधान अंगीकृत किया गया था तथा २६ जनवरी १९५० को पूर्ण रूप से लागू हुआ। उच्च न्यायालय को नागरिकों के मौलिक अधिकारों के संरक्षण हेतु याचिकाएं स्वीकार करने का पूर्ण अधिकार है।'
        },
        {
            id: 'en_standard_01',
            title: 'English Judicial & Administrative Passage #1',
            lang: 'en_qwerty',
            text: 'India is a sovereign, socialist, secular, democratic republic with a parliamentary system of governance. The Constitution was adopted by the Constituent Assembly on 26th November 1949 and came into effect on 26th January 1950. The High Court of Judicature has exclusive jurisdiction to hear appeal petitions arising from civil court decisions. Every citizen enjoys fundamental rights guaranteed under Part III of the Constitution.'
        },
        {
            id: 'en_prose_02',
            title: 'English Economic & Technological Passage #2',
            lang: 'en_qwerty',
            text: 'Economic growth in developing nations relies heavily on modern infrastructure, digital connectivity, and skilled human resources. Transportation networks facilitate efficient trade and distribution of industrial goods across domestic and international markets. Public sector investment in renewable energy projects continues to accelerate technological innovation.'
        }
    ];

    function loadPassageDatabase() {
        try {
            const saved = localStorage.getItem('typing_passage_database');
            if (saved) {
                const parsed = JSON.parse(saved);
                // Clean old English titles for Hindi passages if any
                const sanitized = parsed.map(p => {
                    if (p.id === 'hi_krutidev_01' && p.title.startsWith('Hindi')) p.title = 'हिन्दी न्यायिक मूल्यांकन पाठ #1 (कृतिदेव 010)';
                    if (p.id === 'hi_remington_01' && p.title.startsWith('Hindi')) p.title = 'हिन्दी न्यायपालिका गद्य पाठ #2 (रेमिंगटन गेल)';
                    if (p.id === 'hi_inscript_01' && p.title.startsWith('Hindi')) p.title = 'हिन्दी प्रशासनिक मानक पाठ #3 (इनस्क्रिप्ट)';
                    return p;
                });
                return sanitized;
            }
        } catch (e) {}
        return [...defaultPassages];
    }

    function savePassageDatabase(db) {
        try {
            localStorage.setItem('typing_passage_database', JSON.stringify(db));
        } catch (e) {}
    }

    let passageDatabase = loadPassageDatabase();

    /**
     * AUTOMATIC PASSAGE SELECTOR ENGINE (PRIORITIZES KRUTI DEV 010 FOR HINDI)
     */
    function getAutoSelectedPassage(targetLang) {
        // Try exact language match first (e.g. hi_krutidev)
        let matching = passageDatabase.filter(p => p.lang === targetLang);

        // Fallback to any Hindi passage if no exact layout match
        if (matching.length === 0 && targetLang.startsWith('hi_')) {
            matching = passageDatabase.filter(p => p.lang.startsWith('hi_'));
        }

        if (matching.length === 0) {
            return {
                id: 'fallback_01',
                title: targetLang.startsWith('hi_') ? 'हिन्दी मूल्यांकन पाठ (कृतिदेव 010)' : 'English Assessment Passage',
                lang: targetLang,
                text: targetLang.startsWith('hi_')
                    ? 'भारत एक समृद्ध और विविधताओं से भरा देश है। यहाँ की संस्कृति और भाषाएँ विश्व भर में प्रसिद्ध हैं।'
                    : 'The Constitution of India guarantees fundamental rights to all citizens to ensure freedom, equality, and justice.'
            };
        }

        const randomIndex = Math.floor(Math.random() * matching.length);
        return matching[randomIndex];
    }

    // --- 2. GLOBAL STATE, KEYSTROKE RATE LIMITER & ALT CODE BUFFER ---
    let keystrokeRateTracker = {
        timestamps: [],
        MAX_KEYSTROKES_PER_SEC: 20
    };

    let altCodeTracker = {
        isAltDown: false,
        buffer: ''
    };

    let state = {
        candidate: {
            name: 'Rahul Sharma',
            mobile: '9876543210',
            dob: '15/08/1998'
        },
        admin: {
            isUnlocked: false,
            hindiFontEngine: 'hi_krutidev', // DEFAULT HINDI ENGINE: Kruti Dev 010
            showQualificationStatus: false,
            fastForwardTestingMode: true // DEFAULT TESTING MODE: ON
        },
        config: {
            backspaceRule: 'SingleWord', // DEFAULT: Single Word Backspace Only
            examMode: 'combined' // 'combined' | 'english' | 'hindi'
        },
        sequence: {
            activeStageIndex: 0,
            activePhase: 'WARMUP', // 'WARMUP' (2 min) | 'BREAK' (2 min) | 'ACTUAL' (10 min)
            stages: []
        },
        breakTimer: {
            remainingSeconds: 120,
            intervalId: null
        },
        exam: {
            hasStarted: false,
            isRunning: false,
            elapsedSeconds: 0,
            intervalId: null,
            totalKeystrokes: 0,
            correctKeystrokes: 0,
            fullErrors: 0,
            halfErrors: 0,
            backspaceCount: 0,
            targetText: '',
            targetTokens: [],
            typedText: '',
            activeSignature: ''
        },
        completedResults: []
    };

    // --- AUTO FULLSCREEN HELPER ---
    function triggerFullscreenMode() {
        try {
            const el = document.documentElement;
            if (el.requestFullscreen) {
                el.requestFullscreen().catch(() => {});
            } else if (el.webkitRequestFullscreen) {
                el.webkitRequestFullscreen();
            } else if (el.msRequestFullscreen) {
                el.msRequestFullscreen();
            }
        } catch (err) {}
    }

    function exitFullscreenMode() {
        try {
            if (document.fullscreenElement) {
                if (document.exitFullscreen) {
                    document.exitFullscreen().catch(() => {});
                } else if (document.webkitExitFullscreen) {
                    document.webkitExitFullscreen();
                } else if (document.msExitFullscreen) {
                    document.msExitFullscreen();
                }
            }
        } catch (err) {}
    }

    // --- SECURITY GUARD & ALT-KEY RELEASE LISTENER ---
    window.addEventListener('keydown', (e) => {
        if (state.exam.isRunning) {
            if (e.key === 'F12' || 
                (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j')) ||
                (e.ctrlKey && (e.key === 'u' || e.key === 'U'))) {
                e.preventDefault();
                return;
            }
        }
    });

    window.addEventListener('keyup', (e) => {
        if (e.key === 'Alt') {
            if (altCodeTracker.buffer.length > 0) {
                processAltCodeBuffer();
            }
            altCodeTracker.isAltDown = false;
        }
    });

    function processAltCodeBuffer() {
        if (!altCodeTracker.buffer) return;
        
        let code = altCodeTracker.buffer;
        if (code.length === 3) code = '0' + code;

        const mappedChar = FontEngine.resolveAltCode(code);
        if (mappedChar && typingInput) {
            insertTextAtCursor(typingInput, mappedChar);
            if (!state.exam.hasStarted) startTimer();
            state.exam.totalKeystrokes++;
            state.exam.typedText = typingInput.value;
            evaluateMatching();
            updateMetrics();
            checkEarlyPassageCompletion();
        }
        altCodeTracker.buffer = '';
    }

    // --- 3. DOM ELEMENTS ---
    const viewHome = document.getElementById('view-home');
    const viewTyping = document.getElementById('view-typing');
    const typingInput = document.getElementById('typing-input');
    const passageContainer = document.getElementById('passage-container');
    const liveTimer = document.getElementById('live-timer');
    const liveGrossWpm = document.getElementById('live-gross-wpm');
    const liveNetWpm = document.getElementById('live-net-wpm');
    const liveAccuracy = document.getElementById('live-accuracy');

    const modalRegistration = document.getElementById('modal-registration');
    const modalInstructions = document.getElementById('modal-instructions');
    const modalBreak = document.getElementById('modal-break');
    const modalTransition = document.getElementById('modal-transition');
    const modalHistory = document.getElementById('modal-history');
    const modalAdmin = document.getElementById('modal-admin');
    const modalScorecard = document.getElementById('modal-scorecard');
    const modalAltCodes = document.getElementById('modal-alt-codes');

    const btnAltCodesNav = document.getElementById('btn-alt-codes-nav');
    const btnSkipWarmup = document.getElementById('btn-skip-warmup');
    const btnSkipBreak = document.getElementById('btn-skip-break');

    const lessonTitleInput = document.getElementById('lesson-title');
    const lessonLangSelect = document.getElementById('lesson-lang');
    const lessonTextArea = document.getElementById('lesson-text');

    if (btnAltCodesNav) {
        btnAltCodesNav.addEventListener('click', () => {
            if (modalAltCodes) modalAltCodes.classList.add('open');
        });
    }

    if (lessonLangSelect) {
        lessonLangSelect.addEventListener('change', () => {
            const val = lessonLangSelect.value;
            if (val.startsWith('hi_')) {
                if (lessonTitleInput) {
                    lessonTitleInput.classList.add('hindi-font');
                    lessonTitleInput.placeholder = 'Passage Title (शीर्षक)';
                }
                if (lessonTextArea) {
                    lessonTextArea.classList.add('hindi-font');
                    lessonTextArea.placeholder = 'यहाँ हिन्दी पाठ दर्ज करें... (Type or paste Hindi passage text here)';
                }
            } else {
                if (lessonTitleInput) {
                    lessonTitleInput.classList.remove('hindi-font');
                    lessonTitleInput.placeholder = 'Passage Title';
                }
                if (lessonTextArea) {
                    lessonTextArea.classList.remove('hindi-font');
                    lessonTextArea.placeholder = 'Type or paste English passage text here...';
                }
            }
        });
    }

    if (btnSkipWarmup) {
        btnSkipWarmup.addEventListener('click', () => {
            if (state.sequence.activePhase === 'WARMUP') {
                finishPhaseInstance();
            }
        });
    }

    if (btnSkipBreak) {
        btnSkipBreak.addEventListener('click', () => {
            if (state.breakTimer.intervalId) clearInterval(state.breakTimer.intervalId);
            if (modalBreak) modalBreak.classList.remove('open');
            state.sequence.activePhase = 'ACTUAL';
            startPhaseInstance();
        });
    }

    // --- 4. NAVIGATION & HOME CONTROLLER ---
    function closeAllModals() {
        if (modalRegistration) modalRegistration.classList.remove('open');
        if (modalInstructions) modalInstructions.classList.remove('open');
        if (modalBreak) modalBreak.classList.remove('open');
        if (modalTransition) modalTransition.classList.remove('open');
        if (modalHistory) modalHistory.classList.remove('open');
        if (modalAdmin) modalAdmin.classList.remove('open');
        if (modalScorecard) modalScorecard.classList.remove('open');
        if (modalAltCodes) modalAltCodes.classList.remove('open');
    }

    function navigateToHome() {
        if (state.exam.isRunning && !confirm('Are you sure you want to exit the active test and return to Home?')) {
            return;
        }

        if (state.exam.intervalId) clearInterval(state.exam.intervalId);
        if (state.breakTimer.intervalId) clearInterval(state.breakTimer.intervalId);
        
        state.exam.isRunning = false;
        document.body.classList.remove('no-scroll-exam');
        exitFullscreenMode();
        closeAllModals();

        if (viewTyping) viewTyping.style.display = 'none';
        if (viewHome) viewHome.style.display = 'block';
    }

    const btnHomeNav = document.getElementById('btn-home-nav');
    if (btnHomeNav) btnHomeNav.addEventListener('click', navigateToHome);

    const btnHomeScorecard = document.getElementById('btn-home-scorecard');
    if (btnHomeScorecard) btnHomeScorecard.addEventListener('click', navigateToHome);

    document.querySelectorAll('.btn-start-flow').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const mode = e.currentTarget.dataset.type || 'combined';
            state.config.examMode = mode;
            if (modalRegistration) modalRegistration.classList.add('open');
        });
    });

    // Step 1: Registration Form -> Shows Instructions Modal & Requests Fullscreen
    const btnConfirmReg = document.getElementById('btn-confirm-registration');
    if (btnConfirmReg) {
        btnConfirmReg.addEventListener('click', () => {
            const nameInput = document.getElementById('reg-candidate-name');
            const mobileInput = document.getElementById('reg-candidate-mobile');
            const dobInput = document.getElementById('reg-candidate-dob');

            const nameVal = nameInput ? nameInput.value.trim() : 'Rahul Sharma';
            const mobileVal = mobileInput ? mobileInput.value.trim() : '9876543210';
            const dobVal = dobInput ? dobInput.value.trim() : '15/08/1998';

            if (!nameVal || !mobileVal || !dobVal) {
                alert('Please fill in all candidate details before starting.');
                return;
            }

            state.candidate.name = nameVal;
            state.candidate.mobile = mobileVal;
            state.candidate.dob = dobVal;

            triggerFullscreenMode();

            const instName = document.getElementById('inst-candidate-name');
            const instDob = document.getElementById('inst-candidate-dob');
            if (instName) instName.textContent = state.candidate.name;
            if (instDob) instDob.textContent = state.candidate.dob;

            if (modalRegistration) modalRegistration.classList.remove('open');
            if (modalInstructions) modalInstructions.classList.add('open');
        });
    }

    // Step 2: Confirm Instructions -> Starts Exam Sequence
    const btnStartAfterInst = document.getElementById('btn-start-after-instructions');
    if (btnStartAfterInst) {
        btnStartAfterInst.addEventListener('click', () => {
            triggerFullscreenMode();
            closeAllModals();
            setupExamSequence();
        });
    }

    // --- 5. EXAM SEQUENCE CONTROLLER ---
    function setupExamSequence() {
        state.completedResults = [];
        state.sequence.activeStageIndex = 0;

        const mode = state.config.examMode || 'combined';
        const defaultHindiEngine = state.admin.hindiFontEngine || 'hi_krutidev';

        if (mode === 'combined') {
            state.sequence.stages = [
                { stageName: 'Stage 1: English Typing Test', lang: 'en_qwerty' },
                { stageName: `Stage 2: Hindi Typing Test (${defaultHindiEngine === 'hi_krutidev' ? 'Kruti Dev 010' : (defaultHindiEngine === 'hi_remington' ? 'Remington Gail' : 'InScript')})`, lang: defaultHindiEngine }
            ];
        } else if (mode === 'english') {
            state.sequence.stages = [
                { stageName: 'English Typing Test', lang: 'en_qwerty' }
            ];
        } else {
            state.sequence.stages = [
                { stageName: `Hindi Typing Test (${defaultHindiEngine === 'hi_krutidev' ? 'Kruti Dev 010' : (defaultHindiEngine === 'hi_remington' ? 'Remington Gail' : 'InScript')})`, lang: defaultHindiEngine }
            ];
        }

        state.sequence.activePhase = 'WARMUP';
        startPhaseInstance();
    }

    function startPhaseInstance() {
        closeAllModals();
        triggerFullscreenMode();
        document.body.classList.add('no-scroll-exam');

        const stageConfig = state.sequence.stages[state.sequence.activeStageIndex] || state.sequence.stages[0];
        const phaseName = state.sequence.activePhase || 'WARMUP';
        
        const phaseDurationSecs = phaseName === 'WARMUP' ? 120 : 600;

        if (state.exam.intervalId) clearInterval(state.exam.intervalId);
        state.exam = {
            hasStarted: false,
            isRunning: false,
            elapsedSeconds: 0,
            intervalId: null,
            totalKeystrokes: 0,
            correctKeystrokes: 0,
            fullErrors: 0,
            halfErrors: 0,
            backspaceCount: 0,
            targetText: '',
            targetTokens: [],
            typedText: '',
            activeSignature: ''
        };

        const passageObj = getAutoSelectedPassage(stageConfig.lang);
        state.exam.targetText = passageObj.text;
        state.exam.targetTokens = passageObj.text.trim().split(/\s+/);

        passageContainer.innerHTML = '';
        state.exam.targetTokens.forEach((tokenText, idx) => {
            const span = document.createElement('span');
            span.className = 'word-token' + (idx === 0 ? ' active' : '');
            span.dataset.index = idx;
            span.textContent = tokenText;
            passageContainer.appendChild(span);
        });

        typingInput.value = '';
        if (stageConfig.lang.startsWith('hi_')) {
            passageContainer.classList.add('hindi-font');
            typingInput.classList.add('hindi-font');
        } else {
            passageContainer.classList.remove('hindi-font');
            typingInput.classList.remove('hindi-font');
        }

        const phasePill = document.getElementById('phase-badge-pill');
        if (phaseName === 'WARMUP') {
            if (phasePill) {
                phasePill.textContent = '🔥 2-MIN WARMUP';
                phasePill.style.background = 'var(--accent-cyan)';
            }
            const lblTimer = document.getElementById('label-timer-phase');
            if (lblTimer) lblTimer.textContent = 'Timer:';
            if (btnSkipWarmup) btnSkipWarmup.style.display = state.admin.fastForwardTestingMode ? 'inline-flex' : 'none';
        } else {
            if (phasePill) {
                phasePill.textContent = '⚡ 10-MIN ACTUAL EXAM';
                phasePill.style.background = 'var(--color-correct)';
            }
            const lblTimer = document.getElementById('label-timer-phase');
            if (lblTimer) lblTimer.textContent = 'Timer:';
            if (btnSkipWarmup) btnSkipWarmup.style.display = 'none';
        }

        const phaseTitle = phaseName === 'WARMUP' ? '2 Min Warmup' : '10 Min Actual Exam';
        
        const elStageBadge = document.getElementById('stage-badge');
        if (elStageBadge) elStageBadge.textContent = `${stageConfig.stageName} (${phaseTitle})`;

        const elPassageTitle = document.getElementById('label-passage-title');
        if (elPassageTitle) {
            elPassageTitle.textContent = `${passageObj.title} [Auto-Selected]`;
            if (stageConfig.lang.startsWith('hi_') || passageObj.lang.startsWith('hi_')) {
                elPassageTitle.classList.add('hindi-font');
            } else {
                elPassageTitle.classList.remove('hindi-font');
            }
        }

        const elBackspaceRule = document.getElementById('label-backspace-rule');
        if (elBackspaceRule) elBackspaceRule.textContent = `Backspace: ${state.config.backspaceRule}`;

        updateTimerDisplay(phaseDurationSecs);
        liveGrossWpm.textContent = '0.0';
        liveNetWpm.textContent = '0.0';
        liveAccuracy.textContent = '0.0%';

        if (viewHome) viewHome.style.display = 'none';
        if (viewTyping) viewTyping.style.display = 'block';

        setTimeout(() => {
            if (typingInput) typingInput.focus();
        }, 150);
    }

    // --- 6. REAL-TIME HINDI ENGINE, ALT-CODE ACCUMULATOR & KEYSTROKE RATE LIMITER ---
    function insertTextAtCursor(inputEl, text) {
        const startPos = inputEl.selectionStart;
        const endPos = inputEl.selectionEnd;
        const value = inputEl.value;

        inputEl.value = value.substring(0, startPos) + text + value.substring(endPos);
        inputEl.selectionStart = inputEl.selectionEnd = startPos + text.length;
    }

    function checkKeystrokeRateLimit() {
        const now = Date.now();
        keystrokeRateTracker.timestamps.push(now);
        keystrokeRateTracker.timestamps = keystrokeRateTracker.timestamps.filter(ts => now - ts < 1000);

        if (keystrokeRateTracker.timestamps.length > keystrokeRateTracker.MAX_KEYSTROKES_PER_SEC) {
            console.warn("Keystroke rate limit exceeded (>20 keys/sec).");
            return false;
        }
        return true;
    }

    typingInput.addEventListener('paste', (e) => {
        e.preventDefault();
        alert('⚠️ Copy-Pasting text is strictly prohibited during official typing examination!');
    });

    typingInput.addEventListener('drop', (e) => {
        e.preventDefault();
    });

    if (passageContainer) {
        passageContainer.addEventListener('contextmenu', (e) => {
            e.preventDefault();
        });
    }

    typingInput.addEventListener('beforeinput', (e) => {
        if (!checkKeystrokeRateLimit()) {
            e.preventDefault();
            return;
        }

        const stageConfig = state.sequence.stages[state.sequence.activeStageIndex] || state.sequence.stages[0];
        if (stageConfig.lang.startsWith('hi_') && !altCodeTracker.isAltDown) {
            if (e.inputType === 'insertText' && e.data && e.data.length === 1) {
                const mapped = FontEngine.mapKeyToHindi(e.data, stageConfig.lang);
                if (mapped) {
                    e.preventDefault();
                    insertTextAtCursor(typingInput, mapped);
                    if (!state.exam.hasStarted) startTimer();
                    state.exam.totalKeystrokes++;
                    state.exam.typedText = typingInput.value;
                    evaluateMatching();
                    updateMetrics();
                    checkEarlyPassageCompletion();
                } else if (/^[a-zA-Z]$/.test(e.data)) {
                    e.preventDefault();
                }
            }
        }
    });

    typingInput.addEventListener('keydown', (e) => {
        if (!checkKeystrokeRateLimit()) {
            e.preventDefault();
            return;
        }

        const stageConfig = state.sequence.stages[state.sequence.activeStageIndex] || state.sequence.stages[0];

        // ALT CODE SHORTCUT ACCUMULATION LISTENER
        if (e.key === 'Alt') {
            altCodeTracker.isAltDown = true;
            altCodeTracker.buffer = '';
            return;
        }

        if (altCodeTracker.isAltDown && (e.key.startsWith('Numpad') || /^[0-9]$/.test(e.key))) {
            const digit = e.key.replace('Numpad', '');
            if (/^[0-9]$/.test(digit)) {
                e.preventDefault();
                altCodeTracker.buffer += digit;
                if (altCodeTracker.buffer.length === 4) {
                    processAltCodeBuffer();
                }
                return;
            }
        }

        if (e.key === ' ' || e.key === 'Space') {
            if (typingInput.value.length === 0 || typingInput.value.endsWith(' ') || typingInput.value.endsWith('\n')) {
                e.preventDefault();
                return;
            }
        }

        if (e.key === 'Backspace') {
            state.exam.backspaceCount++;
            if (state.config.backspaceRule === 'Disabled') {
                e.preventDefault();
                return;
            } else if (state.config.backspaceRule === 'SingleWord') {
                if (typingInput.value.endsWith(' ')) {
                    e.preventDefault();
                    return;
                }
            }
        }

        if (stageConfig.lang.startsWith('hi_') && !e.ctrlKey && !e.altKey && !e.metaKey && e.key.length === 1) {
            const hindiChar = FontEngine.mapKeyToHindi(e.key, stageConfig.lang);
            if (hindiChar) {
                e.preventDefault();
                insertTextAtCursor(typingInput, hindiChar);

                if (!state.exam.hasStarted) {
                    startTimer();
                }

                state.exam.totalKeystrokes++;
                state.exam.typedText = typingInput.value;
                evaluateMatching();
                updateMetrics();
                checkEarlyPassageCompletion();
                return;
            } else if (/^[a-zA-Z]$/.test(e.key)) {
                e.preventDefault();
                return;
            }
        }

        if (!state.exam.hasStarted && (e.key.length === 1 || e.key === 'Space')) {
            startTimer();
        }

        if (e.key.length === 1 || e.key === 'Backspace' || e.key === 'Space') {
            state.exam.totalKeystrokes++;
        }
    });

    typingInput.addEventListener('input', () => {
        if (!state.exam.hasStarted && typingInput.value.length > 0) {
            startTimer();
        }

        if (!state.exam.isRunning) return;

        state.exam.typedText = typingInput.value;
        evaluateMatching();
        updateMetrics();
        checkEarlyPassageCompletion();
    });

    function checkEarlyPassageCompletion() {
        const typedText = state.exam.typedText;
        const typedWords = typedText.trim() === '' ? [] : typedText.trim().split(/\s+/);
        const targetTokens = state.exam.targetTokens;

        if (typedWords.length >= targetTokens.length) {
            const lastTyped = typedWords[targetTokens.length - 1];
            const lastTarget = targetTokens[targetTokens.length - 1];
            
            if (lastTyped && lastTyped.length >= lastTarget.length) {
                clearInterval(state.exam.intervalId);
                finishPhaseInstance();
            }
        }
    }

    function startTimer() {
        state.exam.hasStarted = true;
        state.exam.isRunning = true;
        
        const phaseDurationSecs = state.sequence.activePhase === 'WARMUP' ? 120 : 600;

        let remaining = phaseDurationSecs;
        state.exam.intervalId = setInterval(() => {
            remaining--;
            state.exam.elapsedSeconds++;
            updateTimerDisplay(remaining);
            updateMetrics();

            if (remaining <= 0) {
                clearInterval(state.exam.intervalId);
                finishPhaseInstance();
            }
        }, 1000);
    }

    function updateTimerDisplay(totalSecs) {
        const mins = Math.floor(totalSecs / 60);
        const secs = totalSecs % 60;
        liveTimer.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    function evaluateMatching() {
        const typedText = state.exam.typedText;
        const typedWords = typedText.trim() === '' ? [] : typedText.trim().split(/\s+/);
        const targetTokens = state.exam.targetTokens;
        const tokens = passageContainer.querySelectorAll('.word-token');

        let correctKeystrokes = 0;
        let fullErr = 0;
        let halfErr = 0;

        tokens.forEach((tokenSpan, idx) => {
            tokenSpan.className = 'word-token';
            const targetWord = targetTokens[idx] || '';
            const typedWord = typedWords[idx];

            if (idx === typedWords.length - 1) {
                tokenSpan.classList.add('active');
                tokenSpan.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });

                if (typedWord !== undefined && typedWord.length > 0) {
                    if (targetWord.startsWith(typedWord)) {
                        correctKeystrokes += typedWord.length;
                    } else {
                        tokenSpan.classList.add('error');
                        const wrongCharsCount = typedWord.length;
                        const wordErrorCount = Math.max(1, Math.ceil(wrongCharsCount / 5));
                        fullErr += wordErrorCount;
                    }
                }
            } else if (typedWord !== undefined) {
                if (typedWord === targetWord) {
                    tokenSpan.classList.add('correct');
                    correctKeystrokes += targetWord.length + 1;
                } else {
                    tokenSpan.classList.add('error');
                    if (typedWord.toLowerCase() === targetWord.toLowerCase()) {
                        halfErr++;
                    } else if (cleanPunct(typedWord) === cleanPunct(targetWord)) {
                        halfErr++;
                    } else {
                        const wordErrCount = Math.max(1, Math.ceil(typedWord.length / 5));
                        fullErr += wordErrCount;
                    }
                }
            }
        });

        if (typedWords.length > targetTokens.length) {
            const extraWordsCount = typedWords.length - targetTokens.length;
            fullErr += extraWordsCount;
        }

        state.exam.correctKeystrokes = correctKeystrokes;
        state.exam.fullErrors = fullErr;
        state.exam.halfErrors = halfErr;
    }

    function cleanPunct(str) {
        return str.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
    }

    function updateMetrics() {
        const elapsedMins = Math.max(0.1, state.exam.elapsedSeconds / 60);
        const grossWpm = (state.exam.totalKeystrokes / 5) / elapsedMins;
        const netPenaltyWords = (state.exam.fullErrors * 1.0) + (state.exam.halfErrors * 0.5);
        const netWpm = Math.max(0, grossWpm - (netPenaltyWords / elapsedMins));

        const accuracy = state.exam.totalKeystrokes > 0 ? (state.exam.correctKeystrokes / state.exam.totalKeystrokes) * 100 : 0.0;

        liveGrossWpm.textContent = grossWpm.toFixed(1);
        liveNetWpm.textContent = netWpm.toFixed(1);
        liveAccuracy.textContent = accuracy.toFixed(1) + '%';
    }

    const btnResetStage = document.getElementById('btn-reset-current-stage');
    if (btnResetStage) {
        btnResetStage.addEventListener('click', () => {
            startPhaseInstance();
        });
    }

    const btnSubmitExam = document.getElementById('btn-submit-exam');
    if (btnSubmitExam) {
        btnSubmitExam.addEventListener('click', () => {
            if (confirm('Are you sure you want to submit this phase early?')) {
                finishPhaseInstance();
            }
        });
    }

    // --- 7. PHASE TRANSITIONS & FAST-FORWARD REST BREAK ---
    async function finishPhaseInstance() {
        state.exam.isRunning = false;
        if (state.exam.intervalId) clearInterval(state.exam.intervalId);

        if (state.sequence.activePhase === 'WARMUP') {
            state.sequence.activePhase = 'BREAK';
            startBreakInterval();
        } else if (state.sequence.activePhase === 'ACTUAL') {
            const stageConfig = state.sequence.stages[state.sequence.activeStageIndex];
            
            const actualElapsedSecs = Math.max(1, state.exam.elapsedSeconds);
            const elapsedMins = actualElapsedSecs / 60;
            const durationDisplay = (actualElapsedSecs / 60).toFixed(1);

            const grossWpm = ((state.exam.totalKeystrokes / 5) / elapsedMins).toFixed(1);
            const netPenaltyWords = (state.exam.fullErrors * 1.0) + (state.exam.halfErrors * 0.5);
            const netWpmVal = Math.max(0, parseFloat(grossWpm) - (netPenaltyWords / elapsedMins));
            const netWpm = netWpmVal.toFixed(1);
            
            const accuracy = state.exam.totalKeystrokes > 0 ? ((state.exam.correctKeystrokes / state.exam.totalKeystrokes) * 100).toFixed(1) : '0.0';

            const isHindi = stageConfig.lang.startsWith('hi_');
            const cutoffWpm = isHindi ? 25.0 : 30.0;
            const isQualified = netWpmVal >= cutoffWpm;

            const targetWords = state.exam.targetTokens;
            const typedWords = state.exam.typedText.trim() === '' ? [] : state.exam.typedText.trim().split(/\s+/);
            const errorAuditLog = [];

            targetWords.forEach((targetWord, idx) => {
                const typedWord = typedWords[idx];
                if (typedWord !== undefined && typedWord !== targetWord) {
                    let penalty = 1.0;
                    let classification = 'Full Error (Spelling Mismatch)';

                    if (typedWord.toLowerCase() === targetWord.toLowerCase()) {
                        penalty = 0.5;
                        classification = 'Half Error (Capitalization Mismatch)';
                    } else if (cleanPunct(typedWord) === cleanPunct(targetWord)) {
                        penalty = 0.5;
                        classification = 'Half Error (Punctuation Mismatch)';
                    } else if (!typedWord || typedWord.trim() === '') {
                        penalty = 1.0;
                        classification = 'Full Error (Omitted Word)';
                    }

                    errorAuditLog.push({
                        index: idx + 1,
                        targetWord: targetWord,
                        typedWord: typedWord || '[OMITTED]',
                        penalty: `-${penalty.toFixed(1)}`,
                        classification: classification
                    });
                }
            });

            if (typedWords.length > targetWords.length) {
                for (let i = targetWords.length; i < typedWords.length; i++) {
                    errorAuditLog.push({
                        index: i + 1,
                        targetWord: '[NONE - EXTRA WORD]',
                        typedWord: typedWords[i],
                        penalty: '-1.0',
                        classification: 'Full Error (Extra Word Beyond Passage)'
                    });
                }
            }

            const stageResult = {
                stageName: stageConfig.stageName,
                lang: stageConfig.lang,
                durationMins: `${durationDisplay} Mins`,
                grossWpm: grossWpm,
                netWpm: netWpm,
                accuracy: `${accuracy}%`,
                cutoffWpm: `${cutoffWpm} WPM`,
                fullErrors: state.exam.fullErrors,
                halfErrors: state.exam.halfErrors,
                netPenalty: netPenaltyWords.toFixed(1),
                totalKeystrokes: state.exam.totalKeystrokes,
                backspaceCount: state.exam.backspaceCount,
                isQualified: isQualified,
                statusText: isQualified ? 'QUALIFIED' : 'NOT QUALIFIED',
                errorAuditLog: errorAuditLog
            };

            state.completedResults.push(stageResult);

            if (state.sequence.activeStageIndex < state.sequence.stages.length - 1) {
                state.sequence.activeStageIndex++;
                state.sequence.activePhase = 'WARMUP';
                if (modalTransition) modalTransition.classList.add('open');
            } else {
                await saveExamToPersistentHistory();
                await renderFinalScorecard();
            }
        }
    }

    async function saveExamToPersistentHistory() {
        const timeNow = new Date().toLocaleString();
        const firstNetWpm = state.completedResults[0]?.netWpm || '0.0';
        const sigShort = await getOrComputeRecordHash(state.candidate, timeNow, firstNetWpm);

        state.exam.activeSignature = sigShort;

        const record = {
            id: 'rec_' + Date.now(),
            timestamp: timeNow,
            candidate: { ...state.candidate },
            results: [ ...state.completedResults ],
            signature: sigShort
        };

        try {
            let history = JSON.parse(localStorage.getItem('typing_exam_history') || '[]');
            history.unshift(record);
            localStorage.setItem('typing_exam_history', JSON.stringify(history));
        } catch (e) {
            console.error("Failed to save history to localStorage:", e);
        }
    }

    function startBreakInterval() {
        state.breakTimer.remainingSeconds = 120; // 2 Minutes
        const elTimerDisp = document.getElementById('break-timer-display');
        if (elTimerDisp) elTimerDisp.textContent = '02:00';
        
        if (modalBreak) modalBreak.classList.add('open');

        if (btnSkipBreak) {
            btnSkipBreak.style.display = state.admin.fastForwardTestingMode ? 'block' : 'none';
        }

        if (state.breakTimer.intervalId) clearInterval(state.breakTimer.intervalId);
        state.breakTimer.intervalId = setInterval(() => {
            state.breakTimer.remainingSeconds--;
            const mins = Math.floor(state.breakTimer.remainingSeconds / 60);
            const secs = state.breakTimer.remainingSeconds % 60;
            if (elTimerDisp) elTimerDisp.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

            if (state.breakTimer.remainingSeconds <= 0) {
                clearInterval(state.breakTimer.intervalId);
                if (modalBreak) modalBreak.classList.remove('open');
                state.sequence.activePhase = 'ACTUAL';
                startPhaseInstance();
            }
        }, 1000);
    }

    const btnStartStage2 = document.getElementById('btn-start-stage-2');
    if (btnStartStage2) {
        btnStartStage2.addEventListener('click', () => {
            if (modalTransition) modalTransition.classList.remove('open');
            state.sequence.activePhase = 'WARMUP';
            startPhaseInstance();
        });
    }

    // --- 8. PAST RESULTS REPOSITORY CONTROLLER WITH GUARANTEED CRYPTO HASHES ---
    const btnHistoryNav = document.getElementById('btn-history-nav');
    if (btnHistoryNav) {
        btnHistoryNav.addEventListener('click', async () => {
            await renderHistoryTable();
            if (modalHistory) modalHistory.classList.add('open');
        });
    }

    async function renderHistoryTable() {
        const historyTbody = document.getElementById('history-tbody');
        if (!historyTbody) return;

        let history = [];
        try {
            history = JSON.parse(localStorage.getItem('typing_exam_history') || '[]');
        } catch (e) { history = []; }

        historyTbody.innerHTML = '';

        if (history.length === 0) {
            historyTbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:1.5rem; color:var(--text-secondary);">No past candidate records found. Completed exam scorecards will be saved here automatically.</td></tr>`;
            return;
        }

        for (const rec of history) {
            const tr = document.createElement('tr');
            
            let sigDisplay = rec.signature;
            if (!sigDisplay || sigDisplay === 'SHA256-VERIFIED') {
                const netWpm = rec.results && rec.results[0] ? rec.results[0].netWpm : '0.0';
                sigDisplay = await getOrComputeRecordHash(rec.candidate, rec.timestamp, netWpm);
                rec.signature = sigDisplay;
            }

            tr.innerHTML = `
                <td>${rec.timestamp}</td>
                <td><strong>${rec.candidate.name}</strong></td>
                <td>${rec.candidate.dob}</td>
                <td>${rec.candidate.mobile}</td>
                <td><code style="color:var(--accent-cyan); font-weight:bold; font-family:var(--font-mono);">${sigDisplay}</code></td>
                <td>
                    <button type="button" class="btn btn-primary btn-reprint-sc" data-id="${rec.id}" style="padding: 0.35rem 0.75rem; font-size: 0.8rem;">
                        🖨️ View & Print Scorecard
                    </button>
                </td>
            `;
            historyTbody.appendChild(tr);
        }

        document.querySelectorAll('.btn-reprint-sc').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const recId = e.currentTarget.dataset.id;
                const targetRecord = history.find(r => r.id === recId);
                if (targetRecord) {
                    state.candidate = { ...targetRecord.candidate };
                    state.completedResults = [ ...targetRecord.results ];
                    
                    const netWpm = targetRecord.results && targetRecord.results[0] ? targetRecord.results[0].netWpm : '0.0';
                    state.exam.activeSignature = targetRecord.signature || await getOrComputeRecordHash(targetRecord.candidate, targetRecord.timestamp, netWpm);
                    
                    closeAllModals();
                    await renderFinalScorecard();
                }
            });
        });
    }

    const btnClearHistory = document.getElementById('btn-clear-history');
    if (btnClearHistory) {
        btnClearHistory.addEventListener('click', () => {
            if (confirm('Are you sure you want to clear all past candidate scorecards?')) {
                localStorage.removeItem('typing_exam_history');
                renderHistoryTable();
            }
        });
    }

    // --- 9. RENDER CLEAN EXECUTIVE B&W A4 SCORECARD ---
    async function renderFinalScorecard() {
        closeAllModals();
        document.body.classList.remove('no-scroll-exam');
        exitFullscreenMode();

        if (document.getElementById('sc-name')) document.getElementById('sc-name').textContent = state.candidate.name;
        if (document.getElementById('sc-dob')) document.getElementById('sc-dob').textContent = state.candidate.dob;
        if (document.getElementById('sc-mobile')) document.getElementById('sc-mobile').textContent = state.candidate.mobile;
        if (document.getElementById('sc-date')) document.getElementById('sc-date').textContent = new Date().toLocaleString();

        if (document.getElementById('sig-cand-name')) document.getElementById('sig-cand-name').textContent = state.candidate.name;

        let activeSig = state.exam.activeSignature;
        if (!activeSig || activeSig === 'SHA256-VERIFIED') {
            const firstNetWpm = state.completedResults[0]?.netWpm || '0.0';
            activeSig = await getOrComputeRecordHash(state.candidate, new Date().toLocaleString(), firstNetWpm);
            state.exam.activeSignature = activeSig;
        }

        const sigEl = document.getElementById('sc-crypto-sig');
        if (sigEl) sigEl.textContent = activeSig;

        const showQual = state.admin.showQualificationStatus;
        const overallStatusBox = document.getElementById('sc-overall-status-box');
        const colHeadStatus = document.getElementById('col-head-status');

        if (overallStatusBox) overallStatusBox.style.display = showQual ? 'block' : 'none';
        if (colHeadStatus) colHeadStatus.style.display = showQual ? 'table-cell' : 'none';

        const allQualified = state.completedResults.every(r => r.isQualified);
        const overallStatusEl = document.getElementById('sc-overall-status');
        if (overallStatusEl) {
            if (allQualified) {
                overallStatusEl.textContent = 'QUALIFIED (PASSED)';
                overallStatusEl.style.color = 'var(--color-correct)';
            } else {
                overallStatusEl.textContent = 'NOT QUALIFIED';
                overallStatusEl.style.color = 'var(--color-error)';
            }
        }

        const tbody = document.getElementById('sc-results-tbody');
        if (tbody) {
            tbody.innerHTML = '';

            let combinedStrokes = 0;
            let combinedPenalty = 0;
            let combinedBackspace = 0;

            state.completedResults.forEach((res) => {
                combinedStrokes += res.totalKeystrokes;
                combinedPenalty += parseFloat(res.netPenalty);
                combinedBackspace += res.backspaceCount;

                const langLabel = res.lang === 'hi_krutidev' ? 'Hindi (Kruti Dev 010)' : (res.lang === 'hi_remington' ? 'Hindi (Remington Gail)' : (res.lang === 'hi_inscript' ? 'Hindi (InScript)' : 'English QWERTY'));

                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td><strong>${res.stageName}</strong></td>
                    <td>${langLabel}</td>
                    <td>${res.durationMins}</td>
                    <td>${res.grossWpm} WPM</td>
                    <td><strong>${res.netWpm} WPM</strong></td>
                    <td>${res.accuracy}</td>
                    ${showQual ? `<td><strong>${res.statusText}</strong></td>` : ''}
                `;
                tbody.appendChild(tr);
            });

            if (document.getElementById('sc-total-keystrokes')) document.getElementById('sc-total-keystrokes').textContent = `${combinedStrokes} Strokes`;
            if (document.getElementById('sc-total-penalty')) document.getElementById('sc-total-penalty').textContent = `${combinedPenalty.toFixed(1)} Words`;
            if (document.getElementById('sc-backspace-count')) document.getElementById('sc-backspace-count').textContent = `${combinedBackspace} Press`;
        }

        if (viewTyping) viewTyping.style.display = 'none';
        if (viewHome) viewHome.style.display = 'block';
        if (modalScorecard) modalScorecard.classList.add('open');
    }

    // --- 10. EXAMINER ADMIN CONTROLLER & PASSAGE DATABASE MANAGER ---
    const btnAdminModal = document.getElementById('btn-admin-modal');
    if (btnAdminModal) {
        btnAdminModal.addEventListener('click', () => {
            if (modalAdmin) modalAdmin.classList.add('open');
            if (state.admin.isUnlocked) renderPassageManagerTable();
        });
    }

    const btnConfirmAdminAuth = document.getElementById('btn-confirm-admin-auth');
    if (btnConfirmAdminAuth) {
        btnConfirmAdminAuth.addEventListener('click', async () => {
            const pwdInput = document.getElementById('input-admin-password');
            const pwd = pwdInput ? pwdInput.value : '';
            const inputHash = await hashSHA256(pwd);

            if (inputHash === ADMIN_PASSWORD_SHA256) {
                state.admin.isUnlocked = true;
                if (document.getElementById('admin-auth-container')) document.getElementById('admin-auth-container').style.display = 'none';
                if (document.getElementById('admin-dashboard-container')) document.getElementById('admin-dashboard-container').style.display = 'block';
                renderPassageManagerTable();
            } else {
                alert('❌ Invalid Admin Password!');
            }
        });
    }

    function renderPassageManagerTable() {
        const tbody = document.getElementById('passage-list-tbody');
        if (!tbody) return;

        tbody.innerHTML = '';
        if (passageDatabase.length === 0) {
            tbody.innerHTML = `<tr><td colspan="3" style="text-align:center; color:var(--text-secondary); padding:0.75rem;">No passages in database. Add a custom passage below!</td></tr>`;
            return;
        }

        passageDatabase.forEach((p, idx) => {
            const tr = document.createElement('tr');
            const isHindi = p.lang.startsWith('hi_');
            const langLabel = p.lang === 'hi_krutidev' ? 'Hindi (Kruti Dev 010)' : (p.lang === 'hi_remington' ? 'Hindi (Remington Gail)' : (p.lang === 'hi_inscript' ? 'Hindi (InScript)' : 'English QWERTY'));
            
            tr.innerHTML = `
                <td class="${isHindi ? 'hindi-font' : ''}"><strong>${p.title}</strong></td>
                <td>${langLabel}</td>
                <td>
                    <button type="button" class="btn btn-danger btn-delete-passage" data-index="${idx}" style="padding: 0.25rem 0.5rem; font-size: 0.75rem;">
                        🗑️ Delete
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
        });

        document.querySelectorAll('.btn-delete-passage').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.currentTarget.dataset.index, 10);
                if (confirm(`Are you sure you want to delete "${passageDatabase[index].title}"?`)) {
                    passageDatabase.splice(index, 1);
                    savePassageDatabase(passageDatabase);
                    renderPassageManagerTable();
                }
            });
        });
    }

    const btnApplyAdminSettings = document.getElementById('btn-apply-admin-settings');
    if (btnApplyAdminSettings) {
        btnApplyAdminSettings.addEventListener('click', () => {
            const elHindiFont = document.getElementById('admin-hindi-font-engine');
            const elBackspace = document.getElementById('admin-select-backspace');
            const elToggleQual = document.getElementById('admin-toggle-qualification');
            const elToggleFF = document.getElementById('admin-toggle-fast-forward');

            if (elHindiFont) state.admin.hindiFontEngine = elHindiFont.value;
            if (elBackspace) state.config.backspaceRule = elBackspace.value;
            if (elToggleQual) state.admin.showQualificationStatus = (elToggleQual.value === 'on');
            if (elToggleFF) state.admin.fastForwardTestingMode = (elToggleFF.value === 'on');

            if (modalAdmin) modalAdmin.classList.remove('open');
            alert('✅ Admin Configurations successfully saved!');
        });
    }

    const btnSaveCustomLesson = document.getElementById('btn-save-custom-lesson');
    if (btnSaveCustomLesson) {
        btnSaveCustomLesson.addEventListener('click', () => {
            const elTitle = document.getElementById('lesson-title');
            const elText = document.getElementById('lesson-text');
            const elLang = document.getElementById('lesson-lang');

            const title = elTitle ? elTitle.value.trim() : '';
            const text = elText ? elText.value.trim() : '';
            const lang = elLang ? elLang.value : 'hi_krutidev';

            if (!title || !text) {
                alert('Please enter both Title and Text.');
                return;
            }

            passageDatabase.push({
                id: 'custom_' + Date.now(),
                title: title,
                lang: lang,
                text: text
            });

            savePassageDatabase(passageDatabase);
            renderPassageManagerTable();

            alert('✅ Custom Passage added to Database & saved!');
            if (elTitle) elTitle.value = '';
            if (elText) elText.value = '';
        });
    }

    // Close Modals
    document.querySelectorAll('.modal-close-btn').forEach(btn => {
        btn.addEventListener('click', closeAllModals);
    });

    // CLEAN PRINT ENGINE
    const btnPrintScorecard = document.getElementById('btn-print-scorecard');
    if (btnPrintScorecard) {
        btnPrintScorecard.addEventListener('click', () => {
            if (modalScorecard) modalScorecard.classList.add('print-active');
            window.print();
            setTimeout(() => {
                if (modalScorecard) modalScorecard.classList.remove('print-active');
            }, 1000);
        });
    }

    // Export JSON Report
    const btnExportJson = document.getElementById('btn-export-json');
    if (btnExportJson) {
        btnExportJson.addEventListener('click', () => {
            const dataReport = {
                candidate: state.candidate,
                results: state.completedResults,
                signature: state.exam.activeSignature || 'SHA256-VERIFIED',
                timestamp: new Date().toISOString()
            };

            const blob = new Blob([JSON.stringify(dataReport, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `ExamCertificate_${state.candidate.dob.replace(/\//g, '')}_${Date.now()}.json`;
            a.click();
            URL.revokeObjectURL(url);
        });
    }

});
