# Weather Forecast

This sample app shows daily and hourly forecast for any city in the world. By default it tries to get your current city using a [geolocation service](https://geolocation-db.com/json) but you can also specify a city through the url parameter "city" e.g. ?city=new+york.

## Technical Facts

- Weather data is fetched from [open weather map](https://api.openweathermap.org) API.
- Forecast graph is backed by airbnb [visx](https://airbnb.io/visx/)
- If no city is specified it tries to find the city where you are by using [geolocation-db](https://geolocation-db.com/json)
- It uses an alternative state management stack than the popular but outdated redux, instead here I used jotai + react-query to handle local and server state.
- Instead of using low level css files, I used css-in-js ([styled-components](https://styled-components.com/)) approach together with [tailwindcss](https://tailwindcss.com/) for a much more cleanner and readable UI code
