"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useAnalysis } from "@/hooks/useAnalysis";
import { CorrectedTranscript } from "@/components/CorrectedTranscript";
import { AudioRecorder } from "@/components/AudioRecorder";
//
type Tab = "type" | "speak";

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>("type");
  const [text, setText] = useState("");
  const { isLoading, error, result, transcription, analyze, transcribe, reset } =
    useAnalysis();

  const handleAnalyze = () => {
    if (text.trim()) {
      analyze(text.trim());
    }
  };

  const handleRecord = (blob: Blob) => {
    transcribe(blob);
  };

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    reset();
    setText("");
  };

  return (
    <main className="flex-1 flex items-start justify-center px-4 py-12 bg-slate-50">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900">DeutschFlow</h1>
          <p className="text-slate-500 mt-2">
            AI-powered German grammar analysis for A1 learners
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-slate-200">
            {(["type", "speak"] as Tab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => handleTabChange(tab)}
                className={`flex-1 py-3 text-sm font-medium transition-colors relative ${
                  activeTab === tab
                    ? "text-slate-900"
                    : "text-slate-400 hover:text-slate-600"
                }`}
              >
                {tab === "type" ? "Type" : "Speak"}
                {activeTab === tab && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-900"
                  />
                )}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="p-6">
            {activeTab === "type" ? (
              <div className="space-y-4">
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Schreibe einen deutschen Satz..."
                  className="w-full h-32 p-3 border border-slate-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-slate-300 text-slate-900 placeholder:text-slate-400"
                  disabled={isLoading}
                />
                <button
                  onClick={handleAnalyze}
                  disabled={isLoading || !text.trim()}
                  className="w-full py-2.5 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Analyzing..." : "Analyze"}
                </button>
              </div>
            ) : (
              <AudioRecorder onResult={handleRecord} disabled={isLoading} />
            )}

            {/* Loading */}
            {isLoading && (
              <div className="mt-6 flex justify-center">
                <motion.div
                  className="w-6 h-6 border-2 border-slate-300 border-t-slate-800 rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            {/* Transcription */}
            {transcription && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-xs font-medium text-blue-500 uppercase tracking-wide mb-1">
                  Transcription
                </p>
                <p className="text-blue-900">{transcription}</p>
              </div>
            )}

            {/* Results */}
            {result && <CorrectedTranscript analysis={result} />}
          </div>
        </div>
      </div>
    </main>
  );
}
