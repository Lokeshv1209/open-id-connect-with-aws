"use client";

import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import ErrorBoundary from "@/components/shared-component/ErrorBoundary";

import { persistor, store } from "../store/store";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          {children}
        </PersistGate>
      </Provider>
    </ErrorBoundary>
  );
}
