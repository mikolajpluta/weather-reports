export type TemperatreUnit = 'C' | 'K' | 'F';

export interface WeatherReport {
    id: string;
    temperature: number;
    unit: TemperatreUnit;
    city: string;
    date: string;
}

