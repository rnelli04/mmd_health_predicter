import axios from 'axios';

const API_BASE = 'http://localhost:5000/api/smart';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
});

export async function getAvailableDrives() {
  const res = await api.get('/drives');
  return res.data;
}

export async function selectDrive(device) {
  const res = await api.post('/select-drive', { device });
  return res.data;
}

export async function getSmartSummary() {
  const res = await api.get('/summary');
  return res.data;
}

export async function getHealthTrends() {
  const res = await api.get('/trends');
  return res.data;
}

export async function getSmartHistory() {
  const res = await api.get('/history');
  return res.data;
}
