import SearchBar from "@/app/SearchBar";

export default function RecipeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full flex flex-col justify-center items-center">
      <SearchBar></SearchBar>
      <div className="w-full min-h-lvh max-w-[1024px] p-8 mt-10">
        {children}
      </div>
    </div>
  );
}
