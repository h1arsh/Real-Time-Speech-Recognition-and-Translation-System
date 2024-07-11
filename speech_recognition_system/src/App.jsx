import React, { useEffect, useState } from "react";
import 'regenerator-runtime/runtime'; // Import regenerator-runtime
import "./App.css";
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import useClipboard from "react-use-clipboard";

const languages = {
  'French': 'fr',
  'Spanish': 'es',
  'German': 'de',
  'Chinese': 'zh-CN',
  'Japanese': 'ja',
  'Hindi': 'hi',
  // Add more languages as needed
};

const App = () => {
  const [textToCopy, setTextToCopy] = useState('');
  const [isCopied, setCopied] = useClipboard(textToCopy, {
    successDuration: 1000
  });
  const [translatedText, setTranslatedText] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('fr');

  const startListening = () => SpeechRecognition.startListening({ continuous: true, language: 'en-IN' });
  const { transcript, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();

  useEffect(() => {
    setTextToCopy(transcript);
  }, [transcript]);

  const translateText = async () => {
    if (transcript) {
      try {
        const res = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(transcript)}&langpair=en|${selectedLanguage}`);
        
        const data = await res.json();
        if (data.responseData.translatedText) {
          setTranslatedText(data.responseData.translatedText);
          setTextToCopy(data.responseData.translatedText); // Copy translated text
        } else {
          console.error("Translation error: No translated text found");
        }
      } catch (err) {
        console.error("Translation error:", err);
      }
    } else {
      setTranslatedText('');
    }
  };

  const clearAll = () => {
    resetTranscript();
    setTextToCopy('');
    setTranslatedText('');
  };

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser does not support speech recognition.</span>;
  }

  return (
    <>
      <div className="container">
        <h2 className="title">Speech to Text Converter</h2>
        <br />
        <p>An Application that converts speech from the microphone to text and translates it into some other Languages.</p>

        <div className="main-content" onClick={() => setTextToCopy(transcript)}>
          {transcript}
        </div>

        <div className="btn-style">
          <button onClick={setCopied}>
            {isCopied ? 'Copied!' : 'Copy to clipboard'}
          </button>
          <button onClick={startListening}>Start Listening</button>
          <button onClick={SpeechRecognition.stopListening}>Stop Listening</button>
        </div>

        <div className="dropdown">
          <label htmlFor="language-select">Select Language: </label>
          <select
            id="language-select"
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
          >
            {Object.keys(languages).map((lang) => (
              <option key={lang} value={languages[lang]}>
                {lang}
              </option>
            ))}
          </select>
        </div>

        <div className="translated-content">
          {translatedText}
        </div>

        <div className="btn-style">
          <button onClick={clearAll}>Clear</button>
          <button onClick={translateText}>Translate</button>
        </div>
      </div>
    </>
  );
};

export default App;
