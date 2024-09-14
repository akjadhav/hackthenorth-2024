import { ClientOnly } from 'remix-utils';
import Map from '~/components/map.client';

export default function MapRoute() {
  return (
    <ClientOnly fallback={<div>Loading map...</div>}>
      {() => <Map />}
    </ClientOnly>
  );
}
