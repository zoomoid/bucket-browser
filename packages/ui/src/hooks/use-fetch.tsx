import React, { createContext, PropsWithChildren, useState } from "react";

const DataProviderContext = createContext<Tree | undefined>(undefined);
const ErrorBoundaryContext = createContext<unknown>(undefined);

export type Leaf = {
  key: string;
  object: string;
  lastModified: string;
  size: number;
};

export type Tree = Leaf | { key: string; children: Array<Tree> };

function useFetch(url: string) {
  const [objects, setObjects] = useState<Tree | undefined>(undefined);
  const [error, setError] = useState<unknown | undefined>(undefined);

  React.useEffect(() => {
    fetch(url)
      .then((r) => r.json())
      .then((o) => setObjects(o))
      .catch((e) =>
        setError(new Error(`Failed to fetch data from ${url}: ${e}`))
      );
  }, [url]);

  return {
    objects,
    error,
  };
}

const endpointBaseUrl = import.meta.env.VITE_WORKER_ENDPOINT;

export function DataProvider({ children }: PropsWithChildren<unknown>) {
  const { objects, error } = useFetch(`${endpointBaseUrl}/objects`);

  return (
    <ErrorBoundaryContext.Provider value={error}>
      <DataProviderContext.Provider value={objects}>
        {children}
      </DataProviderContext.Provider>
    </ErrorBoundaryContext.Provider>
  );
}

export { useFetch, DataProviderContext, ErrorBoundaryContext };
