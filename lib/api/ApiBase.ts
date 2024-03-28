import axios from 'axios';

const flureeApiUrl = process.env.NEXT_PUBLIC_FLUREE_API_URL as string;
const flureeToken = process.env.NEXT_PUBLIC_FLUREE_TOKEN as string;

export const FlureeClient = axios.create({
  baseURL: flureeApiUrl,
  timeout: 10000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    "Authorization": `${flureeToken}`
  }
});
