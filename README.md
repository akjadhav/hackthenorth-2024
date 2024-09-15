# Voice-Centric Indoor Navigation Assistant

## Purpose

This innovative application aims to enhance mobility and independence for visually impaired individuals by providing a voice-first indoor navigation solution. It combines advanced technologies to offer accessible, spoken navigation guidance in indoor spaces.

## Workflow

1. The user interacts with the system through voice commands.
2. Voiceflow manages the conversation flow, using its decision tree structure to understand the user's intent (space or object) and desired destination.
3. Multiple TAPO cameras stream 1080p video of the environment (over Wifi).
4. The CV pipeline (Detectron, DPT, gpt-4o mini) processes the video streams in real-time:
   - Detecting objects 
   - Estimating depth
   - Breaking down images into sub-bounding boxes
   - Generating parallel narrations for each sub-box
   - Combining narrations for a comprehensive scene description
5. This CV data, along with MappedIn SDK floor plan information, is stored in JSON format in the Convex database.
6. Cohere's reranking is used to find the most relevant information from both CV tags and mapping data based on the user's query.
7. MappedIn SDK generates a route from the current location to the desired destination or object.
8. Voiceflow, integrated with Cohere, uses the reranked information and MappedIn route to generate appropriate responses and navigation instructions.
9. These text instructions are converted to speech using Unreal Engine's text-to-speech capabilities.
10. The user receives spoken guidance, which is continuously updated based on their movement and changes in the environment.

This integrated system provides a comprehensive, real-time, and adaptive navigation solution specifically designed for visually impaired users, leveraging cutting-edge AI and computer vision technologies to enhance accessibility in indoor spaces.

## Detailed Technology Breakdown

1. **Computer Vision (CV) Pipeline**
   - Object Detection: Detectron is used to identify and locate objects within the video streams.
   - Depth Estimation: DPT (Dense Prediction Transformer) provides depth information for each pixel in the image.
   - Image Processing and Scene Analysis: 
     * The system breaks down images into various sub-bounding boxes for detailed analysis.
     * GPT-4 Vision (mini) generates narrations for each sub-bounding box in parallel.
     * The narrations for all sub-boxes are then combined to provide a comprehensive description of the scene.
   - Data Integration: All CV data is attached in JSON format and stored in a Convex database using MappedIn SDK.

2. **Semantic Search and Reranking (Cohere)**
   - Cohere's Rerank API endpoint is used for powerful semantic search capabilities.
   - Function: Given a `query` and a list of `documents`, Rerank indexes the documents from most to least semantically relevant to the query.
   - Data Source: Documents are composed of two types of data stored in the Convex database:
     * Tags generated from the computer vision pipeline
     * Floor plan information from the MappedIn SDK
   - Reranking Process: The system performs reranking on each of these objects, connecting both CV and mapping data for comprehensive search results.

3. **Voice Interaction and Workflow Management (Voiceflow)**
   - Decision Tree Structure: Programmatically created with numerous steps, loops, and cases for complex voice interactions.
   - User Intent Differentiation: The decision tree structure distinguishes between user requests for:
     * General "spaces" (e.g., rooms, areas)
     * Specific "objects" (e.g., persons, desks, sponsor booths)
   - Goal: To understand the user's final destination or object of interest through a series of questions and interactions.
   - Integration: Voiceflow integrates with Cohere's reranking to understand relevant tags created from computer vision models and mapping data.
   - Scope: Handles text-to-text responses and creates complex workflows for answering questions. Does not handle speech-to-text or text-to-speech conversion.

4. **Speech Processing**
   - Speech-to-Text: Utilizes a Groq model based on Open AI's Whisper transcription model, chosen for its very low latency, which is crucial for real-time speech processing.
   - Text-to-Speech: Implemented using Unreal Engine, which doesn't specify an AI model but provides very fast processing.

5. **Indoor Mapping and Navigation (MappedIn SDK)**
   - Route Generation: Provides a route from the current location to the final destination.
   - Detailed Navigation: Once a space is selected, the system offers more specific navigation guidance.
   - Depth-Based Guidance: Utilizes depth information from the CV pipeline to provide more accurate positioning.
   - Object-Relative Navigation: Uses the relative positioning between objects and depth data to guide the user more precisely.

## Running

1. `git clone https://github.com/akjadhav/hackthenorth-2024.git && cd hackthenorth-2024`
2. `npm run dev`
