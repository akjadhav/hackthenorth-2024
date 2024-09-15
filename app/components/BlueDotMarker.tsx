// components/blue-dot-marker.component.tsx
import { Marker } from '@mappedin/react-sdk';
import Mappedin from '@mappedin/react-sdk';

interface BlueDotMarkerProps {
  coordinate: Mappedin.Coordinate;
}

export default function BlueDotMarker({ coordinate }: BlueDotMarkerProps) {
  return coordinate ? (
    <Marker
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
      <style jsx>{`
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
      `}</style>
    </Marker>
  ) : null;
}

const styles = {
  blueDot: {
    position: 'relative' as const,
    width: '24px',
    height: '24px',
    backgroundColor: '#007AFF',
    borderRadius: '50%',
    animation: 'pulse 2s infinite',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerDot: {
    width: '12px',
    height: '12px',
    backgroundColor: '#fff',
    borderRadius: '50%',
  },
};
