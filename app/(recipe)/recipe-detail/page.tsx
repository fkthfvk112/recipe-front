"use client";
import axios from "axios";

export default function RecipeDetail() {
  const test = () => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}recipe/get-recipe?recipeId=10`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
      });
  };
  return (
    <div className="p-5 max-w-xl w-dvw m-3 bg-white px-4 flex flex-col justify-center items-center">
      <button onClick={() => test()}>클릭</button>
    </div>
  );
}
