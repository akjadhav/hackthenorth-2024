'use client'

import { useState, useEffect } from "react";
import { MapView, useMapData } from "@mappedin/react-sdk";
import Mappedin from "@mappedin/react-sdk";

import FloorSelector from "./floor-selector.component";
import BlueDotMarker from "./blue-dot-marker.component";
import NavigateBetweenTwoCoordinates from "./navigation.component";
import "@mappedin/react-sdk/lib/esm/index.css";

import CONSTANTS from '../constants';
import MicrophoneButton from "./microphone-button";

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
    new Mappedin.Coordinate(0, 0, "")
  );
  const [endCoordinate, setEndCoordinate] = useState(
    new Mappedin.Coordinate(43.47278797233474, -80.53979144132539, MapFloor.Floor2)
  );
  const [accessibleToggleValue, setAccessibleToggleValue] = useState(false);
  const [unit, setUnit] = useState<'meters' | 'feet'>('meters');

  useEffect(() => {
    setCurrentCoordinate(
      new Mappedin.Coordinate(
        parseFloat(CONSTANTS.USER_LAT), 
        parseFloat(CONSTANTS.USER_LONG), 
        MapFloor.Floor2
      )
    );
  }, [CONSTANTS])

  const { isLoading, error, mapData } = useMapData({
    key: "mik_Qar1NBX1qFjtljLDI52a60753",
    secret: "mis_CXFS9WnkQkzQmy9GCt4ucn2D68zNRgVa2aiJj5hEIFM8aa40fee",
    mapId: "66ce20fdf42a3e000b1b0545",
  });

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

  // Handle the toggle change
  const handleToggleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAccessibleToggleValue(event.target.checked);
  };

  const handleUnitToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUnit(event.target.checked ? 'feet' : 'meters');
  };

  return mapData ? (
    <MapView mapData={mapData} style={{ height: "100vh", width: "100vw" }} options={{initialFloor: MapFloor.Floor2}}>
      <div style={styles.titleContainer}>
        <h1 style={styles.title}>PathSense</h1>
      </div>
      <div style={styles.toggleContainer}>
        <label htmlFor="accessibleToggle" style={styles.label}>
          Accessible
        </label>
        <input
          id="accessibleToggle"
          type="checkbox"
          checked={accessibleToggleValue}
          onChange={handleToggleChange}
          style={styles.toggle}
        />
      </div>
      {/* <div style={styles.unitToggleContainer}>
        <button>
          {unit === 'feet' ? "feet" : "meter"}
        </button>
      </div> */}

      <FloorSelector />
      <BlueDotMarker coordinate={currentCoordinate} />
      <MicrophoneButton />
      <NavigateBetweenTwoCoordinates
        start={currentCoordinate}
        end={endCoordinate}
        accessibleToggleValue={accessibleToggleValue}
      />
    </MapView>
  ) : null;
}

const styles = {
  loadingContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#f0f0f0",
  },
  loadingText: {
    fontSize: "24px",
    fontWeight: "bold" as const,
    color: "#333",
    fontFamily: "Arial, sans-serif",
  },
  toggleContainer: {
    position: 'absolute' as const,
    top: '70px',
    right: '10px',
    zIndex: 10,
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: '10px',
    borderRadius: '5px',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
  },
  label: {
    marginRight: '10px',
    fontFamily: 'Arial, sans-serif',
    fontSize: '14px',
    color: '#333',
  },
  toggle: {
    cursor: 'pointer',
  },
  titleContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute' as const,
    top: '10px',
    left: '50%',
    transform: 'translateX(-50%)', // Centering the title
    zIndex: 11, // Ensure it's above other elements
  },
  title: {
    fontSize: '30px',
    fontWeight: 'bold' as const,
    color: '#333',
    margin: '0',
    fontFamily: 'Arial, sans-serif',
    '@media (max-width: 600px)': {
      fontSize: '24px',
    },
  },
  unitToggleContainer: {
    position: 'absolute' as const,
    top: '120px',
    right: '10px',
    zIndex: 10,
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: '10px',
    borderRadius: '5px',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
  },
};
