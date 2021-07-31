import { atom } from "jotai";
import { atomWithQuery } from "jotai/query";

import { forecastApiKeyAtom, cityAtom, unitsAtom } from "app/shared/app-atoms";
import { dayMap } from "./utils";

export const forecastAtom = atomWithQuery((get) => ({
  queryKey: ["forecast", get(cityAtom)],
  queryFn: async () => {
    const city = get(cityAtom);
    const apiKey = get(forecastApiKeyAtom);
    const units = get(unitsAtom);
    // prettier-ignore
    const forecastEndpoint = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=${units}`
    const res = await fetch(forecastEndpoint);
    const payload = await res.json();
    if (res.ok) {
      return payload;
    } else throw Error(payload.message);
  }
}));

export const simpleForecastAtom = atom((get) => {
  const forecast = get(forecastAtom);
  return forecast.list.map((f) => {
    const {
      dt_txt: fdate,
      weather: [{ icon, description }],
      main: { temp, temp_min: min, temp_max: max }
    } = f;
    const day = new Date(fdate).toString().slice(0, 3);
    return {
      day,
      date: fdate,
      temp,
      min,
      max,
      icon,
      description
    };
  });
});

export const reducedForecastAtom = atom((get) => {
  const simpleForecast = get(simpleForecastAtom);
  return simpleForecast.reduce((prev, f) => {
    const { day, date, temp, min, max, icon, description } = f;
    const prevMin = prev[day]?.min || Number.MAX_SAFE_INTEGER;
    const prevMax = prev[day]?.max || Number.MIN_SAFE_INTEGER;
    return {
      ...prev,
      [day]: {
        description: prev.description || description,
        icon: prev.icon || icon,
        temp: (prev.temp || temp + temp) / 2,
        min: prevMin > min ? min : prevMin,
        max: prevMax < max ? max : prevMax,
        measurements: [
          ...(prev?.[day]?.measurements || []),
          { date, temp, min, max, icon, description }
        ]
      }
    };
  }, {});
});

export const daySelectedAtom = atom();
export const dayForecastDataAtom = atom((get) => {
  const day = get(daySelectedAtom);
  if (!day) return;
  const reducedForecast = get(reducedForecastAtom);
  const dayForecast = reducedForecast[dayMap[day]];
  return dayForecast.measurements.map(({ temp, date }) => {
    const hour = parseInt(date.slice(-8, -6), 10);
    const i = {
      0: 1,
      3: 2,
      6: 3,
      9: 4,
      12: 5,
      15: 6,
      18: 7,
      21: 8
    }[hour];
    return [i, temp];
  });
});

export const weekForecastDataAtom = atom((get) => {
  const reducedForecast = get(reducedForecastAtom);
  const dayIndex = Object.keys(reducedForecast).map(
    (day) => ({ Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6, Sun: 7 }[day])
  );
  return Object.values(reducedForecast).map(({ temp }, i) => [
    dayIndex[i],
    temp
  ]);
});
