import { useMap, Navigation } from "@mappedin/react-sdk";
import Mappedin from "@mappedin/react-sdk";
import { useEffect, useRef, useState } from 'react';

interface CoordinatesProps {
    start: Mappedin.Coordinate;
    end: Mappedin.Coordinate;
    accessibleToggleValue: boolean;
}

export default function NavigateBetweenTwoCoordinates({ start, end, accessibleToggleValue, onRouteCalculated }: CoordinatesProps) {
  const { mapView } = useMap();
  const [directions, setDirections] = useState<Mappedin.Directions | null>(null);
  const onRouteCalculatedRef = useRef(onRouteCalculated);

  useEffect(() => {
    onRouteCalculatedRef.current = onRouteCalculated;
  }, [onRouteCalculated]);

  useEffect(() => {
    if (mapView && start && end) {
      const newDirections = mapView.getDirections(start, end, { accessible: accessibleToggleValue });
      if (newDirections) {
        setDirections(newDirections);
        onRouteCalculatedRef.current(newDirections);
      }
    }
  }, [start, end, accessibleToggleValue, mapView]);

  return directions ? <Navigation directions={directions} /> : null;
}