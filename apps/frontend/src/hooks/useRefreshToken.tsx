import { useAuth } from '@/hooks/useAuth';
// @ts-ignore
import axios from '@/api/axios';

interface RefreshResponse {
  user: any;
  accessToken: string;
}

const useRefreshToken = () => {
  const { setAuth } = useAuth();

  const refresh = async (): Promise<string | undefined> => {
    try {
      const response = await axios.get<RefreshResponse>('refresh', {
        withCredentials: true,
      });
      setAuth({
        user: response.data.user,
        accessToken: response.data.accessToken,
      });
      return response.data.accessToken;
    } catch (err) {
      console.error('Failed to refresh token:', err);
      return undefined;
    }
  };

  return { refresh };  // Ensure you're returning the function in an object
};

export default useRefreshToken;

