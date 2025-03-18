import axios from 'axios';

interface EnvironmentalData {
  timestamp: number;
  location: { lat: number; lng: number; };
  metrics: {
    aqi?: number;
    pm25?: number;
    pm10?: number;
    o3?: number;
    no2?: number;
    so2?: number;
    co?: number;
    temperature?: number;
    humidity?: number;
    precipitation?: number;
    windSpeed?: number;
    windDirection?: number;
    pressure?: number;
    ndvi?: number;
    lst?: number;
    waterBodies?: number;
    urbanDensity?: number;
  };
}

export class EnvironmentalDataService {
  private static instance: EnvironmentalDataService;
  private clients: Record<string, any>;

  private constructor() {
    const apiKeys = {
      openaq: process.env.REACT_APP_OPENAQ_API_KEY,
      sentinel: process.env.REACT_APP_SENTINEL_API_KEY,
    };

    this.clients = {
      openaq: axios.create({
        baseURL: process.env.REACT_APP_OPENAQ_API_URL,
        headers: { 'api-key': apiKeys.openaq },
      }),
      meteo: axios.create({
        baseURL: process.env.REACT_APP_OPEN_METEO_API_URL,
      }),
      sentinel: axios.create({
        baseURL: process.env.REACT_APP_SENTINEL_API_URL,
        headers: { Authorization: `Bearer ${apiKeys.sentinel}` },
      }),
    };
  }

  static getInstance(): EnvironmentalDataService {
    if (!this.instance) {
      this.instance = new EnvironmentalDataService();
    }
    return this.instance;
  }

  async getEnvironmentalData(lat: number, lng: number): Promise<EnvironmentalData> {
    try {
      const [airQuality, weather, satellite] = await Promise.all([
        this.fetchAirQuality(lat, lng),
        this.fetchWeather(lat, lng),
        this.fetchSatellite(lat, lng),
      ]);

      return {
        timestamp: Date.now(),
        location: { lat, lng },
        metrics: { ...airQuality, ...weather, ...satellite },
      };
    } catch (error) {
      console.error('Error fetching environmental data:', error);
      throw error;
    }
  }

  private async fetchAirQuality(lat: number, lng: number) {
    try {
      const { data } = await this.clients.openaq.get('/latest', {
        params: { coordinates: `${lat},${lng}`, radius: 10000 },
      });
      return this.transformAirQualityData(data);
    } catch {
      const { data } = await this.clients.meteo.get('/air-quality', {
        params: { latitude: lat, longitude: lng, current: true },
      });
      return this.transformAirQualityData(data, true);
    }
  }

  private async fetchWeather(lat: number, lng: number) {
    const { data } = await this.clients.meteo.get('/forecast', {
      params: {
        latitude: lat,
        longitude: lng,
        current: true,
        hourly: 'temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m',
      },
    });
    return {
      temperature: data.current.temperature_2m,
      humidity: data.current.relative_humidity_2m,
      precipitation: data.current.precipitation,
      windSpeed: data.current.wind_speed_10m,
    };
  }

  private async fetchSatellite(lat: number, lng: number) {
    const { data } = await this.clients.sentinel.get(`/${process.env.REACT_APP_SENTINEL_INSTANCE_ID}`, {
      params: {
        request: 'GetMap',
        layers: 'NDVI,LST',
        bbox: `${lng-0.1},${lat-0.1},${lng+0.1},${lat+0.1}`,
        width: 512,
        height: 512,
        format: 'image/png',
      },
    });
    return {
      ndvi: this.calculateIndex(data, 'NDVI'),
      lst: this.calculateIndex(data, 'LST'),
      waterBodies: this.calculateIndex(data, 'WATER'),
      urbanDensity: this.calculateIndex(data, 'URBAN'),
    };
  }

  private transformAirQualityData(data: any, isMeteo = false): Record<string, number> {
    if (isMeteo) {
      return {
        aqi: data.current.european_aqi,
        pm25: data.current.pm2_5,
        pm10: data.current.pm10,
        o3: data.current.ozone,
        no2: data.current.nitrogen_dioxide,
        so2: data.current.sulphur_dioxide,
        co: data.current.carbon_monoxide,
      };
    }
    const measurements = data.results[0]?.measurements || [];
    return {
      aqi: this.calculateAQI(measurements),
      pm25: measurements.find(m => m.parameter === 'pm25')?.value || 0,
      pm10: measurements.find(m => m.parameter === 'pm10')?.value || 0,
      o3: measurements.find(m => m.parameter === 'o3')?.value || 0,
      no2: measurements.find(m => m.parameter === 'no2')?.value || 0,
      so2: measurements.find(m => m.parameter === 'so2')?.value || 0,
      co: measurements.find(m => m.parameter === 'co')?.value || 0,
    };
  }

  private calculateAQI(measurements: any[]): number {
    const pm25 = measurements.find(m => m.parameter === 'pm25')?.value || 0;
    if (pm25 <= 12.0) return ((50 - 0) / 12.0) * pm25;
    if (pm25 <= 35.4) return ((100 - 51) / 23.3) * (pm25 - 12.1) + 51;
    if (pm25 <= 55.4) return ((150 - 101) / 19.9) * (pm25 - 35.5) + 101;
    if (pm25 <= 150.4) return ((200 - 151) / 94.9) * (pm25 - 55.5) + 151;
    if (pm25 <= 250.4) return ((300 - 201) / 99.9) * (pm25 - 150.5) + 201;
    return ((400 - 301) / 99.9) * (pm25 - 250.5) + 301;
  }

  private calculateIndex(data: any, type: string): number {
    // Simplified placeholder implementation
    return Math.random(); // In real implementation, this would process image data
  }
}

export const environmentalDataService = EnvironmentalDataService.getInstance(); 