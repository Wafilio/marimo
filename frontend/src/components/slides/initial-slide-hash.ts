/* Copyright 2026 Marimo. All rights reserved. */

import { atom } from "jotai";
import { notebookQueuedOrRunningCountAtom } from "@/core/executions";
import { runtimeAdapterAtom } from "@/core/runtime/adapter";
import {
  activeNotebookAutorunAtom,
  activeNotebookReplicaAtom,
} from "@/core/session/active-notebook";

// WASM slide topology changes as its first run produces outputs. Resolving a
// numeric hash earlier would clamp it against an incomplete deck.
export const canResolveInitialSlideHashAtom = atom((get) => {
  if (get(runtimeAdapterAtom).kind !== "wasm") {
    return true;
  }
  const replica = get(activeNotebookReplicaAtom);
  const autorun = get(activeNotebookAutorunAtom);
  return (
    replica !== null &&
    get(replica.notebookAtom) !== null &&
    autorun !== null &&
    !get(autorun.pendingAtom) &&
    get(notebookQueuedOrRunningCountAtom) === 0
  );
});
