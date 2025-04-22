import { useState } from 'react';
import './index.css';

function App() {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState('Get your result here...');
  const [isLoading, setIsLoading] = useState(false);

  const checkURL = async () => {
    setResult("Scanning... please wait.");
    setIsLoading(true); // Show loading spinner

    try {
      // Step 1: Submit URL for scanning
      const encodedUrl = btoa(url); // VirusTotal requires base64-encoded URL
      const scanResponse = await fetch("https://www.virustotal.com/api/v3/urls", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "x-apikey": "YOUR_API_KEY_HERE",
        },
        body: `url=${encodedUrl}`,
      });

      const scanData = await scanResponse.json();
      const analysisId = scanData.data.id;

      // Step 2: Get analysis report using ID
      const resultResponse = await fetch(
        `https://www.virustotal.com/api/v3/analyses/${analysisId}`,
        {
          headers: {
            "x-apikey": "YOUR_API_KEY_HERE",
          },
        }
      );

      const resultData = await resultResponse.json();

      const stats = resultData.data.attributes.stats;
      setResult(
        `✔ Harmless: ${stats.harmless} | ⚠ Suspicious: ${stats.suspicious} | ❌ Malicious: ${stats.malicious}`
      );
    } catch (err) {
      setResult("❌ Error while checking. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false); // Hide loading spinner
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-teal-400">
      <h1 className="text-2xl font-bold text-white">Your Online Security Checker</h1>

      <input
        type="url"
        placeholder="Enter Your URL"
        className="p-2 rounded-l w-80"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />

      <button
        className="bg-orange-500 rounded-xl p-2 text-white hover:bg-orange-600 transition"
        onClick={checkURL}
        disabled={isLoading}
      >
        {isLoading ? 'Scanning...' : 'Submit URL'}
      </button>

      <h2 className="text-white mt-6">Result</h2>
      <textarea
        readOnly
        className="w-80 h-40 p-2 rounded bg-white text-gray-700 border-2 border-gray-300"
        value={result}
      />
    </div>
  );
}

export default App;
