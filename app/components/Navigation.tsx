import { useMap, Navigation } from '@mappedin/react-sdk';
import Mappedin from '@mappedin/react-sdk';

interface CoordinatesProps {
  start: Mappedin.Coordinate;
  end: any;
  accessibleToggleValue: boolean;
}

export default function NavigateBetweenTwoCoordinates({
  start,
  end,
  accessibleToggleValue,
}: CoordinatesProps) {
  const { mapView, mapData } = useMap();
  if (end) {
    if (end.type == 'space') {
      const space = mapData.getByType(end.spaceId)[0];
      const directions = mapView.getDirections(start, space, {
        accessible: accessibleToggleValue,
      });

      console.log(directions);

      // do groq on directions to get the path
      // text to speech on directions

      return directions ? <Navigation directions={directions} /> : null;
    } else if (end.type == 'object') {
      const spread = end.objectLocation[0];
      const depth = end.objectLocation[1];

      const object = Mappedin.Coordinate(end.objectLocation[0]);
      const directions = mapView.getDirections(start, object, {
        accessible: accessibleToggleValue,
      });

      console.log(directions);

      return directions ? <Navigation directions={directions} /> : null;
    }
  }

  return null;
}
