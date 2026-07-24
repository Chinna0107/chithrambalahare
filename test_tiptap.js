const url = "https://www.youtube.com/watch?v=lL9-LF_eugI&list=RDlL9-LF_eugI&start_radio=1";
const regex = /^(https?:\/\/)?(www\.|music\.)?(youtube\.com|youtu\.be)(?!.*\/channel\/)(?!\/c\/)(?!\/user\/)(?!\/@[a-zA-Z0-9_.-]+)(.*\/)?(watch\?v=|embed\/|v\/|shorts\/|live\/|.+\?v=)?([^#\&\?]*).*/;
const match = url.match(regex);
console.log(match);
