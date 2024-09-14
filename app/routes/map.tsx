import { useEffect, useState } from 'react';
import Map from '~/components/map.client';

export default function MapRoute() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return <div>{isClient ? <Map /> : <div>Loading map...</div>}</div>;
}
