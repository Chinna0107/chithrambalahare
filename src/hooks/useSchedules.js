import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { getUpcomingSchedules } from '../services/api';

const getScheduleBySlug = async (slug) => {
  const response = await axios.get(`/api/schedules/${slug}`);
  return response.data;
};

export const useSchedules = () =>
  useQuery({
    queryKey: ['schedules'],
    queryFn: getUpcomingSchedules,
    staleTime: 1000 * 60 * 5,
  });

export const useScheduleBySlug = (slug) =>
  useQuery({
    queryKey: ['schedule', slug],
    queryFn: () => getScheduleBySlug(slug),
    enabled: !!slug,
    staleTime: 1000 * 60 * 5,
  });
