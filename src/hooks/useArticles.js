import { useQuery } from '@tanstack/react-query';
import { getArticles, getArticleBySlug } from '../services/api';

export const useArticles = (params = {}) =>
  useQuery({
    queryKey: ['articles', params],
    queryFn: () => getArticles(params),
    staleTime: 1000 * 60 * 5,
  });

export const useArticleBySlug = (slug) =>
  useQuery({
    queryKey: ['article', slug],
    queryFn: () => getArticleBySlug(slug),
    enabled: !!slug,
    staleTime: 1000 * 60 * 5,
  });
