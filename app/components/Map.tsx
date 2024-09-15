// map.component.tsx
'use client';

import { useState, useEffect } from "react";
import { MapView, useMapData, Marker } from "@mappedin/react-sdk";
import Mappedin from "@mappedin/react-sdk";

import FloorSelector from "./FloorSelector";
import MovingBlueDot from "./MovingBlueDot";
import NavigateBetweenTwoCoordinates from "./Navigation";
import "@mappedin/react-sdk/lib/esm/index.css";

import CONSTANTS from '../constants';
import MicrophoneButton from "./MicrophoneButton";
// import SignOutButton from './SignOutButton';

export enum MapFloor {
  Floor1 = "m_e6c96a31fba4ef51",
  Floor2 = "m_b4e5ebf844208588",
  Floor3 = "m_883f57e8a60ad67b",
  Floor4 = "m_a93a33b76d3261c5",
  Floor5 = "m_be5257d1c86c490c",
  Floor6 = "m_98cc81edd0cb1c71",
  Floor7 = "m_d1a647643658e985",
}

export default function Map() {
  const [currentCoordinate, setCurrentCoordinate] = useState(
    new Mappedin.Coordinate(43.4727, -80.5398, MapFloor.Floor2)
  );
  const [endCoordinate] = useState(
    new Mappedin.Coordinate(43.4728, -80.5400, MapFloor.Floor2)
  );
  const [accessibleToggleValue, setAccessibleToggleValue] = useState(false);
  const [route, setRoute] = useState<Mappedin.Coordinate[]>([]);

  const { isLoading, error, mapData } = useMapData({
    key: 'your_api_key',
    secret: 'your_api_secret',
    mapId: 'your_map_id',
  });

  const handleRouteCalculated = (directions: Mappedin.Directions) => {
    if (directions && directions.coordinates) {
      setRoute(directions.coordinates);
    }
  };

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
    return <div>{error.message}</div>;
  }

  return mapData ? (
    <MapView
      mapData={mapData}
      style={{ height: '100vh', width: '100vw' }}
      options={{ initialFloor: MapFloor.Floor2 }}
    >
      {/* <SignOutButton /> */}
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
      {route.length > 0 && (
        <MovingBlueDot route={route} interval={1000} />
      )}
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