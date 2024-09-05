import AspectRatio from "@mui/joy/AspectRatio";
import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import CardOverflow from "@mui/joy/CardOverflow";

export default function RecipeCardSkeletion(){
    return (
        <Card variant="outlined" sx={{ aspectRatio:"1 / 1", minWidth:"140px", marginBottom:"1rem" }}>
        <CardOverflow>
          <AspectRatio sx={{ overflow:"hidden"}} ratio="1/1">
            <div className="w-[300] h-[300] bg-[#e1e1e1]"/>
          </AspectRatio>
        </CardOverflow>
        <CardContent>
            <div className="w-full bg-[#e1e1e1] h-6"/>
            <section className="w-full bg-[#e1e1e1] h-6 mt-1"/>
        </CardContent>
        <CardOverflow variant="soft" sx={{ bgcolor: "background.leve1" }}>
          <div className="pt-2 pb-2 text-[#3b3b3b] h-10"/>
        </CardOverflow>
      </Card>
    )
}