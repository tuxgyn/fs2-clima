export type CityLocation = {
  name: string
  latitude: number
  longitude: number
  country_code: string
  timezone: string
}

export type WeatherSnapshot = {
  temperature_2m: number
  relative_humidity_2m: number
  apparent_temperature: number
  is_day: number
  precipitation: number
  weather_code: number
  wind_speed_10m: number
  wind_direction_10m: number
  time: string
}

const isValidNumber = (value: unknown): value is number => typeof value === 'number' && Number.isFinite(value)

export async function getCityByName(cityName: string): Promise<CityLocation | null> {
  const query = cityName.trim()

  if (!query) {
    return null
  }

  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=1&language=pt&format=json`

  try {
    const response = await fetch(url)

    if (!response.ok) {
      return null
    }

    const data = (await response.json()) as {
      results?: Array<{
        name?: string
        latitude?: number
        longitude?: number
        country_code?: string
        timezone?: string
      }>
    }

    const result = data.results?.[0]

    if (
      !result ||
      !result.name ||
      !isValidNumber(result.latitude) ||
      !isValidNumber(result.longitude) ||
      !result.country_code ||
      !result.timezone
    ) {
      return null
    }

    return {
      name: result.name,
      latitude: result.latitude,
      longitude: result.longitude,
      country_code: result.country_code,
      timezone: result.timezone,
    }
  } catch {
    return null
  }
}

export async function getWeatherByLocation(location: CityLocation): Promise<WeatherSnapshot | null> {
  const url = new URL('https://api.open-meteo.com/v1/forecast')
  url.searchParams.set('latitude', String(location.latitude))
  url.searchParams.set('longitude', String(location.longitude))
  url.searchParams.set('current', [
    'temperature_2m',
    'relative_humidity_2m',
    'apparent_temperature',
    'is_day',
    'precipitation',
    'weather_code',
    'wind_speed_10m',
    'wind_direction_10m',
  ].join(','))
  url.searchParams.set('timezone', location.timezone)

  try {
    const response = await fetch(url)

    if (!response.ok) {
      return null
    }

    const data = (await response.json()) as {
      current?: {
        time?: string
        temperature_2m?: number
        relative_humidity_2m?: number
        apparent_temperature?: number
        is_day?: number
        precipitation?: number
        weather_code?: number
        wind_speed_10m?: number
        wind_direction_10m?: number
      }
    }

    const current = data.current

    if (
      !current ||
      !current.time ||
      !isValidNumber(current.temperature_2m) ||
      !isValidNumber(current.relative_humidity_2m) ||
      !isValidNumber(current.apparent_temperature) ||
      !isValidNumber(current.is_day) ||
      !isValidNumber(current.precipitation) ||
      !isValidNumber(current.weather_code) ||
      !isValidNumber(current.wind_speed_10m) ||
      !isValidNumber(current.wind_direction_10m)
    ) {
      return null
    }

    return {
      time: current.time,
      temperature_2m: current.temperature_2m,
      relative_humidity_2m: current.relative_humidity_2m,
      apparent_temperature: current.apparent_temperature,
      is_day: current.is_day,
      precipitation: current.precipitation,
      weather_code: current.weather_code,
      wind_speed_10m: current.wind_speed_10m,
      wind_direction_10m: current.wind_direction_10m,
    }
  } catch {
    return null
  }
}
