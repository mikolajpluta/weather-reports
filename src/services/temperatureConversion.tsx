import { TemperatreUnit } from '../types/weatherReport';

export const toKelvin = (temperature: number, fromUnit: TemperatreUnit): number => {
    if (fromUnit === 'K') {
      return temperature;
    }
  
    if (fromUnit === 'C') {
      return temperature + 273.15;
    }
  
    if (fromUnit === 'F') {
      return ((temperature - 32) * 5/9) + 273.15;
    }

    throw new Error(`Nieobsługiwana konwersja`);
  };