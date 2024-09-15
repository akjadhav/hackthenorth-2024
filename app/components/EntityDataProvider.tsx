// EntityDataProvider.js

import React, { useEffect } from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';

interface EntityDataProviderProps {
  navigationEndId: string;
  onEntityDataFetched: (data: any) => void;
}

const EntityDataProvider: React.FC<EntityDataProviderProps> = ({
  navigationEndId,
  onEntityDataFetched,
}) => {
  const entityData = useQuery(api.entities.getEntityInfo, { navigationEndId });

  useEffect(() => {
    if (entityData) {
      onEntityDataFetched(entityData);
    }
  }, [entityData, onEntityDataFetched]);

  return null; // This component doesn't render any UI
};

export default EntityDataProvider;
