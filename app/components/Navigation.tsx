'use client';

import { useMap, Navigation } from '@mappedin/react-sdk';
import Mappedin from '@mappedin/react-sdk';
import axios from 'axios';
import Groq from 'groq-sdk';
interface CoordinatesProps {
  start: Mappedin.Coordinate;
  end: any;
  accessibleToggleValue: boolean;
}

export const getGroqChatCompletion = async (
  directionsJson: Mappedin.Directions | undefined
) => {
  return groq.chat.completions.create({
    messages: [
      // Set an optional system message. This sets the behavior of the
      // assistant and can be used to provide specific instructions for
      // how it should behave throughout the conversation.
      {
        role: 'system',
        content:
          'You exist to convert a json object of directions that let a person navigate an indoor building. You will be given a json object in a string format, and you will need to covert it to a short, concise paragraph that can be read out loud to a user.',
      },
      // Set a user message for the assistant to respond to.
      {
        role: 'user',
        content: 'Here is the json object: ' + JSON.stringify(directionsJson),
      },
    ],

    // The language model which will generate the completion.
    model: 'llama3-70b-8192',

    //
    // Optional parameters
    //

    // Controls randomness: lowering results in less random completions.
    // As the temperature approaches zero, the model will become deterministic
    // and repetitive.
    temperature: 0.5,

    // The maximum number of tokens to generate. Requests can use up to
    // 2048 tokens shared between prompt and completion.
    max_tokens: 1024,

    // Controls diversity via nucleus sampling: 0.5 means half of all
    // likelihood-weighted options are considered.
    top_p: 1,

    // A stop sequence is a predefined or user-specified text string that
    // signals an AI to stop generating content, ensuring its responses
    // remain focused and concise. Examples include punctuation marks and
    // markers like "[end]".
    stop: null,

    // If set, partial message deltas will be sent.
    stream: false,
  });
};

const groq = new Groq({
  apiKey: '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',
  dangerouslyAllowBrowser: true,
});

export default function NavigateBetweenTwoCoordinates({
  start,
  end,
  accessibleToggleValue,
}: CoordinatesProps) {
  const { mapView, mapData } = useMap();

  let directionsJson: any = null;

  async function groqCompletion(
    directionsJson: Mappedin.Directions | undefined
  ) {
    const chatCompletion = await getGroqChatCompletion(directionsJson);
    return chatCompletion.choices[0]?.message?.content || '';
  }

  if (end) {
    console.log('end', end);
    if (end.type == 'space') {
      const space = mapData.getById(end.type, end.spaceId);
      if (!space) return null;
      console.log('space', space);
      const directions = mapView.getDirections(start, space, {
        accessible: accessibleToggleValue,
      });

      // do groq on directions to get the path
      // text to speech on directions

      directionsJson = directions?.instructions;
      console.log('directionsJson', directionsJson);
      const textual_directions = groqCompletion(directionsJson);

      console.log('textual_directions', textual_directions);
    } else if (end.type == 'object') {
      const spread = end.objectLocation[0];
      const depth = end.objectLocation[1];

      const object = Mappedin.Coordinate(end.objectLocation[0]);
      const directions = mapView.getDirections(start, object, {
        accessible: accessibleToggleValue,
      });

      directionsJson = directions;
    }
  }

  console.log(directionsJson);

  return directionsJson ? <Navigation directions={directionsJson} /> : null;
}
