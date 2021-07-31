import React, { Suspense, StrictMode } from "react";
import ReactDOM from "react-dom";
import { Router, Route } from "react-router-dom";
import { Provider } from "jotai";
import "twin.macro";

import Forecast from "app/components/forecast";
import Spinner from "app/shared/spinner";
import history from "app/shared/history";
import GlobalStyles from "./global-styles";

const CenteredSpinner = () => (
  <div tw="fixed top-0 left-0 w-full h-full flex justify-center items-center">
    <Spinner />
  </div>
);

const rootElement = document.getElementById("root");
ReactDOM.render(
  <StrictMode>
    <Provider>
      <GlobalStyles />
      <Router history={history}>
        <Route path="/">
          <Suspense fallback={<CenteredSpinner />}>
            <Forecast />
          </Suspense>
        </Route>
      </Router>
    </Provider>
  </StrictMode>,
  rootElement
);
