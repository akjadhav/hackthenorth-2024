import React, { useEffect, useRef, useState } from 'react';
import { getMapData, show3dMap } from '@mappedin/mappedin-js';
import '@mappedin/mappedin-js/lib/index.css';

const Map: React.FC = () => {
  const [mapData, setMapData] = useState<any>(null);
  const [currentFloor, setCurrentFloor] = useState<string>('');
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const floorSelectorRef = useRef<HTMLSelectElement>(null);

  useEffect(() => {
    const initMap = async () => {
      const mapData = await getMapData({
        key: 'mik_yeBk0Vf0nNJtpesfu560e07e5',
        secret: 'mis_2g9ST8ZcSFb5R9fPnsvYhrX3RyRwPtDGbMGweCYKEq385431022',
        mapId: '64ef49e662fd90fe020bee61',
      });

      setMapData(mapData);

      // Display the map
      const mapView = await show3dMap(
        mapContainerRef.current as HTMLDivElement,
        mapData
      );

      // Add each floor to the floor selector
      mapData.getByType('floor').forEach((floor: any) => {
        const option = document.createElement('option');
        option.text = floor.name;
        option.value = floor.id;
        if (floorSelectorRef.current) {
          floorSelectorRef.current.appendChild(option);
        }
      });

      // Handle floor-change events
      mapView.on('floor-change', (event: any) => {
        const id = event?.floor.id;
        if (!id) return;
        setCurrentFloor(id);
        if (floorSelectorRef.current) {
          floorSelectorRef.current.value = id;
        }
        console.log('Floor changed to: ', event?.floor.name);
      });

      // Set the initial floor
      setCurrentFloor(mapView.currentFloor.id);
    };

    initMap();
  }, []);

  const handleFloorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (mapData) {
      const selectedFloor = e.target.value;
      setCurrentFloor(selectedFloor);
      mapData.setFloor(selectedFloor);
    }
  };

  return (
    <div className='mappedin-container'>
      <div
        ref={mapContainerRef}
        id='mappedin-map'
        className='mappedin-map'></div>
      <select
        ref={floorSelectorRef}
        onChange={handleFloorChange}
        value={currentFloor}>
        {/* Options populated dynamically */}
      </select>
    </div>
  );
};

export default Map;
