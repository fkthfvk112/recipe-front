export default function RecipeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <h1>레이아웃</h1>
      <div className="flex flex-col justify-center items-center p-8">
        {children}
      </div>
    </div>
  );
}
