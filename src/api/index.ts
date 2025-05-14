import httpClient from './httpClient';

export const signup = async (uid: string) => {
  try {
    const response = await httpClient.post('/users/signup', {
      uid,
    });
    return response.data;
  } catch (error) {
    console.error('Error during signup:', error);
    throw error;
  }
};

export const getUser = async (uid: string) => {
  try {
    const response = await httpClient.get(`/users/${uid}`);

    if (response.status === 404) {
      return null;
    }

    return response.data;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
};
