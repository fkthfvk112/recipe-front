import RecipeCardSkeletion from "../(skeleton)/RecipeCardSkeletion";

export default function Loading() {
    return (
    <div className="flex flex-col flex-wrap justify-center items-center w-full min-h-[300px] mb-10">
        <div className="grid media-gridcol-3-to-2 w-full gap-3">
          <RecipeCardSkeletion/>
          <RecipeCardSkeletion/>
          <RecipeCardSkeletion/>
          <RecipeCardSkeletion/>
          <RecipeCardSkeletion/>
          <RecipeCardSkeletion/>
          <RecipeCardSkeletion/>
          <RecipeCardSkeletion/>
          <RecipeCardSkeletion/>
          <RecipeCardSkeletion/>
        </div>
      </div>
    );
  }
  