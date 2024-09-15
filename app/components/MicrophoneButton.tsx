'use client';

import { useState } from 'react';
import axios from 'axios';

const RecordingIcon = () => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    xmlnsXlink='http://www.w3.org/1999/xlink'
    version='1.1'
    width='30'
    height='30'
    viewBox='0 0 256 256'
    xmlSpace='preserve'>
    <g
      style={{
        stroke: 'none',
        strokeWidth: 0,
        strokeDasharray: 'none',
        strokeLinecap: 'butt',
        strokeLinejoin: 'miter',
        strokeMiterlimit: 10,
        fill: 'none',
        fillRule: 'nonzero',
        opacity: 1,
      }}
      transform='translate(1.407 1.407) scale(2.81 2.81)'>
      <path
        d='M 45 0 c -8.481 0 -15.382 6.9 -15.382 15.382 v 29.044 c 0 8.482 6.9 15.382 15.382 15.382 s 15.382 -6.9 15.382 -15.382 V 15.382 C 60.382 6.9 53.481 0 45 0 z'
        style={{
          stroke: 'none',
          strokeWidth: 1,
          strokeDasharray: 'none',
          strokeLinecap: 'butt',
          strokeLinejoin: 'miter',
          strokeMiterlimit: 10,
          fill: 'rgb(211,55,55)',
          fillRule: 'nonzero',
          opacity: 1,
        }}
        transform='matrix(1 0 0 1 0 0)'
        strokeLinecap='round'
      />
      <path
        d='M 69.245 38.312 c -1.104 0 -2 0.896 -2 2 v 6.505 c 0 12.266 -9.979 22.244 -22.245 22.244 s -22.245 -9.979 -22.245 -22.244 v -6.505 c 0 -1.104 -0.896 -2 -2 -2 s -2 0.896 -2 2 v 6.505 c 0 13.797 10.705 25.134 24.245 26.16 V 86 h -9.126 c -1.104 0 -2 0.896 -2 2 s 0.896 2 2 2 h 22.252 c 1.104 0 2 -0.896 2 -2 s -0.896 -2 -2 -2 H 47 V 72.978 c 13.54 -1.026 24.245 -12.363 24.245 -26.16 v -6.505 C 71.245 39.208 70.35 38.312 69.245 38.312 z'
        style={{
          stroke: 'none',
          strokeWidth: 1,
          strokeDasharray: 'none',
          strokeLinecap: 'butt',
          strokeLinejoin: 'miter',
          strokeMiterlimit: 10,
          fill: 'rgb(211,55,55)',
          fillRule: 'nonzero',
          opacity: 1,
        }}
        transform='matrix(1 0 0 1 0 0)'
        strokeLinecap='round'
      />
    </g>
  </svg>
);

const MicrophoneIcon = () => (
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
);

const MicrophoneButton = ({ setNavigationEndId }) => {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [queryCounter, setQueryCounter] = useState(0);
  const [userQueries, setUserQueries] = useState({});

  const [activeObjectId, setActiveObjectId] = useState<string>('');
  const [endState, setEndState] = useState<string>('False');

  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder>();

  async function startRecording() {
    try {
      if (endState === 'False') {
        setIsRecording(true);
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        const mediaRecorderLocal = new MediaRecorder(stream);
        const audioChunks: BlobPart[] = [];

        mediaRecorderLocal.ondataavailable = (event) => {
          audioChunks.push(event.data);
          console.log('Audio chunks:', audioChunks);
        };

        await setMediaRecorder(mediaRecorderLocal);

        mediaRecorderLocal.onstop = () => sendAudioToGroq(audioChunks);

        mediaRecorderLocal.start();
      }
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  }

  function stopRecording() {
    setIsRecording(false);
    // TODO - stop the media recorder
    mediaRecorder.stop();
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
          Speed: '0.2',
          Pitch: '1.27',
          Codec: 'libmp3lame',
        },
        {
          headers: {
            Authorization: `Bearer eTqIM2sw8B50N5k9RhXHLQ5wckReM04tstSbT5UwWfKKPeBabcoLVp`,
            'Content-Type': 'application/json',
          },
          responseType: 'arraybuffer',
        }
      );

      const audioContext = new window.AudioContext();
      const audioBuffer = await audioContext.decodeAudioData(response.data);
      const source = audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContext.destination);
      source.start(0);
    } catch (error) {
      console.error('Error using Unreal Speech API:', error);
    }
  }

  async function sendAudioToGroq(audioChunks: BlobPart[]) {
    const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
    const formData = new FormData();
    formData.append('file', audioBlob, 'audio.webm');
    formData.append('model', 'whisper-large-v3');

    console.log(audioBlob);

    try {
      const response = await axios.post(
        'https://api.groq.com/openai/v1/audio/transcriptions',
        formData,
        {
          headers: {
            Authorization: `Bearer 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`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      console.log('Transcription:', response.data.text);
      sendToVoiceflow(response.data.text);
    } catch (error) {
      console.error('Error transcribing audio:', error);
    }
  }

  async function sendToVoiceflow(text: string) {
    try {
      const queryId = queryCounter + 1;
      setQueryCounter(queryId);
      const userQueryLocal = {
        ...userQueries,
        ['Query ' + queryId]: text.trim(),
      };
      setUserQueries(userQueryLocal);

      console.log('User queries:', userQueryLocal);

      const response = await axios.post(
        `https://general-runtime.voiceflow.com/state/user/test/interact`,
        {
          action: {
            type: 'text',
            payload: JSON.stringify(userQueryLocal),
          },
        },
        {
          headers: {
            Authorization: 'VF.DM.66e5cd017e55f06b654edcfd.FacoFUvzYb9P3tXV',
            versionID: '66e5f214ee127a08497d5383',
          },
        }
      );

      const logs_response = await axios.post(
        `https://general-runtime.voiceflow.com/state/user/test/interact?verbose=true&logs=verbose`,
        {
          action: {
            type: 'text',
            payload: JSON.stringify(userQueryLocal),
          },
        },
        {
          headers: {
            Authorization: 'VF.DM.66e5cd017e55f06b654edcfd.FacoFUvzYb9P3tXV',
            versionID: '66e5f214ee127a08497d5383',
          },
        }
      );

      const object_id = logs_response.data.state.variables.object_id;
      const end_state = logs_response.data.state.variables.endState;
      console.log('Object ID:', object_id);
      console.log('End state:', end_state);

      setActiveObjectId(object_id);
      setEndState(end_state);

      if (end_state === 'True') {
        setNavigationEndId(object_id);
      }

      console.log('Voiceflow RAW response:', response);
      // Display the Voiceflow response
      const voiceflowResponse = response.data.find(
        (item: any) => item.type === 'text'
      );
      if (voiceflowResponse) {
        const message = voiceflowResponse.payload.message;
        console.log('Voiceflow response:', message);
        TTS(message);
      }
    } catch (error) {
      console.error('Error sending to Voiceflow:', error);
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
        boxShadow:
          '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)',
        color: 'white',
        border: 'none',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
      }}
      onClick={handleMicClick}>
      {isRecording ? <RecordingIcon /> : <MicrophoneIcon />}
    </button>
  );
};

export default MicrophoneButton;
