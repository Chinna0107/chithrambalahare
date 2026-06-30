import { useQuery } from '@tanstack/react-query';
import { getGalleries, getGalleryById } from '../services/api';

export const useGalleries = () =>
  useQuery({
    queryKey: ['galleries'],
    queryFn: getGalleries,
    staleTime: 1000 * 60 * 5,
  });

export const useGallery = (id) =>
  useQuery({
    queryKey: ['gallery', id],
    queryFn: () => getGalleryById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
