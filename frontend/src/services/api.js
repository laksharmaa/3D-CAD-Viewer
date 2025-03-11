// src/services/api.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const uploadModel = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  
  try {
    const response = await axios.post(`${API_URL}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Upload failed' };
  }
};

export const getModels = async () => {
  try {
    const response = await axios.get(`${API_URL}/models`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Failed to fetch models' };
  }
};

export const getModelUrl = (filename) => {
  return `${API_URL}/models/${filename}`;
};

export const convertModel = async (filename, targetFormat) => {
  try {
    const response = await axios.get(`${API_URL}/convert/${filename}/${targetFormat}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Conversion failed' };
  }
};

// New function to delete a model
export const deleteModel = async (filename) => {
  try {
    const response = await axios.delete(`${API_URL}/models/${filename}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Failed to delete model' };
  }
};