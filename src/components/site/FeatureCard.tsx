import type { IconType } from "react-icons"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface FeatureCardProps {
  icon: IconType
  title: string
  description: string
}

export function FeatureCard({
  icon: Icon,
  title,
  description,
}: FeatureCardProps) {
  return (
    <Card className="h-full gap-5 bg-card/60 py-7 [--card-spacing:--spacing(7)]">
      <CardHeader className="gap-5">
        <div className="flex size-11 items-center justify-center rounded-lg border bg-muted/40">
          <Icon className="size-5" aria-hidden="true" />
        </div>
        <CardTitle className="text-xl leading-snug tracking-tight">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="leading-relaxed text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
}
