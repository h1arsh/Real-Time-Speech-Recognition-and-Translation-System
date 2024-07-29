import React, { useEffect, useState } from "react";
import 'regenerator-runtime/runtime'; // Import regenerator-runtime
import "./App.css";
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import useClipboard from "react-use-clipboard";

const languages = {
  'Afrikaans': 'af',
  'Albanian': 'sq',
  'Amharic': 'am',
  'Arabic': 'ar',
  'Armenian': 'hy',
  'Azerbaijani': 'az',
  'Basque': 'eu',
  'Belarusian': 'be',
  'Bengali': 'bn',
  'Bosnian': 'bs',
  'Bulgarian': 'bg',
  'Catalan': 'ca',
  'Cebuano': 'ceb',
  'Chichewa': 'ny',
  'Chinese': 'zh-CN',
  'Corsican': 'co',
  'Croatian': 'hr',
  'Czech': 'cs',
  'Danish': 'da',
  'Dutch': 'nl',
  'English': 'en',
  'Esperanto': 'eo',
  'Estonian': 'et',
  'Filipino': 'tl',
  'Finnish': 'fi',
  'French': 'fr',
  'Galician': 'gl',
  'Georgian': 'ka',
  'German': 'de',
  'Greek': 'el',
  'Gujarati': 'gu',
  'Haitian Creole': 'ht',
  'Hausa': 'ha',
  'Hawaiian': 'haw',
  'Hebrew': 'he',
  'Hindi': 'hi',
  'Hmong': 'hmn',
  'Hungarian': 'hu',
  'Icelandic': 'is',
  'Igbo': 'ig',
  'Indonesian': 'id',
  'Irish': 'ga',
  'Italian': 'it',
  'Japanese': 'ja',
  'Javanese': 'jw',
  'Kannada': 'kn',
  'Kazakh': 'kk',
  'Khmer': 'km',
  'Kinyarwanda': 'rw',
  'Korean': 'ko',
  'Kurdish': 'ku',
  'Kyrgyz': 'ky',
  'Lao': 'lo',
  'Latin': 'la',
  'Latvian': 'lv',
  'Lithuanian': 'lt',
  'Luxembourgish': 'lb',
  'Macedonian': 'mk',
  'Malagasy': 'mg',
  'Malay': 'ms',
  'Malayalam': 'ml',
  'Maltese': 'mt',
  'Maori': 'mi',
  'Marathi': 'mr',
  'Mongolian': 'mn',
  'Myanmar (Burmese)': 'my',
  'Nepali': 'ne',
  'Norwegian': 'no',
  'Odia (Oriya)': 'or',
  'Pashto': 'ps',
  'Persian': 'fa',
  'Polish': 'pl',
  'Portuguese': 'pt',
  'Punjabi': 'pa',
  'Romanian': 'ro',
  'Russian': 'ru',
  'Samoan': 'sm',
  'Scots Gaelic': 'gd',
  'Serbian': 'sr',
  'Sesotho': 'st',
  'Shona': 'sn',
  'Sindhi': 'sd',
  'Sinhala': 'si',
  'Slovak': 'sk',
  'Slovenian': 'sl',
  'Somali': 'so',
  'Spanish': 'es',
  'Sundanese': 'su',
  'Swahili': 'sw',
  'Swedish': 'sv',
  'Tajik': 'tg',
  'Tamil': 'ta',
  'Tatar': 'tt',
  'Telugu': 'te',
  'Thai': 'th',
  'Turkish': 'tr',
  'Turkmen': 'tk',
  'Ukrainian': 'uk',
  'Urdu': 'ur',
  'Uyghur': 'ug',
  'Uzbek': 'uz',
  'Vietnamese': 'vi',
  'Welsh': 'cy',
  'Xhosa': 'xh',
  'Yiddish': 'yi',
  'Yoruba': 'yo',
  'Zulu': 'zu',
  // Add more languages if needed
};

const App = () => {
  const [textToCopy, setTextToCopy] = useState('');
  const [isCopied, setCopied] = useClipboard(textToCopy, {
    successDuration: 1000
  });
  const [translatedText, setTranslatedText] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('fr');
  const [fromText, setFromText] = useState('');
  const [toText, setToText] = useState('');

  const startListening = () => SpeechRecognition.startListening({ continuous: true, language: 'en-IN' });
  const { transcript, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();

  useEffect(() => {
    setFromText(transcript);
  }, [transcript]);

  const translateText = async () => {
    if (fromText) {
      try {
        const apiUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(fromText)}&langpair=en|${selectedLanguage}`;
        const res = await fetch(apiUrl);
        const data = await res.json();
        if (data.responseData.translatedText) {
          setTranslatedText(data.responseData.translatedText);
          setToText(data.responseData.translatedText); // Set translated text
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
    setFromText('');
    setTextToCopy('');
    setTranslatedText('');
    setToText('');
  };

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser does not support speech recognition.</span>;
  }

  return (
    <>
      <div className="container">
        <h2 className="title">Speech to Text Converter</h2>
        <br />
        <p>An Application that converts speech from the microphone to text and translates it into various languages.</p>

        <div className="main-content" >
          {fromText}
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
