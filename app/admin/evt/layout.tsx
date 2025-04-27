export default function EvtLayout({
    children,
  }: {
    children: React.ReactNode;
  }){

    return(
        <div className="flex flex-col justify-start items-center w-full min-h-lvh p-5">
            {children}
        </div>
    )
}