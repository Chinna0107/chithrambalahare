import { useQuery } from '@tanstack/react-query';
import { getBoxOffice, getBoxOfficeBySlug } from '../services/api';

export const useBoxOffice = () =>
  useQuery({
    queryKey: ['box-office'],
    queryFn: getBoxOffice,
    staleTime: 1000 * 60 * 5,
  });

export const useBoxOfficeBySlug = (slug) =>
  useQuery({
    queryKey: ['box-office', slug],
    queryFn: () => getBoxOfficeBySlug(slug),
    enabled: !!slug,
    staleTime: 1000 * 60 * 5,
  });
