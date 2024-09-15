import React, { useState, useEffect, useRef } from 'react';
import { useMap } from '@mappedin/react-sdk';
import Mappedin from '@mappedin/react-sdk';
import BlueDotMarker from './BlueDotMarker';

interface MovingBlueDotProps {
  route: Mappedin.Coordinate[];
  speed: number; // Speed in km/h
}

const MovingBlueDot: React.FC<MovingBlueDotProps> = ({ route, speed }) => {
  console.log('Received route:', route);
  console.log('Received speed:', speed);
  const [currentPosition, setCurrentPosition] = useState<Mappedin.Coordinate | null>(null);
  const currentIndexRef = useRef(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // const { mapView } = useMap();

  // useEffect(() => {
  //   if (mapView && currentPosition) {
  //     mapView.setCenter(currentPosition);
  //     const currentFloorId = mapView.currentFloor?.id;
  //     if (currentFloorId !== currentPosition.floorId) {
  //       const floor = mapView.mapData.floors.find(
  //         (f) => f.id === currentPosition.floorId
  //       );
  //       if (floor) {
  //         mapView.setFloor(floor);
  //       }
  //     }
  //   }
  // }, [currentPosition, mapView]);

  useEffect(() => {
    if (route.length === 0) return;

    setCurrentPosition(route[0]);
    currentIndexRef.current = 0;

    // Compute distances between each coordinate
    const distances = [];
    for (let i = 0; i < route.length - 1; i++) {
      const distance = calculateDistance(route[i], route[i + 1]);
      distances.push(distance);
    }

    // Convert speed to km/ms (since distances are in km)
    const speedInKmPerMs = speed / 3600000;
    const intervals = distances.map((distance) => distance / speedInKmPerMs);

    const moveToNextPosition = () => {
      currentIndexRef.current += 1;
      if (currentIndexRef.current < route.length) {
        const coord = route[currentIndexRef.current];
        console.log('Moving to coordinate:', coord);
        setCurrentPosition(coord);
        if (currentIndexRef.current < intervals.length) {
          timerRef.current = setTimeout(moveToNextPosition, intervals[currentIndexRef.current]);
        }
      } else {
        // Reached the end of the route
        if (timerRef.current) {
          clearTimeout(timerRef.current);
        }
      }
    };

    if (intervals.length > 0) {
      timerRef.current = setTimeout(moveToNextPosition, intervals[0]);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [route, speed]);

  return currentPosition ? <BlueDotMarker coordinate={currentPosition} /> : null;
};

function calculateDistance(coord1: Mappedin.Coordinate, coord2: Mappedin.Coordinate): number {
  // Haversine formula to calculate distance between two coordinates
  const R = 6371; // Earth radius in km
  const lat1 = (coord1.latitude * Math.PI) / 180;
  const lat2 = (coord2.latitude * Math.PI) / 180;
  const dLat = lat2 - lat1;
  const dLon = ((coord2.longitude - coord1.longitude) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
}

export default MovingBlueDot;
