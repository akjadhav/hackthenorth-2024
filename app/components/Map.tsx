// map.component.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { MapView, useMapData, Marker } from '@mappedin/react-sdk';
import Mappedin from '@mappedin/react-sdk';

import FloorSelector from './FloorSelector';
import MovingBlueDot from './MovingBlueDot';
import NavigateBetweenTwoCoordinates from './Navigation';
import '@mappedin/react-sdk/lib/esm/index.css';

import MicrophoneButton from './MicrophoneButton';

export enum MapFloor {
  Floor1 = 'm_e6c96a31fba4ef51',
  Floor2 = 'm_b4e5ebf844208588',
  // Add other floors if necessary
}

export default function Map() {
  const [currentCoordinate] = useState(
    new Mappedin.Coordinate(43.4727, -80.5398, MapFloor.Floor2)
  );
  const [endCoordinate] = useState(
    new Mappedin.Coordinate(43.4728, -80.5400, MapFloor.Floor2)
  );
  const [accessibleToggleValue, setAccessibleToggleValue] = useState(false);
  const [route, setRoute] = useState<Mappedin.Coordinate[]>([]);

  const { isLoading, error, mapData } = useMapData({
    key: "mik_Qar1NBX1qFjtljLDI52a60753",
    secret: "mis_CXFS9WnkQkzQmy9GCt4ucn2D68zNRgVa2aiJj5hEIFM8aa40fee",
    mapId: "66ce20fdf42a3e000b1b0545",
  });

  // interpolation function
  function interpolateCoordinates(
    start: Mappedin.Coordinate,
    end: Mappedin.Coordinate,
    numPoints: number
  ): Mappedin.Coordinate[] {
    const interpolatedCoords: Mappedin.Coordinate[] = [];

    for (let i = 1; i <= numPoints; i++) {
      const t = i / (numPoints + 1);

      const latitude = start.latitude + t * (end.latitude - start.latitude);
      const longitude = start.longitude + t * (end.longitude - start.longitude);
      const floorId = start.floorId; // Assuming both coordinates are on the same floor.

      interpolatedCoords.push(new Mappedin.Coordinate(latitude, longitude, floorId));
    }

    return interpolatedCoords;
  }

  // generate smooth route
  function generateSmoothRoute(
    originalRoute: Mappedin.Coordinate[],
    pointsPerSegment: number
  ): Mappedin.Coordinate[] {
    const smoothRoute: Mappedin.Coordinate[] = [];

    for (let i = 0; i < originalRoute.length - 1; i++) {
      const start = originalRoute[i];
      const end = originalRoute[i + 1];

      smoothRoute.push(start);

      const interpolatedPoints = interpolateCoordinates(start, end, pointsPerSegment);
      smoothRoute.push(...interpolatedPoints);
    }

    smoothRoute.push(originalRoute[originalRoute.length - 1]);

    return smoothRoute;
  }

  const handleRouteCalculated = useCallback(
    (directions: Mappedin.Directions) => {
      if (directions && directions.coordinates) {
        const pointsPerSegment = 5;
        const smoothRoute = generateSmoothRoute(directions.coordinates, pointsPerSegment);
        setRoute(smoothRoute);
      }
    },
    [setRoute]
  );

  const handleToggleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAccessibleToggleValue(event.target.checked);
  };

  if (isLoading) {
    return (
      <div style={styles.loadingContainer}>
        <p style={styles.loadingText}>Loading...</p>
      </div>
    );
  }

  if (error) {
    return <div>Error loading map: {error.message}</div>;
  }

  return mapData ? (
    <MapView
      mapData={mapData}
      style={{ height: '100vh', width: '100vw' }}
      options={{ initialFloor: MapFloor.Floor2 }}
    >
      <div style={styles.titleContainer}>
        <h1 style={styles.title}>PathSense</h1>
      </div>
      <div style={styles.toggleContainer}>
        <label htmlFor='accessibleToggle' style={styles.label}>
          Accessible
        </label>
        <input
          id='accessibleToggle'
          type='checkbox'
          checked={accessibleToggleValue}
          onChange={handleToggleChange}
          style={styles.toggle}
        />
      </div>

      <FloorSelector />
      <MicrophoneButton />
      <NavigateBetweenTwoCoordinates
        start={currentCoordinate}
        end={endCoordinate}
        accessibleToggleValue={accessibleToggleValue}
        onRouteCalculated={handleRouteCalculated}
      />
      {route.length > 0 && <MovingBlueDot route={route} interval={500} />}
      <Marker target={endCoordinate} options={{ rank: 'always-visible' }}>
        <div style={styles.destinationMarker}>🏁</div>
      </Marker>
    </MapView>
  ) : null;
}

const styles = {
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#ffffff',
  },
  loadingText: {
    fontSize: '24px',
    fontWeight: 'bold' as const,
    color: '#007AFF',
    fontFamily: 'Arial, sans-serif',
  },
  toggleContainer: {
    position: 'absolute' as const,
    top: '80px',
    right: '20px',
    zIndex: 10,
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#ffffffcc',
    padding: '8px 12px',
    borderRadius: '8px',
    backdropFilter: 'blur(5px)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  },
  label: {
    marginRight: '10px',
    fontFamily: 'Arial, sans-serif',
    fontSize: '16px',
    color: '#333',
  },
  toggle: {
    width: '20px',
    height: '20px',
    cursor: 'pointer',
  },
  titleContainer: {
    position: 'absolute' as const,
    top: '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 11,
  },
  title: {
    fontSize: '36px',
    fontWeight: 'bold' as const,
    color: '#007AFF',
    margin: '0',
    fontFamily: 'Arial, sans-serif',
  },
  destinationMarker: {
    fontSize: '28px',
  },
};