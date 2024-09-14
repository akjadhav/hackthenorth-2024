import { useEffect, useRef } from 'react';
import { getMapData, show3dMap } from '@mappedin/mappedin-js';
import '@mappedin/mappedin-js/lib/index.css';

export default function Map() {
  const mapRef = useRef(null);

  useEffect(() => {
    const options = {
      key: 'YOUR_KEY_HERE',
      secret: 'YOUR_SECRET_HERE',
      mapId: 'YOUR_MAP_ID_HERE',
    };

    async function initMap() {
      const mapData = await getMapData(options);
      if (mapRef.current) {
        await show3dMap(mapRef.current, mapData);
      }
    }

    initMap();
  }, []);

  return (
    <div
      ref={mapRef}
      style={{ width: '100%', height: '100vh' }}
    />
  );
}
