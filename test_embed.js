const url = "https://www.youtube.com/watch?v=lL9-LF_eugI&list=RDlL9-LF_eugI&start_radio=1";
const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|shorts\/|live\/|.*[?&]v=))([^"&?\/\s]{11})/);
console.log(match);
