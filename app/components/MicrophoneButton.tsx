'use client';

import { useState } from 'react';
import axios from 'axios';

const MicrophoneButton = () => {
  const VOICEFLOW_API_KEY = process.env.VOICEFLOW_API_KEY;
  const VOICEFLOW_VERSION_ID = process.env.VOICEFLOW_VERSION_ID;

  let mediaRecorder;
  let audioChunks = [];
  const [isRecording, setIsRecording] = useState<boolean>(false);

  async function startRecording() {
    try {
      setIsRecording(true);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder = new MediaRecorder(stream);
      audioChunks = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      mediaRecorder.onstop = sendAudioToGroq;

      mediaRecorder.start();
      recordButton.textContent = '⏹️';
      status.textContent = 'Recording... Click to stop';
    } catch (error) {
      console.error('Error accessing microphone:', error);
      status.textContent = 'Error accessing microphone';
    }
  }

  function stopRecording() {
    mediaRecorder.stop();
    setIsRecording(false);
    recordButton.textContent = '🎤';
    status.textContent = 'Processing...';
  }

  const handleMicClick = () => {
    if (!isRecording) {
      startRecording();
    } else {
      stopRecording();
    }
  };

  async function TTS(text: string) {
    try {
      const response = await axios.post(
        'https://api.v7.unrealspeech.com/stream',
        {
          Text: text,
          VoiceId: 'Will', // You can change this to Scarlett, Liv, Will, or Amy
          Bitrate: '192k',
          Speed: '0',
          Pitch: '1.27',
          Codec: 'libmp3lame',
        },
        {
          headers: {
            Authorization:
              'Bearer eTqIM2sw8B50N5k9RhXHLQ5wckReM04tstSbT5UwWfKKPeBabcoLVp',
            'Content-Type': 'application/json',
          },
          responseType: 'arraybuffer',
        }
      );

      const audioContext = new (window.AudioContext ||
        window.webkitAudioContext)();
      const audioBuffer = await audioContext.decodeAudioData(response.data);
      const source = audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContext.destination);
      source.start(0);
    } catch (error) {
      console.error('Error using Unreal Speech API:', error);
      status.textContent = 'Error generating speech';
    }
  }

  async function sendAudioToGroq() {
    const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
    const formData = new FormData();
    formData.append('file', audioBlob, 'audio.webm');
    formData.append('model', 'whisper-large-v3');

    try {
      const response = await axios.post(
        'https://api.groq.com/openai/v1/audio/transcriptions',
        formData,
        {
          headers: {
            Authorization:
              'Bearer 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',
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      transcription.textContent = response.data.text;
      status.textContent = 'Transcription complete';
      sendToVoiceflow(response.data.text);
    } catch (error) {
      console.error('Error transcribing audio:', error);
      status.textContent = 'Error transcribing audio';
    }
  }

  async function sendToVoiceflow(text) {
    try {
      const response = await axios.post(
        `https://general-runtime.voiceflow.com/state/user/test/interact`,
        {
          action: {
            type: 'text',
            payload: text,
          },
        },
        {
          headers: {
            Authorization: VOICEFLOW_API_KEY,
            versionID: VOICEFLOW_VERSION_ID,
          },
        }
      );

      // Display the Voiceflow response
      const voiceflowResponse = response.data.find(
        (item) => item.type === 'text'
      );
      if (voiceflowResponse) {
        const message = voiceflowResponse.payload.message;
        voiceflowResponseElement.textContent = message;
        readOutLoud(message); // Trigger text-to-speech for the Voiceflow response
      }
    } catch (error) {
      console.error('Error sending to Voiceflow:', error);
      status.textContent = 'Error getting response from Voiceflow';
    }
  }

  return (
    <button
      className='microphone-button'
      style={{
        position: 'fixed',
        bottom: '20px',
        left: '20px',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(145deg, #3498db, #2980b9)',
        padding: '16px',
        borderRadius: '50%',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)',
        color: 'white',
        border: 'none',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
      }}
      onClick={handleMicClick}
    >
      <svg
        xmlns='http://www.w3.org/2000/svg'
        viewBox='0 0 24 24'
        width='24px'
        height='24px'
        fill='currentColor'
      >
        <path d='M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm-1-9c0-.55.45-1 1-1s1 .45 1 1v6c0 .55-.45 1-1 1s-1-.45-1-1V5zm6 6c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z' />
      </svg>
    </button>
  );
};

export default MicrophoneButton;