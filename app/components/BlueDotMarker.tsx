import { Marker } from '@mappedin/react-sdk';
import Mappedin from '@mappedin/react-sdk';
import { useEffect } from 'react';

interface BlueDotMarkerProps {
  coordinate: Mappedin.Coordinate;
}

export default function BlueDotMarker({ coordinate }: BlueDotMarkerProps) {
  const key = `${coordinate.floorId}-${coordinate.latitude}-${coordinate.longitude}`;

  // Inject keyframes into the document's stylesheet
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.textContent = `
      @keyframes pulse {
        0% {
          transform: scale(0.95);
          box-shadow: 0 0 0 0 rgba(0, 122, 255, 0.7);
        }
        70% {
          transform: scale(1);
          box-shadow: 0 0 0 20px rgba(0, 122, 255, 0);
        }
        100% {
          transform: scale(0.95);
          box-shadow: 0 0 0 0 rgba(0, 122, 255, 0);
        }
      }
    `;
    document.head.appendChild(styleElement);
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  const styles = {
    blueDot: {
      position: 'relative' as const,
      width: '24px',
      height: '24px',
      backgroundColor: '#007AFF',
      borderRadius: '50%',
      animation: 'pulse 2s infinite',
      display: 'flex',
      justifyContent: 'center' as const,
      alignItems: 'center' as const,
      zIndex: 1000, // Ensure the blue dot is on top
    },
    innerDot: {
      width: '12px',
      height: '12px',
      backgroundColor: '#fff',
      borderRadius: '50%',
    },
  };

  return (
    <Marker
      key={key}
      target={coordinate}
      options={{
        rank: 'always-visible',
        dynamicResize: true,
        interactive: false,
      }}
    >
      <div style={styles.blueDot}>
        <div style={styles.innerDot}></div>
      </div>
    </Marker>
  );
}
