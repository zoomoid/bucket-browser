import { useContext } from "react";
import { DataProviderContext, type Tree } from "./hooks/use-fetch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./components/ui/table";
import { bytes } from "./lib/utils";
import { Skeleton } from "./components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./components/ui/tooltip";
import { Button } from "./components/ui/button";

const bucketEndpoint = import.meta.env.VITE_BUCKET_ENDPOINT as string;

function App() {
  const objects = useContext(DataProviderContext)!;

  if (!objects) {
    return <PlaceholderTable></PlaceholderTable>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Filename</TableHead>
          <TableHead>
            <span className="hidden sm:block">Last Modified</span>
          </TableHead>
          <TableHead>Size</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        <Directory tree={objects} depth={0}></Directory>
      </TableBody>
    </Table>
  );
}

const indentFactor = 0.5;

function Directory({ tree, depth }: { tree: Tree; depth: number }) {
  if (!("children" in tree)) {
    // leaf node
    return (
      <TableRow>
        <TableCell>
          <span
            style={{
              paddingLeft: `${indentFactor * depth}rem`,
            }}
            className="whitespace-pre"
          >
            {tree.key}
          </span>
        </TableCell>
        <TableCell>
          <span className="hidden md:block">
            {new Date(tree.lastModified).toISOString()}
          </span>
          <div className="block md:hidden">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Button variant={"ghost"} size={"icon"}>
                    <i className="material-icons-round">info</i>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  Last Modified: {new Date(tree.lastModified).toISOString()}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </TableCell>
        <TableCell>
          <span className="text-xs sm:test-sm">{bytes(tree.size)}</span>
        </TableCell>
        <TableCell>
          <a href={`${bucketEndpoint}/${tree.object}`} target="_blank">
            <Button variant={"ghost"} size={"icon"}>
              <i className="material-icons-round">download</i>
            </Button>
          </a>
        </TableCell>
      </TableRow>
    );
  }
  return (
    <>
      <TableRow>
        <TableCell>
          <span
            style={{
              paddingLeft: `${indentFactor * depth}rem`,
            }}
          >
            {tree.key} /
          </span>
        </TableCell>
        <TableCell></TableCell>
        <TableCell></TableCell>
        <TableCell></TableCell>
      </TableRow>
      {"children" in tree &&
        tree.children.map((t) => (
          <Directory tree={t} key={t.key} depth={depth + 1}></Directory>
        ))}
    </>
  );
}

function PlaceholderTable() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Filename</TableHead>
          <TableHead>Last Modified</TableHead>
          <TableHead>Size</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {" "
          .repeat(4)
          .split("")
          .map(() => (
            <>
              <TableRow>
                <TableCell>
                  <Skeleton className="w-64 h-4 rounded-full"></Skeleton>
                </TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Skeleton className="w-64 ml-4 h-4 rounded-full"></Skeleton>
                </TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Skeleton className="w-96 ml-8 h-4 rounded-full"></Skeleton>
                </TableCell>
                <TableCell>
                  <Skeleton className="w-48 h-4 rounded-full"></Skeleton>
                </TableCell>
                <TableCell>
                  <Skeleton className="w-16 h-4 rounded-full"></Skeleton>
                </TableCell>
                <TableCell></TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Skeleton className="w-80 ml-8 h-4 rounded-full"></Skeleton>
                </TableCell>
                <TableCell>
                  <Skeleton className="w-48 h-4 rounded-full"></Skeleton>
                </TableCell>
                <TableCell>
                  <Skeleton className="w-16 h-4 rounded-full"></Skeleton>
                </TableCell>
                <TableCell></TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Skeleton className="w-64 ml-8 h-4 rounded-full"></Skeleton>
                </TableCell>
                <TableCell>
                  <Skeleton className="w-48 h-4 rounded-full"></Skeleton>
                </TableCell>
                <TableCell>
                  <Skeleton className="w-16 h-4 rounded-full"></Skeleton>
                </TableCell>
                <TableCell></TableCell>
              </TableRow>
            </>
          ))}
      </TableBody>
    </Table>
  );
}

export default App;
