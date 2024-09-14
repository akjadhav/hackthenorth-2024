
import { useMap, Navigation } from "@mappedin/react-sdk";
import Mappedin from "@mappedin/react-sdk";

interface CoordinatesProps {
    start: Mappedin.Coordinate;
    end: Mappedin.Coordinate;
    accessibleToggleValue: boolean;
}

export default function NavigateBetweenTwoCoordinates({ start, end, accessibleToggleValue }: CoordinatesProps) {
    const { mapView } = useMap();

    // const space1 = mapData.getByType("space")[0];
    // const space2 = mapData.getByType("space")[1];

    const directions = mapView.getDirections(start, end, {accessible: accessibleToggleValue});

    console.log(directions)

    return directions ? <Navigation directions={directions} /> : null;
}