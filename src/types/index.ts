export type SearchType = {
  city: string,
  country: string
}

export type Country = {
  code: string,
  name: string
}

export type FormProps = {
  fetchWeather: (search: SearchType) => Promise<void>
}

export type Weather = {
  name: string,
  main: {
    temp: number,
    temp_max: number,
    temp_min: number
  }
}

export type WeatherDetailProps = {
  weather: Weather
}