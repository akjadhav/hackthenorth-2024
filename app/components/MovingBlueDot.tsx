import React, { useState, useEffect, useRef } from 'react';
import Mappedin from '@mappedin/react-sdk';
import BlueDotMarker from './BlueDotMarker';

interface MovingBlueDotProps {
  route: Mappedin.Coordinate[];
  interval: number;
}

const MovingBlueDot: React.FC<MovingBlueDotProps> = ({ route, interval }) => {
  const [currentPosition, setCurrentPosition] = useState<Mappedin.Coordinate | null>(null);
  const currentIndexRef = useRef(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (route.length === 0) return;

    setCurrentPosition(route[0]);
    currentIndexRef.current = 0;

    const moveToNextPosition = () => {
      currentIndexRef.current += 1;
      if (currentIndexRef.current < route.length) {
        console.log('Moving to index:', currentIndexRef.current);
        const coord = route[currentIndexRef.current];
        const newCoord = new Mappedin.Coordinate(coord.latitude, coord.longitude, coord.floorId);
        setCurrentPosition(newCoord);
        timerRef.current = setTimeout(moveToNextPosition, interval);
      } else {
        // Reached the end of the route
        console.log('Reached the end of the route.');
        if (timerRef.current) {
          clearTimeout(timerRef.current);
        }
      }
    };

    timerRef.current = setTimeout(moveToNextPosition, interval);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [route, interval]);

  return currentPosition ? <BlueDotMarker coordinate={currentPosition} /> : null;
};

export default MovingBlueDot;
