// components/moving-bluedot.tsx
import React, { useState, useEffect } from 'react';
import Mappedin from '@mappedin/react-sdk';
import BlueDotMarker from './BlueDotMarker';

interface MovingBlueDotProps {
  route: Mappedin.Coordinate[];
  interval: number;
}

const MovingBlueDot: React.FC<MovingBlueDotProps> = ({ route, interval }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentPosition, setCurrentPosition] = useState<Mappedin.Coordinate | null>(null);

  useEffect(() => {
    if (route.length > 0) {
      setCurrentPosition(route[0]);
    }
  }, [route]);

  useEffect(() => {
    if (currentIndex >= route.length - 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = prevIndex + 1;
        if (nextIndex < route.length) {
          setCurrentPosition(route[nextIndex]);
          return nextIndex;
        } else {
          clearInterval(timer);
          return prevIndex;
        }
      });
    }, interval);

    return () => clearInterval(timer);
  }, [route, interval, currentIndex]);

  return currentPosition ? <BlueDotMarker coordinate={currentPosition} /> : null;
};

export default MovingBlueDot;
