"use client";

import { AppProgressBar } from "next-nprogress-bar";

/**
 * Thin navy progress bar at the top of the screen during route transitions.
 * Gives instant visual feedback the moment a nav item is clicked.
 */
export default function NavProgress() {
  return (
    <AppProgressBar
      height="3px"
      color="#1B3A6B"
      options={{ showSpinner: false }}
      shallowRouting
    />
  );
}
