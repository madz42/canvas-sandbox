'use client';

import React, { useState } from 'react';

interface AICopyHelperProps {
  onApply: (text: string) => void;
  disabled: boolean;
}

export function AICopyHelper({ onApply, disabled }: AICopyHelperProps) {
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!prompt) return;
    setLoading(true);
    setTimeout(() => {
      setResult('Transform your brand with our new collection!');
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="card bg-base-100 shadow p-4 mt-4">
      <h3 className="font-bold text-sm mb-2">AI Copy Helper</h3>
      <textarea
        className="textarea textarea-bordered h-24 text-sm mb-2"
        placeholder="Describe your product..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      ></textarea>

      <button className="btn btn-sm btn-outline mb-2" onClick={handleGenerate} disabled={loading || !prompt}>
        {loading ? 'Generating...' : 'Generate Copy'}
      </button>

      {result && <div className="bg-base-200 p-2 rounded text-sm mb-2">{result}</div>}

      <button className="btn btn-sm btn-primary" disabled={disabled || !result} onClick={() => onApply(result)}>
        Apply to Selected Layer
      </button>
    </div>
  );
}
