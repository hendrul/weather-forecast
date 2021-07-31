import React from "react";
import { format } from "date-fns";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "twin.macro";

import Spinner from "app/shared/spinner";

export const ForecastCard = (props) => {
  const { day, date, icon, min, max, description = "", ...restProps } = props;
  const time = date ? format(new Date(date), "h aa") : date;
  return (
    <div
      tw="flex flex-col transition duration-100 ease-in-out transform hover:(-translate-y-1 scale-110 shadow-lg duration-75) active:(scale-100) cursor-pointer items-center justify-center w-24 h-28 border-2 border-orange-600 font-thin text-sm text-white bg-gray-600 rounded-md"
      {...restProps}
    >
      <p>{day || time}</p>
      <LazyLoadImage
        width="48px"
        height="48px"
        placeholder={<Spinner />}
        src={`http://openweathermap.org/img/wn/${icon}.png`}
        alt={description}
      />
      <div tw="flex">
        <p tw="font-semibold text-orange-200">{Math.round(max)}°</p>
        <p tw="ml-3">{Math.round(min)}°</p>
      </div>
    </div>
  );
};
