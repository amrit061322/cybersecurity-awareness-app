import api from './api';

export const fetchFeed = async ({ page = 1, limit = 8 } = {}) => {
  const response = await api.get('/community/feed', { params: { page, limit } });
  return response.data;
};

export const fetchPost = async (postId) => {
  const response = await api.get(`/community/posts/${postId}`);
  return response.data;
};

export const createPost = async ({ content, scamType, file }) => {
  const formData = new FormData();
  formData.append('content', content);
  formData.append('scamType', scamType);
  if (file) formData.append('image', file);

  const response = await api.post('/community/posts', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};

export const toggleLike = async (postId) => {
  const response = await api.post(`/community/posts/${postId}/like`);
  return response.data;
};

export const addComment = async (postId, content) => {
  const response = await api.post(`/community/posts/${postId}/comments`, { content });
  return response.data;
};

export const fetchComments = async (postId) => {
  const response = await api.get(`/community/posts/${postId}/comments`);
  return response.data;
};

export const deletePost = async (postId) => {
  const response = await api.delete(`/community/posts/${postId}`);
  return response.data;
};

