// 'use client';

// import { useEffect, useRef, useState } from 'react';
// import { getMapData, show3dMap } from '@mappedin/mappedin-js';

// export default function Map() {
//   const mapRef = useRef<HTMLDivElement | null>(null);
//   const [selectedMap, setSelectedMap] = useState('defaultMap'); // State for dropdown

//   useEffect(() => {
//     if (typeof window !== 'undefined') {
//       const options = {
//         key: 'mik_Qar1NBX1qFjtljLDI52a60753',
//         secret: 'mis_CXFS9WnkQkzQmy9GCt4ucn2D68zNRgVa2aiJj5hEIFM8aa40fee',
//         mapId: '66ce20fdf42a3e000b1b0545',
//       };

//       const initMap = async () => {
//         try {
//           const mapData = await getMapData(options);
//           if (mapRef.current) {
//             const mapView = await show3dMap(mapRef.current, mapData);

//             console.log(mapData);
//             console.log(mapView.BlueDot);
//           }
//         } catch (error) {
//           console.error('Error loading map:', error);
//         }
//       };

//       initMap();
//     }
//   }, []);

//   const handleMapChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
//     setSelectedMap(event.target.value); // Update state with selected value
//     // You can add any logic here that reacts to the dropdown change without modifying the map options
//   };

//   return (
//     <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
//       {/* Dropdown selector */}
//       <div style={{ position: 'absolute', top: 10, left: 10, zIndex: 1000 }}>
//         <select
//           value={selectedMap}
//           onChange={handleMapChange}>
//           <option value='defaultMap'>Default Map</option>
//           <option value='map1'>Map 1</option>
//           <option value='map2'>Map 2</option>
//           {/* Add more map options here */}
//         </select>
//       </div>

//       {/* Map container */}
//       <div
//         ref={mapRef}
//         style={{ width: '100%', height: '100%' }}
//       />
//     </div>
//   );
// }

'use client';

import { useEffect, useRef, useState } from 'react';
import { getMapData, show3dMap } from '@mappedin/mappedin-js';

export default function Map() {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const [selectedMap, setSelectedMap] = useState('defaultMap'); // State for dropdown
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null); // State for user location

  useEffect(() => {
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
            const mapView = await show3dMap(mapRef.current, mapData);
            mapView.setFloor('m_98cc81edd0cb1c71');

            mapView.BlueDot.enable(); // Enable BlueDot for user's live location

            console.log(mapData);
            console.log(mapView.BlueDot);

            // // Add BlueDot or marker for user's live location
            // if (userLocation && mapView.BlueDot) {
            //   // If BlueDot is available
            //   mapView.BlueDot.updatePosition({
            //     position: {
            //       lat: userLocation.lat,
            //       lng: userLocation.lng,
            //     },
            //   });
            // } else if (userLocation) {
            //   // If BlueDot is not available, add a custom marker
            //   const marker = new mapView.Marker({
            //     position: { lat: userLocation.lat, lng: userLocation.lng },
            //     icon: 'https://path-to-your-icon.png', // Replace with your custom marker icon if needed
            //   });
            //   mapView.addMarker(marker);
            // }
          }
        } catch (error) {
          console.error('Error loading map:', error);
        }
      };

      // // Geolocation: Get user's current position
      // const getUserLocation = () => {
      //   if (navigator.geolocation) {
      //     navigator.geolocation.getCurrentPosition(
      //       (position) => {
      //         setUserLocation({
      //           lat: position.coords.latitude,
      //           lng: position.coords.longitude,
      //         });
      //       },
      //       (error) => {
      //         console.error('Error getting location:', error);
      //       }
      //     );
      //   } else {
      //     console.error('Geolocation is not supported by this browser.');
      //   }
      // };

      // getUserLocation();
      initMap();
    }
  }, []); // Re-run map initialization when userLocation changes

  const handleMapChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMap(event.target.value); // Update state with selected value
    // You can add any logic here that reacts to the dropdown change without modifying the map options
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
      {/* Dropdown selector */}
      <div style={{ position: 'absolute', top: 10, left: 10, zIndex: 1000 }}>
        <select
          value={selectedMap}
          onChange={handleMapChange}>
          <option value='defaultMap'>Default Map</option>
          <option value='map1'>Map 1</option>
          <option value='map2'>Map 2</option>
          {/* Add more map options here */}
        </select>
      </div>

      {/* Map container */}
      <div
        ref={mapRef}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
}
