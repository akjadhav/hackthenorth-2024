'use client'

import { useState, useEffect } from "react";
import { MapView, useMapData } from "@mappedin/react-sdk";
import Mappedin from "@mappedin/react-sdk";

import FloorSelector from "./floor-selector.component";
import BlueDotMarker from "./blue-dot-marker.component";
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
  const [coordinate, setCoordinate] = useState(
    new Mappedin.Coordinate(0, 0, "")
  );

  useEffect(() => {
    setCoordinate(
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

  // useEffect(() => {
  //   let watchId: number | null = null;

  //   function handlePosition(position: GeolocationPosition) {
  //     const { latitude, longitude } = position.coords;
  //     console.log('Updated location:', latitude, longitude);
  //     // setCoordinate(new Mappedin.Coordinate(latitude, longitude, MapFloor.Floor2));
  //   }

  //   function handleError(error: GeolocationPositionError) {
  //     console.error("Error watching user coordinates:", error);
  //   }

  //   // Start watching the user's position after a user gesture
  //   if (navigator.geolocation) {
  //     watchId = navigator.geolocation.watchPosition(handlePosition, handleError, {
  //       enableHighAccuracy: true,
  //     });
  //   } else {
  //     console.error("Geolocation is not supported by this browser.");
  //   }

  //   // Cleanup the watcher when the component unmounts
  //   return () => {
  //     if (watchId !== null) {
  //       navigator.geolocation.clearWatch(watchId);
  //     }
  //   };
  // }, []);

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
    <MapView mapData={mapData} style={{ height: "100vh", width: "100vw" }} options={{initialFloor: MapFloor.Floor2}}>
      <FloorSelector />
      <BlueDotMarker coordinate={coordinate} />
      <MicrophoneButton />
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
};
