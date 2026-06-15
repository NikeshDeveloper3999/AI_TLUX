(function () {

    const script = document.currentScript;
    const userId = script?.dataset?.userId
    const theme = "dark"

    let assistantConfig = null

    // load CSS
    const link = document.createElement("link")
    link.rel = "stylesheet"
    link.href = "http://localhost:5173/assistant.css"
    document.head.appendChild(link)

    // ─── SVG Icons ───

    const LOGO_SVG = `<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M40 8C46 16 52 20 52 28C52 36 46 40 40 48C34 40 28 36 28 28C28 20 34 16 40 8Z" fill="currentColor" opacity="0.9"/>
      <path d="M32 42C28 48 24 50 24 56C24 62 28 66 32 70L40 62L48 70C52 66 56 62 56 56C56 50 52 48 48 42" fill="currentColor" opacity="0.6"/>
      <circle cx="40" cy="62" r="3" fill="currentColor" opacity="0.4"/>
    </svg>`

    const MIC_SVG = `<svg viewBox="0 0 48 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="14" y="4" width="20" height="28" rx="10" stroke="currentColor" stroke-width="3" fill="none"/>
      <path d="M24 36V44" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
      <path d="M10 28C10 36 16 44 24 44C32 44 38 36 38 28" stroke="currentColor" stroke-width="3" stroke-linecap="round" fill="none"/>
      <path d="M16 52H32" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
      <path d="M24 44V52" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
    </svg>`

    const CLOSE_SVG = `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`

    // ─── Create Popup ───

    const popup = document.createElement("div")
    popup.className = `shifra-popup theme-${theme}`

    popup.innerHTML = `
    <div class="shifra-overlay"></div>
    <div class="shifra-glow-border"></div>
    <button class="shifra-close">${CLOSE_SVG}</button>

    <div class="shifra-content">

       <div class="shifra-top">
            <div class="shifra-orb-wrap">

                <div class="shifra-orb-glow"></div>
                <div class="shifra-orb">
                   <div class="shifra-orb-highlight"></div>
                </div>
                <div class="shifra-orb-shimmer"></div>

            </div>

            <h2 class="shifra-title">
                Hello! I'm Shifra AI
            </h2>

            <p class="shifra-sub">
                Your smart voice assistant.
                <br />
                Ask anything about your website.
            </p>


            <div class="shifra-status">
                Tap button to Speak
            </div>

            <div class="shifra-wave">
                <span></span><span></span><span></span><span></span>
                <span></span><span></span><span></span><span></span>
            </div>

            <div class="shifra-user-text"></div>

            <div class="shifra-ai-text">
              <span class="shifra-ai-text-inner"></span>
              <span class="shifra-cursor"></span>
            </div>

        </div>


        <div class="shifra-bottom">
            <div class="shifra-mic-ring"></div>
            <div class="shifra-mic-ring-2"></div>
            <button class="shifra-mic">
               ${MIC_SVG}
            </button>
        </div>
    </div>
    `;

    document.body.appendChild(popup);

    // ─── Floating Button ───

    const button = document.createElement("button")
    button.className = `shifra-btn theme-${theme}`
    button.innerHTML = `<span class="shifra-btn-inner">${LOGO_SVG}</span>`
    document.body.appendChild(button)

    // ─── DOM refs ───
    const closeBtn = popup.querySelector(".shifra-close")
    const mic = popup.querySelector(".shifra-mic")
    const status = popup.querySelector(".shifra-status")
    const wave = popup.querySelector(".shifra-wave")
    const micRing = popup.querySelector(".shifra-mic-ring")
    const micRing2 = popup.querySelector(".shifra-mic-ring-2")
    const userText = popup.querySelector(".shifra-user-text")
    const aiTextInner = popup.querySelector(".shifra-ai-text-inner")
    const cursor = popup.querySelector(".shifra-cursor")

    // ─── Toggle Popup ───

    let open = false

    const openPopup = () => {
        open = true
        popup.style.display = "flex"
        popup.classList.remove("closing")
        requestAnimationFrame(() => popup.classList.add("opening"))
    }

    const closePopup = () => {
        open = false
        popup.classList.remove("opening")
        popup.classList.add("closing")
        setTimeout(() => {
            popup.style.display = "none"
            popup.classList.remove("closing")
        }, 250)
    }

    button.onclick = () => {
        if (open) { closePopup() } else { openPopup() }
    }

    closeBtn.onclick = () => closePopup()

    // ─── Voice Selection ───

    let selectedVoice = null

    const findVoice = (preference) => {
        const voices = window.speechSynthesis.getVoices()
        const isMale = preference === "male"
        const preferred = isMale
            ? ['google uk english male', 'alex', 'daniel', 'fred', 'male', 'us english male', 'junior', 'david', 'tom']
            : ['google uk english female', 'samantha', 'fiona', 'female', 'us english female', 'karen', 'moira', 'tessa', 'veena', 'zoe', 'female']
        for (const keyword of preferred) {
            for (const v of voices) {
                if (v.name.toLowerCase().includes(keyword)) {
                    selectedVoice = v
                    return
                }
            }
        }
        if (voices.length > 0) selectedVoice = voices[0]
    }

    // ─── Load Assistant ───

    const loadAssistant = async () => {
        try {
            const res = await fetch(`http://localhost:8000/api/assistant/config/${userId}`)

            if (!res.ok) {
                throw new Error(`HTTP ${res.status}`)
            }

            const data = await res.json()

            if (data) {
                assistantConfig = data.user
                applyConfig()
            }

        } catch (error) {
            console.log("Assistant Load Error:", error);
            // Use default config if user not found
            assistantConfig = {
                assistantName: "Shifra",
                businessName: "Your Business",
                voice: "male",
                theme: "dark"
            }
            applyConfig()
        }
    }

    const applyConfig = () => {
        if (!assistantConfig) return;

        popup.className = `shifra-popup theme-${assistantConfig.theme}`
        button.className = `shifra-btn theme-${assistantConfig.theme}`

        const title = popup.querySelector(".shifra-title")
        title.innerHTML = `Hello! I'm ${assistantConfig.assistantName}`;

        const subTitle = popup.querySelector(".shifra-sub")
        subTitle.innerHTML = `
    Welcome to
    ${assistantConfig.businessName}.
    <br />
    Ask anything about your website.
  `;

        findVoice(assistantConfig.voice || "male")

    }

    loadAssistant()

    window.speechSynthesis.onvoiceschanged = () => findVoice(assistantConfig?.voice || "male")
    // ─── Speech ───

    const typeText = (el, text) => {
        el.innerText = "";
        cursor.style.display = "inline-block";
        let i = 0;
        const interval = setInterval(() => {
            el.innerText += text[i];
            i++;
            if (i >= text.length) {
                clearInterval(interval);
                cursor.style.display = "none";
            }
        }, 30);
    }

    const speak = (text) => {
        window.speechSynthesis.cancel();

        typeText(aiTextInner, text)

        status.innerText = "AI Speaking...";

        const speech = new SpeechSynthesisUtterance(text)
        speech.lang = "hi-IN";
        if (selectedVoice) speech.voice = selectedVoice;
        speech.rate = 0.92;
        speech.pitch = 0.8;
        speech.volume = 1;

        speech.onend = () => {
            status.innerText = "Tap button to Speak";
            wave.style.opacity = "0";
            micRing.classList.remove("active");
            micRing2.classList.remove("active");
        };

        window.speechSynthesis.speak(speech);
    }


    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

    if (SpeechRecognition) {

        const recognition = new SpeechRecognition();
        recognition.lang = "en-US";
        recognition.continuous = false;
        recognition.interimResults = false;

        mic.onclick = () => {
            wave.style.opacity = "1";
            micRing.classList.add("active");
            micRing2.classList.add("active");

            status.innerText = "Listening...";
            userText.innerText = "";
            aiTextInner.innerText = "";
            cursor.style.display = "none";

            recognition.start();
        }

        recognition.onresult = (e) => {
            const text = e.results[0][0].transcript
            userText.innerText = "You: " + text;
            recognition.stop();

            setTimeout(async () => {
                try {
                    status.innerText = "Thinking...";

                    const res = await fetch("http://localhost:8000/api/assistant/ask", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ message: text, userId })
                    })

                    const data = await res.json()

                    if (data.success) {
                        if (data.action === "navigate") {
                            speak(data.response)
                            setTimeout(() => { window.location.href = data.path }, 1500)
                        } else {
                            speak(data.aiResponse)
                        }
                    } else {
                        speak("Response Error please try again")
                    }

                } catch (error) {
                    console.log(error)
                    speak("AI Server Error")
                }
            }, 600)
        };

        recognition.onerror = () => {
            status.innerText = "Tap button to Speak";
            wave.style.opacity = "0";
            micRing.classList.remove("active");
            micRing2.classList.remove("active");
        }

    } else {
        status.innerText = "Speech Recognition not supported";
    }

})();
