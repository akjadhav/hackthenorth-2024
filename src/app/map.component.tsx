'use client';

import { useEffect, useRef } from 'react';
import { getMapData, show3dMap } from '@mappedin/mappedin-js';

export default function Map() {
  const mapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Ensure that this code only runs on the client
    if (typeof window !== 'undefined') {
      const options = {
        key: 'mik_Qar1NBX1qFjtljLDI52a60753',
        secret: 'mis_CXFS9WnkQkzQmy9GCt4ucn2D68zNRgVa2aiJj5hEIFM8aa40fee',
        mapId: '66ce20fdf42a3e000b1b0545',
      };

      const initMap = async () => {
        try {
          const mapData = await getMapData(options);
          if (mapRef.current) {
            await show3dMap(mapRef.current, mapData);
          }
        } catch (error) {
          console.error('Error loading map:', error);
        }
      };

      initMap();
    }
  }, []);

  return (
    <div
      ref={mapRef}
      style={{ width: '100%', height: '100vh' }}
    />
  );
}
