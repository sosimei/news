import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { cn } from "@/lib/utils"

type BiasType = "left-leaning" | "center-left" | "center" | "center-right" | "right-leaning"

interface NewsCardProps {
  title: string
  description: string
  source: string
  date: string
  imageUrl: string
  bias: BiasType
}

export function NewsCard({ title, description, source, date, imageUrl, bias }: NewsCardProps) {
  const getBiasColor = (bias: BiasType) => {
    switch (bias) {
      case "left-leaning":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200"
      case "center-left":
        return "bg-sky-100 text-sky-800 hover:bg-sky-200"
      case "center":
        return "bg-gray-100 text-gray-800 hover:bg-gray-200"
      case "center-right":
        return "bg-amber-100 text-amber-800 hover:bg-amber-200"
      case "right-leaning":
        return "bg-red-100 text-red-800 hover:bg-red-200"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200"
    }
  }

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <div className="aspect-video w-full overflow-hidden">
        <img src={imageUrl || "/placeholder.svg"} alt={title} className="h-full w-full object-cover" />
      </div>
      <CardHeader className="p-4">
        <div className="flex items-center justify-between">
          <Badge variant="outline">{source}</Badge>
          <Badge className={cn(getBiasColor(bias), "border-0")}>{bias}</Badge>
        </div>
        <h3 className="line-clamp-2 text-lg font-bold">{title}</h3>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <p className="line-clamp-3 text-sm text-muted-foreground">{description}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <p className="text-xs text-muted-foreground">{date}</p>
      </CardFooter>
    </Card>
  )
}

