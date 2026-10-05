import { LuStar } from "react-icons/lu"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import type { Review } from "@/data/reviews"
import { curlyApostrophes, initials } from "@/lib/format"

export function ReviewCard({ review }: { review: Review }) {
  return (
    <Card className="h-full bg-card/60 py-7 [--card-spacing:--spacing(7)]">
      <CardContent className="flex h-full flex-col gap-5">
        <div
          role="img"
          aria-label={`${review.rating} out of 5 stars`}
          className="flex gap-1"
        >
          {Array.from({ length: 5 }, (_, i) => (
            <LuStar
              key={i}
              aria-hidden="true"
              className={
                i < review.rating
                  ? "size-4 fill-current text-foreground"
                  : "size-4 text-muted-foreground/40"
              }
            />
          ))}
        </div>
        <blockquote className="font-heading text-lg leading-relaxed text-foreground/90 italic">
          &ldquo;{curlyApostrophes(review.quote)}&rdquo;
        </blockquote>
        <div className="mt-auto flex items-center gap-3 pt-2">
          <Avatar size="lg">
            <AvatarFallback className="text-xs font-medium tracking-wide">
              {initials(review.author)}
            </AvatarFallback>
          </Avatar>
          <div className="leading-tight">
            <p className="text-sm font-medium">{review.author}</p>
            <p className="mt-1 text-sm text-muted-foreground">{review.role}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
