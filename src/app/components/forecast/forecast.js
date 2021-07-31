import React from "react";
import { useAtomValue, useUpdateAtom } from "jotai/utils";
import { Route, Switch, Redirect } from "react-router-dom";
import tw from "twin.macro";

import { ForecastCard } from "./forecast-card";
import { ForecastGraph } from "./forecast-graph";
import {
  reducedForecastAtom,
  daySelectedAtom,
  weekForecastDataAtom,
  dayForecastDataAtom
} from "./forecast-atoms";
import { cityAtom } from "app/shared/app-atoms";
import { dayMap } from "./utils";
import { CustomLink } from "app/shared/custom-link";

const ForecastWithGraph = (props) => {
  const { className, children, data, ...restProps } = props;
  const dayForecastData = useAtomValue(dayForecastDataAtom);
  const weekForecastData = useAtomValue(weekForecastDataAtom);
  const city = useAtomValue(cityAtom);

  return (
    <div
      tw="flex flex-col items-center justify-center h-full"
      className={className}
    >
      <div
        css={{ "& > * + *": tw`ml-2` }}
        tw="flex justify-evenly w-full max-w-2xl"
      >
        {children}
      </div>
      <ForecastGraph
        tw="mt-5"
        city={city}
        data={dayForecastData || weekForecastData || []}
        {...restProps}
      />
    </div>
  );
};

export default function () {
  const forecastData = useAtomValue(reducedForecastAtom);
  const setDaySelected = useUpdateAtom(daySelectedAtom);
  return (
    // <ForecastGraph />
    <Switch>
      <Route
        path="/"
        exact
        render={() => {
          setDaySelected();
          return (
            <ForecastWithGraph>
              {Object.keys(forecastData).map((day) => (
                <CustomLink
                  to={`/${dayMap[day]}`}
                  component={ForecastCard}
                  key={day}
                  day={day}
                  {...forecastData[day]}
                />
              ))}
            </ForecastWithGraph>
          );
        }}
      />
      <Route
        path="/:day(sunday|monday|tuesday|wednesday|thursday|friday|saturday)"
        render={({
          match: {
            params: { day }
          }
        }) => {
          setDaySelected(day);
          const { measurements } = forecastData[dayMap[day]] || {};
          return measurements ? (
            <ForecastWithGraph hourly>
              {measurements.map((measurement) => (
                <CustomLink
                  to="/"
                  key={measurement.date}
                  component={ForecastCard}
                  {...measurement}
                />
              ))}
            </ForecastWithGraph>
          ) : (
            <Redirect to="/" />
          );
        }}
      />
      <Route path="*">
        <Redirect to="/" />
      </Route>
    </Switch>
  );
}
