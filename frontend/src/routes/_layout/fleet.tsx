import { createFileRoute } from "@tanstack/react-router";
import React from "react";

export const Route = createFileRoute("/_layout/fleet")({
  component: ChooseFleet,
});

export default function ChooseFleet() {
  return <div>ChooseFleet</div>;
}
