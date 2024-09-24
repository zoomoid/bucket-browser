import { ErrorBoundaryContext } from "@/hooks/use-fetch";
import { PropsWithChildren, useContext } from "react";
import { ModeToggle } from "./mode-toggle";

export default function Scaffolding({ children }: PropsWithChildren<unknown>) {
  const error = useContext(ErrorBoundaryContext);

  if (error) {
    children = (
      <>
        <pre>Failed to list objects</pre>
        <pre>{(error as object).toString()}</pre>
      </>
    );
  }

  return (
    <div className="dotted-sm md:dotted-md dotted min-h-screen">
      <nav className="flex p-4">
        <div className="flex-1">
          <p className="font-bold">{import.meta.env.VITE_SITE_TITLE}</p>
        </div>
        <div>
          <ModeToggle></ModeToggle>
        </div>
      </nav>
      <main className="p-4">{children}</main>
      <footer></footer>
    </div>
  );
}
