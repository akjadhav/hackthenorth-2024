'use client'

import { useState, useEffect } from "react";
import { MapView, useMapData, useMap } from "@mappedin/react-sdk";
import "@mappedin/react-sdk/lib/esm/index.css";

enum MapFloor {
  Floor1 = "m_e6c96a31fba4ef51",
  Floor2 = "m_b4e5ebf844208588",
  Floor3 = "m_883f57e8a60ad67b",
  Floor4 = "m_a93a33b76d3261c5",
  Floor5 = "m_be5257d1c86c490c",
  Floor6 = "m_98cc81edd0cb1c71",
  Floor7 = "m_d1a647643658e985",
}

function getUserCoordinates(setCoordinates: (coords: { lat: number, long: number }) => void) {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setCoordinates({ lat: latitude, long: longitude });
      }, (error) => {
        console.error("Error getting location:", error);
      });
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
}  

function FloorSelector() {
  const { mapView } = useMap();
  const [selectedMap, setSelectedMap] = useState(MapFloor.Floor1);

  mapView.auto();

  const handleMapChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedFloor = event.target.value as MapFloor;
    setSelectedMap(selectedFloor);
    mapView.setFloor(selectedFloor);
  };

  return (
    <>
      <div style={{ position: "absolute", top: 10, left: 10, zIndex: 1000 }}>
        <select value={selectedMap} onChange={handleMapChange}>
          <option value={MapFloor.Floor1}>Floor 1</option>
          <option value={MapFloor.Floor2}>Floor 2</option>
          <option value={MapFloor.Floor3}>Floor 3</option>
          <option value={MapFloor.Floor4}>Floor 4</option>
          <option value={MapFloor.Floor5}>Floor 5</option>
          <option value={MapFloor.Floor6}>Floor 6</option>
          <option value={MapFloor.Floor7}>Floor 7</option>
        </select>
      </div>
    </>
  );
}

export default function Map() {
    const [coordinates, setCoordinates] = useState<{ lat: number, long: number } | null>(null);

  const { isLoading, error, mapData } = useMapData({
    key: "mik_Qar1NBX1qFjtljLDI52a60753",
    secret: "mis_CXFS9WnkQkzQmy9GCt4ucn2D68zNRgVa2aiJj5hEIFM8aa40fee",
    mapId: "66ce20fdf42a3e000b1b0545",
  });

  useEffect(() => {
    getUserCoordinates(setCoordinates);
  }, []);


  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error.message}</div>;
  }

  return mapData ? (
    <MapView mapData={mapData} style={{height: '100vh', width: '100vw'}}>
      <FloorSelector />
      {coordinates && (
        <div style={{ position: 'absolute', top: 50, left: 10, zIndex: 1000 }}>
          Your Coordinates: Latitude: {coordinates.lat}, Longitude: {coordinates.long}
        </div>
      )}
    </MapView>
  ) : null;
}
