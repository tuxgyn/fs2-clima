import './style.css'
import { getCityByName, getWeatherByLocation } from './openMeteo'

const weatherCodeMap: Record<number, string> = {
  0: 'Céu limpo',
  1: 'Principalmente limpo',
  2: 'Parcialmente nublado',
  3: 'Nublado',
  45: 'Neblina',
  48: 'Neblina com geada',
  51: 'Chuvisco leve',
  53: 'Chuvisco moderado',
  55: 'Chuvisco denso',
  56: 'Chuvisco gelado leve',
  57: 'Chuvisco gelado intenso',
  61: 'Chuva leve',
  63: 'Chuva moderada',
  65: 'Chuva forte',
  66: 'Chuva gelada leve',
  67: 'Chuva gelada forte',
  71: 'Neve leve',
  73: 'Neve moderada',
  75: 'Neve forte',
  77: 'Grãos de neve',
  80: 'Pancadas leves',
  81: 'Pancadas moderadas',
  82: 'Pancadas violentas',
  85: 'Pancadas de neve pequenas',
  86: 'Pancadas de neve fortes',
  95: 'Trovoada',
  96: 'Trovoada com granizo leve',
  97: 'Trovoada intensa',
  99: 'Trovoada com granizo forte',
}

const weatherIconMap: Record<number, string> = {
  0: '☀️',
  1: '🌤️',
  2: '⛅',
  3: '☁️',
  45: '🌫️',
  48: '🌫️',
  51: '🌦️',
  53: '🌦️',
  55: '🌧️',
  56: '🌧️',
  57: '🌧️',
  61: '🌦️',
  63: '🌧️',
  65: '🌧️',
  66: '🌧️',
  67: '🌧️',
  71: '🌨️',
  73: '🌨️',
  75: '❄️',
  77: '❄️',
  80: '🌦️',
  81: '🌧️',
  82: '⛈️',
  85: '🌨️',
  86: '🌨️',
  95: '⛈️',
  96: '⛈️',
  97: '⛈️',
  99: '⛈️',
}

const app = document.querySelector<HTMLDivElement>('#app')

if (!app) {
  throw new Error('App element not found')
}

app.innerHTML = `
  <div class="weather-shell">
    <aside class="weather-sidebar">
      <div class="weather-visual">
        <div id="weather-badge" class="weather-badge" aria-label="Condição climática">☀️</div>
      </div>

      <div class="temperature-row">
        <span id="temperature" class="temperature">--°C</span>
      </div>

      <div class="city-meta">
        <h1 id="city-name" class="city-name">Cidade</h1>
        <p id="country-code" class="country-code">BR</p>
      </div>

      <div class="date-block">
        <span class="label">Hoje</span>
        <p id="current-date" class="value">--</p>
      </div>

      <div class="status-block">
        <span class="label">Status</span>
        <p id="day-status" class="value">Aguardando busca</p>
      </div>
    </aside>

    <main class="weather-main">
      <header class="search-bar">
        <label class="sr-only" for="city-search">Buscar cidade</label>
        <input id="city-search" type="text" placeholder="Digite uma cidade" />
        <button id="search-button" type="button">Buscar</button>
      </header>

      <section id="info-grid" class="info-grid hidden" aria-live="polite">
        <article class="metric-card">
          <span>Umidade relativa</span>
          <strong id="humidity">--%</strong>
        </article>
        <article class="metric-card">
          <span>Temperatura aparente</span>
          <strong id="feels-like">--°C</strong>
        </article>
        <article class="metric-card">
          <span>Precipitação</span>
          <strong id="precipitation">-- mm</strong>
        </article>
        <article class="metric-card">
          <span>Vento</span>
          <strong id="wind">-- km/h</strong>
        </article>
      </section>

      <section id="empty-state" class="empty-state" aria-live="polite">
        <h2>Sem dados no momento</h2>
        <p>Insira o nome de uma cidade para consultar o clima.</p>
      </section>

      <section id="loading-state" class="loading-state hidden" aria-live="polite">
        <p>Buscando clima…</p>
      </section>
    </main>
  </div>
`

const cityInput = document.querySelector<HTMLInputElement>('#city-search')
const searchButton = document.querySelector<HTMLButtonElement>('#search-button')
const temperatureEl = document.querySelector<HTMLElement>('#temperature')
const cityNameEl = document.querySelector<HTMLElement>('#city-name')
const countryCodeEl = document.querySelector<HTMLElement>('#country-code')
const currentDateEl = document.querySelector<HTMLElement>('#current-date')
const dayStatusEl = document.querySelector<HTMLElement>('#day-status')
const weatherBadgeEl = document.querySelector<HTMLElement>('#weather-badge')
const humidityEl = document.querySelector<HTMLElement>('#humidity')
const feelsLikeEl = document.querySelector<HTMLElement>('#feels-like')
const precipitationEl = document.querySelector<HTMLElement>('#precipitation')
const windEl = document.querySelector<HTMLElement>('#wind')
const infoGrid = document.querySelector<HTMLElement>('#info-grid')
const emptyState = document.querySelector<HTMLElement>('#empty-state')
const loadingState = document.querySelector<HTMLElement>('#loading-state')

if (
  !cityInput ||
  !searchButton ||
  !temperatureEl ||
  !cityNameEl ||
  !countryCodeEl ||
  !currentDateEl ||
  !dayStatusEl ||
  !weatherBadgeEl ||
  !humidityEl ||
  !feelsLikeEl ||
  !precipitationEl ||
  !windEl ||
  !infoGrid ||
  !emptyState ||
  !loadingState
) {
  throw new Error('Required weather elements are missing')
}

const formatTemperature = (value: number): string => `${Math.round(value)}°C`
const formatDate = (value: string): string => new Intl.DateTimeFormat('pt-BR', { dateStyle: 'full' }).format(new Date(value))

const setLoading = (isLoading: boolean): void => {
  loadingState.classList.toggle('hidden', !isLoading)
  emptyState.classList.toggle('hidden', isLoading)
  infoGrid.classList.toggle('hidden', isLoading)
  searchButton.disabled = isLoading
}

const showEmptyState = (message: string): void => {
  emptyState.innerHTML = `<h2>Sem resultado</h2><p>${message}</p>`
  emptyState.classList.remove('hidden')
  infoGrid.classList.add('hidden')
  loadingState.classList.add('hidden')
}

const renderWeather = (cityName: string, countryCode: string, date: string, isDay: number, weatherCode: number): void => {
  const isDaytime = isDay === 1
  const weatherLabel = weatherCodeMap[weatherCode] ?? 'Condição climática'
  const icon = weatherIconMap[weatherCode] ?? '🌤️'

  cityNameEl.textContent = cityName
  countryCodeEl.textContent = countryCode.toUpperCase()
  currentDateEl.textContent = formatDate(date)
  dayStatusEl.textContent = `${isDaytime ? 'Dia' : 'Noite'} · ${weatherLabel}`
  weatherBadgeEl.textContent = icon
  weatherBadgeEl.setAttribute('aria-label', `${isDaytime ? 'Dia' : 'Noite'} - ${weatherLabel}`)
  temperatureEl.textContent = '--°C'
  emptyState.classList.add('hidden')
  infoGrid.classList.remove('hidden')
}

const renderValues = (temperature: number, humidity: number, feelsLike: number, precipitation: number, wind: number, direction: number): void => {
  temperatureEl.textContent = formatTemperature(temperature)
  humidityEl.textContent = `${Math.round(humidity)}%`
  feelsLikeEl.textContent = formatTemperature(feelsLike)
  precipitationEl.textContent = `${Number(precipitation).toFixed(1)} mm`
  windEl.textContent = `${Math.round(wind)} km/h · ${Math.round(direction)}°`
}

const handleSearch = async (): Promise<void> => {
  const cityName = cityInput.value.trim()

  if (!cityName) {
    showEmptyState('Digite o nome de uma cidade antes de buscar.')
    return
  }

  setLoading(true)

  try {
    const city = await getCityByName(cityName)

    if (!city) {
      showEmptyState('Cidade não encontrada. Tente outro nome.')
      return
    }

    const weather = await getWeatherByLocation(city)

    if (!weather) {
      showEmptyState('Não foi possível carregar as informações do clima para esta cidade.')
      return
    }

    renderWeather(city.name, city.country_code, weather.time, weather.is_day, weather.weather_code)
    renderValues(
      weather.temperature_2m,
      weather.relative_humidity_2m,
      weather.apparent_temperature,
      weather.precipitation,
      weather.wind_speed_10m,
      weather.wind_direction_10m,
    )
  } catch {
    showEmptyState('Ocorreu um erro ao consultar o clima. Tente novamente.')
  } finally {
    setLoading(false)
  }
}

searchButton.addEventListener('click', () => {
  void handleSearch()
})

cityInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault()
    void handleSearch()
  }
})

showEmptyState('Insira o nome de uma cidade para consultar o clima.')
