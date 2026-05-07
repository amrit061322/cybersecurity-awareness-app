import api from './api';

export const scanPhishing = async ({ inputType, text, url, file }) => {
  if (inputType === 'image') {
    const formData = new FormData();
    formData.append('inputType', 'image');
    if (file) formData.append('image', file);
    const response = await api.post('/phishing/scan', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  }

  const payload = { inputType };
  if (inputType === 'email') payload.text = text;
  if (inputType === 'url') payload.url = url;

  const response = await api.post('/phishing/scan', payload);
  return response.data;
};

export const fetchDetectionHistory = async ({ page = 1, limit = 8 } = {}) => {
  const response = await api.get('/phishing/history', { params: { page, limit } });
  return response.data;
};

