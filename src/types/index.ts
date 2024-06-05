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