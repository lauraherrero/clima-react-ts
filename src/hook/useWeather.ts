import axios from "axios";
import { z } from "zod";
//import { object, string, number, Output, parse } from 'valibot';
import { SearchType } from "../types";
import { useMemo, useState } from "react";

//TYPE GUARDS O ASSERTION
// function isWeatherResponse(weather: unknown): weather is Weather {
//   return (
//     Boolean(weather) &&
//     typeof weather === 'object' &&
//     typeof (weather as Weather).name === 'string' &&
//     typeof (weather as Weather).main.temp === 'number' &&
//     typeof (weather as Weather).main.temp_max === 'number' &&
//     typeof (weather as Weather).main.temp_min === 'number'
//   )
// }

//ZOD:
const Weather = z.object({
  name: z.string(),
  main: z.object({
    temp: z.number(),
    temp_min: z.number(),
    temp_max: z.number(),
  }),
});
export type Weather = z.infer<typeof Weather>;

//VALIBOT:
// const WeatherSchema = object({
//   name: string(),
//   main: object({
//     temp: number(),
//     temp_min: number(),
//     temp_max: number()
//   })
// })
// type WeatherResult = Output<typeof WeatherSchema>;

const initialState = {
  name: "",
  main: {
    temp: 0,
    temp_min: 0,
    temp_max: 0,
  },
};

export default function useWeather() {
  const [weather, setWeather] = useState<Weather>(initialState);

  const [loading, setLoading] = useState(false);

  const fetchWeather = async (search: SearchType) => {
    const appId = import.meta.env.VITE_API_KEY;
    setLoading(true);
    setWeather(initialState);
    try {
      const geoUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${search.city},${search.country}&appid=${appId}`;

      const { data } = await axios(geoUrl);

      const latitud = data[0].lat;
      const longitud = data[0].lon;

      const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitud}&lon=${longitud}&appid=${appId}`;
      //Castear el type
      //Renombro este data porque ya tengo otro arriba
      // const { data: weatherData } = await axios<Weather>(weatherUrl);
      // console.log(weatherData);

      //TYPE GUARDS:
      // const { data: weatherData } = await axios(weatherUrl);
      // const result = isWeatherResponse(weatherData);
      // if(result) {
      //   console.log(weatherData.name);
      // } else {
      //   console.log('Respuesta mal formada');
      // }

      //ZOD:
      const { data: weatherData } = await axios(weatherUrl);
      const result = Weather.safeParse(weatherData);
      if (result.success) {
        setWeather(result.data);
      }

      //VALIBOT:
      // const { data: weatherData } = await axios(weatherUrl);
      // const result = parse(WeatherSchema, weatherData);
      // console.log(result);
      // if(result) {
      //   console.log(result.name);
      //   console.log(result.main.temp);
      // }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const hasWeatherData = useMemo(() => weather.name, [weather]);

  return {
    weather,
    loading,
    fetchWeather,
    hasWeatherData,
  };
}
