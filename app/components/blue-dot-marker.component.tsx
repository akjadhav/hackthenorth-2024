
import { Marker, useEvent } from "@mappedin/react-sdk";
import Mappedin from "@mappedin/react-sdk";

interface BlueDotMarkerProps {
  coordinate: Mappedin.Coordinate;
}

export default function BlueDotMarker({ coordinate }: BlueDotMarkerProps) {
    useEvent("click", (event) => {
      console.log("click event", event);
    });

    return coordinate ? (
      <Marker target={coordinate} options={{
        rank: 'always-visible',
        dynamicResize: true,
        interactive: false,
      }}>
        <div
          style={{
            backgroundColor: "#007AFF", // Apple's signature blue
            width: "16px",
            height: "16px",
            borderRadius: "50%",
            boxShadow: "0 0 10px rgba(0, 122, 255, 0.5)", // Subtle glow effect
            margin: "8px", // Adjust spacing if necessary
          }}
        />
      </Marker>
    ) : null;
  }