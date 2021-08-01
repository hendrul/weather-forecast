import { atom } from "jotai";
import { atomWithQuery } from "jotai/query";
import upperfirst from "lodash.upperfirst";
import qs from "qs";

import history from "app/shared/history";

export const forecastApiKeyAtom = atom("58a3e01a95aa0a59f9b2245cdc7631f5");
export const unitsAtom = atom("metric");
export const locationAtom = atomWithQuery({
  queryKey: "location",
  queryFn: async () => {
    try {
      let res = await fetch("https://geolocation-db.com/json/");
      res = await res.json();
      return res;
    } catch {}
  }
});

export const cityValueAtom = atom();
cityValueAtom.onMount = (setAtom) => {
  const setCityParam = (search) => {
    let { city } = qs.parse(search, {
      ignoreQueryPrefix: true
    });
    if (city) setAtom(upperfirst(city));
  };
  setCityParam(history.location.search);
  return history.listen(({ search }) => setCityParam(search));
};
export const cityAtom = atom((get) => {
  return get(cityValueAtom) || get(locationAtom)?.city || "Washington";
});
