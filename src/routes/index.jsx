import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';

// Lazy load pages for better performance
import { lazy, Suspense } from 'react';
import LoadingSkeleton from '../components/LoadingSkeleton';

const Home = lazy(() => import('../pages/Home'));
const About = lazy(() => import('../pages/About'));
const MovieNews = lazy(() => import('../pages/MovieNews'));
const SingleArticle = lazy(() => import('../pages/MovieNews/SingleArticle'));
const Archive = lazy(() => import('../pages/MovieNews/Archive'));
const Reviews = lazy(() => import('../pages/Reviews'));
const SingleReview = lazy(() => import('../pages/Reviews/SingleReview'));
const BoxOffice = lazy(() => import('../pages/BoxOffice'));
const SingleBoxOffice = lazy(() => import('../pages/BoxOffice/SingleBoxOffice'));
const SingleNorthAmerica = lazy(() => import('../pages/NorthAmerica/SingleNorthAmerica'));
const SingleSchedule = lazy(() => import('../pages/Schedules/SingleSchedule'));
const Search = lazy(() => import('../pages/Search'));
const Admin = lazy(() => import('../pages/Admin'));
const AdminOverview = lazy(() => import('../pages/Admin/Overview'));
const AdminPopupAd = lazy(() => import('../pages/Admin/PopupAd'));
const AdminNorthAmerica = lazy(() => import('../pages/Admin/NorthAmerica'));
const AdminSchedules = lazy(() => import('../pages/Admin/Schedules'));
const AdminTop5 = lazy(() => import('../pages/Admin/Top5'));
const AdminGalleries = lazy(() => import('../pages/Admin/Galleries'));
const AdminArticles = lazy(() => import('../pages/Admin/Articles'));
const AdminReviews = lazy(() => import('../pages/Admin/Reviews'));
const AdminBoxOffice = lazy(() => import('../pages/Admin/BoxOffice'));
const AdminTaxonomy = lazy(() => import('../pages/Admin/Taxonomy'));
const AdminLandingPage = lazy(() => import('../pages/Admin/LandingPage'));
const AdminMonetization = lazy(() => import('../pages/Admin/Monetization'));
const AdminComments = lazy(() => import('../pages/Admin/Comments'));
const AdminSettings = lazy(() => import('../pages/Admin/Settings'));
const AdminMedia = lazy(() => import('../pages/Admin/Media'));
const Gallery = lazy(() => import('../pages/Gallery'));
const NotFound = lazy(() => import('../pages/NotFound'));
const Advertise = lazy(() => import('../pages/Advertise'));
const Policy = lazy(() => import('../pages/Policy'));
const Contact = lazy(() => import('../pages/Contact'));

// Wrapper to provide suspense fallback
const SuspenseWrapper = ({ children }) => (
  <Suspense fallback={<LoadingSkeleton type="page" />}>
    {children}
  </Suspense>
);

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <SuspenseWrapper><Home /></SuspenseWrapper>,
      },
      {
        path: 'main',
        element: <SuspenseWrapper><Home /></SuspenseWrapper>,
      },
      {
        path: 'about',
        element: <SuspenseWrapper><About /></SuspenseWrapper>,
      },
      {
        path: 'movie-news',
        children: [
          {
            index: true,
            element: <SuspenseWrapper><MovieNews /></SuspenseWrapper>,
          },
          {
            path: 'archive',
            element: <SuspenseWrapper><Archive /></SuspenseWrapper>,
          },
          {
            path: ':slug',
            element: <SuspenseWrapper><SingleArticle /></SuspenseWrapper>,
          },
        ]
      },
      {
        path: 'reviews',
        children: [
          {
            index: true,
            element: <SuspenseWrapper><Reviews /></SuspenseWrapper>,
          },
          {
            path: ':slug',
            element: <SuspenseWrapper><SingleReview /></SuspenseWrapper>,
          },
        ]
      },
      {
        path: 'box-office',
        children: [
          {
            index: true,
            element: <SuspenseWrapper><BoxOffice /></SuspenseWrapper>,
          },
          {
            path: ':slug',
            element: <SuspenseWrapper><SingleBoxOffice /></SuspenseWrapper>,
          },
        ]
      },
      {
        path: 'north-america',
        children: [
          {
            path: ':slug',
            element: <SuspenseWrapper><SingleNorthAmerica /></SuspenseWrapper>,
          },
        ]
      },
      {
        path: 'upcoming',
        children: [
          {
            path: ':slug',
            element: <SuspenseWrapper><SingleSchedule /></SuspenseWrapper>,
          },
        ]
      },
      {
        path: 'search',
        element: <SuspenseWrapper><Search /></SuspenseWrapper>,
      },
      {
        path: 'galleries',
        children: [
          {
            index: true,
            element: <SuspenseWrapper><Gallery /></SuspenseWrapper>,
          },
          {
            path: ':id',
            element: <SuspenseWrapper><Gallery /></SuspenseWrapper>,
          },
        ]
      },
      {
        path: 'admin',
        element: <SuspenseWrapper><Admin /></SuspenseWrapper>,
        children: [
          { index: true, element: <SuspenseWrapper><AdminOverview /></SuspenseWrapper> },
          { path: 'overview', element: <SuspenseWrapper><AdminOverview /></SuspenseWrapper> },
          { path: 'popup', element: <SuspenseWrapper><AdminPopupAd /></SuspenseWrapper> },
          { path: 'north-america', element: <SuspenseWrapper><AdminNorthAmerica /></SuspenseWrapper> },
          { path: 'schedules', element: <SuspenseWrapper><AdminSchedules /></SuspenseWrapper> },
          { path: 'top5', element: <SuspenseWrapper><AdminTop5 /></SuspenseWrapper> },
          { path: 'galleries', element: <SuspenseWrapper><AdminGalleries /></SuspenseWrapper> },
          { path: 'articles', element: <SuspenseWrapper><AdminArticles /></SuspenseWrapper> },
          { path: 'reviews', element: <SuspenseWrapper><AdminReviews /></SuspenseWrapper> },
          { path: 'box-office', element: <SuspenseWrapper><AdminBoxOffice /></SuspenseWrapper> },
          { path: 'taxonomy', element: <SuspenseWrapper><AdminTaxonomy /></SuspenseWrapper> },
          { path: 'landing-page', element: <SuspenseWrapper><AdminLandingPage /></SuspenseWrapper> },
          { path: 'monetization', element: <SuspenseWrapper><AdminMonetization /></SuspenseWrapper> },
          { path: 'comments', element: <SuspenseWrapper><AdminComments /></SuspenseWrapper> },
          { path: 'settings', element: <SuspenseWrapper><AdminSettings /></SuspenseWrapper> },
          { path: 'media', element: <SuspenseWrapper><AdminMedia /></SuspenseWrapper> }
        ]
      },
      {
        path: 'advertise',
        element: <SuspenseWrapper><Advertise /></SuspenseWrapper>,
      },
      {
        path: 'policy',
        element: <SuspenseWrapper><Policy /></SuspenseWrapper>,
      },
      {
        path: 'contact',
        element: <SuspenseWrapper><Contact /></SuspenseWrapper>,
      },
      {
        path: '*',
        element: <SuspenseWrapper><NotFound /></SuspenseWrapper>,
      },
    ],
  },
]);

export default router;


