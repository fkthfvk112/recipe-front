"use client";

import PresetUpdatePage from "./PresetUpdatePage";

export default function Page({ params }: { params: { presetId: string } }) {
  const presetId = Number(params.presetId);
  return <PresetUpdatePage presetId={presetId} />;
}
