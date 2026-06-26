import { useRouter } from "./lib/router";
import App from "./App";
import { ElAb } from "./elab/ElAb";

/** Top-level route switch: /ab → El-Ab module, everything else → Roznama. */
export function Root() {
  const { path } = useRouter();
  if (path.startsWith("/ab")) return <ElAb />;
  return <App />;
}
