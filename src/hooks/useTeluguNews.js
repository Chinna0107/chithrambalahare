import { useQuery } from '@tanstack/react-query';
import { getTeluguNews, getTeluguNewsBySlug } from '../services/api';

export const useTeluguNews = () =>
  useQuery({
    queryKey: ['telugu-news'],
    queryFn: getTeluguNews,
    staleTime: 1000 * 60 * 5,
  });

export const useTeluguNewsBySlug = (slug) =>
  useQuery({
    queryKey: ['telugu-news', slug],
    queryFn: () => getTeluguNewsBySlug(slug),
    enabled: !!slug,
    staleTime: 1000 * 60 * 5,
  });
