import axios from 'axios';

export async function fetchData(url) {
  try {
    const response = await axios.get(url);
    return response.data; 
  } catch (error) {
    console.error("Could not fetch data:", error);
    return null;
  }
}
