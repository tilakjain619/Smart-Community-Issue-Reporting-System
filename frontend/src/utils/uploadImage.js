import axios from 'axios';
const BASE_API_URL = import.meta.env.VITE_BACKEND_URL;

const uploadImage = async (file, token) => {

  try {
    const formData = new FormData();
    formData.append('file', file);

    const res = await axios.post(`${BASE_API_URL}/api/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: token
      }
    });

    return res.data;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};  


export default uploadImage;