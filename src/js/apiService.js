import axios from 'axios';

const API_KEY = '31604324-7a50cb95f9ef385a3991a2501';
const BASE_URL = 'https://pixabay.com/api/';

export async function getImages(searchTerm, page) {
  return await axios.get(
    `${BASE_URL}?key=${API_KEY}&q=${searchTerm}&image_type=photo&orientation=horizontal&page=${page}&per_page=40&safesearch=true`
  );
}
