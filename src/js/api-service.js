const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '33022433-0efd7ccbf8abb7290c8dd54c5';

export default async function fetchImages(query, page, perPage) {
  try {
    const response = await fetch(
      `${BASE_URL}/?key=${API_KEY}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`,
    );
    const images = await response.json();

    return images;
  } catch (error) {
    console.log('Ошибка');
  }
}
