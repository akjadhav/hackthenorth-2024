import { useMap, Navigation } from "@mappedin/react-sdk";
import Mappedin from "@mappedin/react-sdk";
import { useEffect, useState } from "react";

interface CoordinatesProps {
    start: Mappedin.Coordinate;
    end: Mappedin.Coordinate;
    accessibleToggleValue: boolean;
    onRouteCalculated: (directions: Mappedin.Directions) => void;
}

export default function NavigateBetweenTwoCoordinates({ start, end, accessibleToggleValue, onRouteCalculated }: CoordinatesProps) {
    const { mapView } = useMap();
    const [directions, setDirections] = useState<Mappedin.Directions | null>(null);

    useEffect(() => {
        if (mapView && start && end) {
            const newDirections = mapView.getDirections(start, end, {accessible: accessibleToggleValue});
            if (newDirections) {
                setDirections(newDirections);
                onRouteCalculated(newDirections);
            }
        }
    }, [start, end, accessibleToggleValue, mapView, onRouteCalculated]);

    return directions ? <Navigation directions={directions} /> : null;
}