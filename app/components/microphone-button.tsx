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
        position: 'absolute',
        top: '10px',
        left: '10px',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        background: 'rgba(255, 255, 255, 0.8)',
        padding: '20px',
        borderRadius: '5px',
        boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.2)',
        color: 'black',
      }}
      onClick={handleMicClick}>
      <svg
        xmlns='http://www.w3.org/2000/svg'
        viewBox='0 0 24 24'
        width='30px'
        height='30px'
        fill='currentColor'>
        <path d='m439.5,236c0-11.3-9.1-20.4-20.4-20.4s-20.4,9.1-20.4,20.4c0,70-64,126.9-142.7,126.9-78.7,0-142.7-56.9-142.7-126.9 0-11.3-9.1-20.4-20.4-20.4s-20.4,9.1-20.4,20.4c0,86.2 71.5,157.4 163.1,166.7v57.5h-23.6c-11.3,0-20.4,9.1-20.4,20.4 0,11.3 9.1,20.4 20.4,20.4h88c11.3,0 20.4-9.1 20.4-20.4 0-11.3-9.1-20.4-20.4-20.4h-23.6v-57.5c91.6-9.3 163.1-80.5 163.1-166.7z' />
        <path d='m256,323.5c51,0 92.3-41.3 92.3-92.3v-127.9c0-51-41.3-92.3-92.3-92.3s-92.3,41.3-92.3,92.3v127.9c0,51 41.3,92.3 92.3,92.3zm-52.3-220.2c0-28.8 23.5-52.3 52.3-52.3s52.3,23.5 52.3,52.3v127.9c0,28.8-23.5,52.3-52.3,52.3s-52.3-23.5-52.3-52.3v-127.9z' />{' '}
        <path d='M12 14c1.654 0 3-1.346 3-3V5c0-1.654-1.346-3-3-3S9 3.346 9 5v6c0 1.654 1.346 3 3 3zm6-3h-2c0 2.206-1.794 4-4 4s-4-1.794-4-4H6c0 2.886 2.165 5.278 5 5.91V20H8v2h8v-2h-3v-3.09c2.835-.632 5-3.024 5-5.91z' />
      </svg>
    </button>
  );
};

export default MicrophoneButton;
