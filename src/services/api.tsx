import axios from 'axios';
import { weatherReportFormData } from '../types/weatherReportFormSchema';

const API_URL = 'https://meteo-server.onrender.com';

export const fetchWeatherReports = async () => {
    const response = await axios.get(API_URL + '/api/reports');
    return response.data;
}

export const addNewReport = async (data: weatherReportFormData) => {
    const response = await axios.post(API_URL + '/api/reports', data);
    return response.data;
}

export const fetchReportById = async (id: string) => {
    const response = await axios.get(API_URL + `/api/reports/${id}`);
    return response.data;
}

export const updateReport = async (id: string, data: weatherReportFormData) => {
    const response = await axios.put(API_URL + `/api/reports/${id}`, data);
    return response.data;
}
