"use client";

import { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";

interface AudioRecorderProps {
  onResult: (blob: Blob) => void;
  disabled?: boolean;
}

export function AudioRecorder({ onResult, disabled }: AudioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "audio/webm;codecs=opus",
      });

      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        onResult(blob);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      mediaRecorderRef.current = mediaRecorder;
      setIsRecording(true);
    } catch {
      alert("Could not access microphone. Please check permissions.");
    }
  }, [onResult]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  }, []);

  return (
    <div className="flex flex-col items-center gap-4">
      <button
        onClick={isRecording ? stopRecording : startRecording}
        disabled={disabled}
        className={`relative flex items-center justify-center w-20 h-20 rounded-full transition-colors ${
          isRecording
            ? "bg-red-500 hover:bg-red-600"
            : "bg-slate-800 hover:bg-slate-700"
        } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
      >
        {isRecording && (
          <motion.div
            className="absolute inset-0 rounded-full bg-red-400"
            animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        )}
        <div
          className={`relative z-10 ${
            isRecording ? "w-6 h-6 rounded bg-white" : "w-4 h-4 rounded-full bg-red-500"
          }`}
        />
      </button>
      <p className="text-sm text-slate-500">
        {disabled
          ? "Processing..."
          : isRecording
          ? "Recording... Click to stop"
          : "Click to start recording"}
      </p>
    </div>
  );
}
