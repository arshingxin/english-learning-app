const Recognition = () => window.SpeechRecognition || window.webkitSpeechRecognition;

export function recognitionSupported() {
  return Boolean(Recognition());
}

export const NORMAL_RATE = 1;
export const SLOW_RATE = 0.6;

// Some engines (and embedded browsers) never report that speech finished, so we stop
// waiting after roughly as long as the sentence should take to say.
export function speakTimeoutMs(text, rate = NORMAL_RATE) {
  const wordCount = text.trim().split(/\s+/).length;
  return Math.round(1200 + (450 * wordCount) / rate);
}

// Devices often list novelty voices (Bubbles, Bells, ...) first; a child should hear a normal one.
const NOVELTY_VOICES = /^(Albert|Bad News|Bahh|Bells|Boing|Bubbles|Cellos|Good News|Jester|Organ|Superstar|Trinoids|Whisper|Wobble|Zarvox|Fred|Junior|Kathy|Ralph)\b/i;
const PREFERRED_VOICES = /Samantha|Ava|Allison|Susan|Karen|Google US English|Microsoft (Aria|Jenny|Zira|Guy)|Natural/i;

export function pickVoice(voices) {
  const english = voices.filter((v) => /^en([-_]US)?$/i.test(v.lang) && !NOVELTY_VOICES.test(v.name));
  return english.find((v) => PREFERRED_VOICES.test(v.name)) ?? english.find((v) => /^en[-_]US$/i.test(v.lang)) ?? null;
}

export function speak(text, { slow = false } = {}) {
  const synth = window.speechSynthesis;
  if (!synth) return Promise.resolve();
  return new Promise((resolve) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = slow ? SLOW_RATE : NORMAL_RATE;
    const voice = pickVoice(synth.getVoices());
    if (voice) utterance.voice = voice;
    const timer = setTimeout(resolve, speakTimeoutMs(text, utterance.rate));
    const finish = () => {
      clearTimeout(timer);
      resolve();
    };
    utterance.onend = finish;
    utterance.onerror = finish;
    synth.cancel();
    synth.speak(utterance);
  });
}

// How long we wait for the engine before treating the try as "heard nothing".
export const LISTEN_TIMEOUT_MS = 10000;

// Resolves to { heard } on success or { error }: 'not-allowed', 'no-speech', 'timeout',
// 'start-failed', ... It always resolves, so the caller can never get stuck listening.
export function listenOnce() {
  return new Promise((resolve) => {
    let recognition = null;
    let timer = null;
    let settled = false;
    const done = (value) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      resolve(value);
    };

    try {
      const Ctor = Recognition();
      recognition = new Ctor();
      recognition.lang = 'en-US';
      recognition.interimResults = false;
      recognition.maxAlternatives = 3;
      recognition.onresult = (event) => {
        const result = event.results[event.resultIndex];
        done({ heard: Array.from(result, (alt) => alt.transcript) });
      };
      recognition.onerror = (event) => done({ error: event.error });
      recognition.onend = () => done({ error: 'no-speech' });
      timer = setTimeout(() => {
        try {
          recognition.abort();
        } catch {
          /* already stopped */
        }
        done({ error: 'timeout' });
      }, LISTEN_TIMEOUT_MS);
      recognition.start();
    } catch {
      done({ error: 'start-failed' });
    }
  });
}
