import * as UI from "@bridge/ui"

export default function Example() {
  return (
    <UI.Carousel className="w-64">
      <UI.CarouselContent>
        <UI.CarouselItem>
          <UI.Card>
            <UI.CardContent className="p-8">Slide one</UI.CardContent>
          </UI.Card>
        </UI.CarouselItem>
        <UI.CarouselItem>
          <UI.Card>
            <UI.CardContent className="p-8">Slide two</UI.CardContent>
          </UI.Card>
        </UI.CarouselItem>
      </UI.CarouselContent>
    </UI.Carousel>
  )
}
