import * as UI from "@bridge/ui"

export default function Example() {
  return (
    <UI.Carousel className="w-64">
      <UI.CarouselContent>
        <UI.CarouselItem>
          <UI.Card>
            <UI.CardContent>Slide one</UI.CardContent>
          </UI.Card>
        </UI.CarouselItem>
        <UI.CarouselItem>
          <UI.Card>
            <UI.CardContent>Slide two</UI.CardContent>
          </UI.Card>
        </UI.CarouselItem>
      </UI.CarouselContent>
    </UI.Carousel>
  )
}
