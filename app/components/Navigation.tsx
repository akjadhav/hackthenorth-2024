'use client';

import { useMap, Navigation } from '@mappedin/react-sdk';
import Mappedin from '@mappedin/react-sdk';
import Groq from 'groq-sdk';
import { useState, useEffect } from 'react';
import axios from 'axios';

interface CoordinatesProps {
  start: Mappedin.Coordinate;
  end: any;
  accessibleToggleValue: boolean;
}

const groq = new Groq({
  apiKey: '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',
  dangerouslyAllowBrowser: true,
});

export const getGroqChatCompletion = async (
  directionsJson: Mappedin.Directions | undefined
) => {
  return groq.chat.completions.create({
    messages: [
      {
        role: 'system',
        content:
          'You exist to convert a json object of directions that let a person navigate an indoor building. You will be given a json object in a string format, and you will need to convert it to a short, concise paragraph that can be read out loud to a user. These should be verbal instructions like Google Maps has, so do not include any extra words like heres the result or anything. I want these instructions to be as clear as possible.',
      },
      {
        role: 'user',
        content: 'Here is the json object: ' + JSON.stringify(directionsJson),
      },
    ],
    model: 'llama3-70b-8192',
    temperature: 0.5,
    max_tokens: 1024,
    top_p: 1,
    stop: null,
    stream: false,
  });
};

async function TTS(text: string) {
  try {
    const response = await axios.post(
      'https://api.v7.unrealspeech.com/stream',
      {
        Text: text,
        VoiceId: 'Will', // You can change this to Scarlett, Liv, Will, or Amy
        Bitrate: '192k',
        Speed: '-0.3',
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

export default function NavigateBetweenTwoCoordinates({
  start,
  end,
  accessibleToggleValue,
}: CoordinatesProps) {
  const { mapView, mapData } = useMap();

  const [directionsJson, setDirectionsJson] = useState(null);
  const [mappingDirections, setMappingDirections] = useState(null);
  const [textDirections, setTextDirections] = useState('');

  useEffect(() => {
    console.log('textDirections', textDirections);
  }, [textDirections]);

  useEffect(() => {
    if (end) {
      console.log('end', end);
      if (end.type === 'space') {
        const space = mapData.getById(end.type, end.spaceId);
        if (!space) return;
        console.log('space', space);
        const directions = mapView.getDirections(start, space, {
          accessible: accessibleToggleValue,
        });

        const instructions = directions?.instructions;
        console.log('directionsJson', instructions);
        setDirectionsJson(instructions);
        setMappingDirections(directions);
      } else if (end.type === 'object') {
        const space = mapData
          .getByType('space')
          .find((s) => s.name === end.spaceName);
        if (!space) return;
        const directions = mapView.getDirections(start, space, {
          accessible: accessibleToggleValue,
        });

        const instructions = directions?.instructions;
        console.log('directionsJson', instructions);
        setDirectionsJson(instructions);
        setMappingDirections(directions);
      }
    }
  }, [end, start, accessibleToggleValue, mapView, mapData]);

  useEffect(() => {
    if (directionsJson) {
      const fetchGroqCompletion = async () => {
        try {
          const chatCompletion = await getGroqChatCompletion(directionsJson);
          const res = chatCompletion.choices[0]?.message?.content || '';
          console.log('res', res);
          TTS(res);
          setTextDirections(res);
        } catch (error) {
          console.error('Error fetching Groq completion:', error);
        }
      };
      fetchGroqCompletion();
    }
  }, [directionsJson]);

  return mappingDirections ? (
    <Navigation directions={mappingDirections} />
  ) : null;
}
