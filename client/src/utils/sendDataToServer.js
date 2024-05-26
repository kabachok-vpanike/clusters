import axios from 'axios';

export const sendDataToServer = async (data) => {
  try {
    console.log("sending", data);
    const response = await axios.post('/api/data', data);
    console.log('Data received from server:', response.data);
    return response.data;
  } catch (error) {
    console.error("Could not send data to the server:", error.response);
  }
};