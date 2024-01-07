"use client";

import { useRef } from "react";

export default function Serving() {
  const dragContainerRef = useRef(null);
  return (
    <div className="flex flex-row justify-between items-center w-full m-3">
      <div>
        <h2>음식양</h2>
      </div>
      <div>
        <select className="w-16" name="" id="">
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6</option>
        </select>
        <span>인분</span>
      </div>
    </div>
  );
}
