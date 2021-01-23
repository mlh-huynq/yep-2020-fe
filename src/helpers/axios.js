import axios from 'axios';
import { API_URL } from '@/helpers/constants';

const instance = axios.create({
  baseURL: API_URL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json; charset=utf-8'
  }
});

instance.defaults.headers.post['Content-Type'] =
  'application/x-www-form-urlencoded';
instance.defaults.headers.get['Content-Type'] = 'application/json';

export default instance;
