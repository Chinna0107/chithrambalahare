const url = "https://www.youtube.com/watch?v=lL9-LF_eugI&list=RDlL9-LF_eugI&start_radio=1";
const getYouTubeEmbedUrl = (url) => {
  if (!url) return '';
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|shorts\/|live\/|.*[?&]v=))([^"&?\/\s]{11})/);
  const videoId = match ? match[1] : null;
  if (!videoId) return url;
  const origin = 'http://localhost:5173';
  return `https://www.youtube.com/embed/${videoId}?origin=${encodeURIComponent(origin)}&enablejsapi=1&rel=0`;
};
console.log(getYouTubeEmbedUrl(url));
