import { useQuery } from '@tanstack/react-query';
import { getReviews, getReviewBySlug } from '../services/api';

export const useReviews = () =>
  useQuery({
    queryKey: ['reviews'],
    queryFn: getReviews,
    staleTime: 1000 * 60 * 5,
  });

export const useReviewBySlug = (slug) =>
  useQuery({
    queryKey: ['review', slug],
    queryFn: () => getReviewBySlug(slug),
    enabled: !!slug,
    staleTime: 1000 * 60 * 5,
  });
