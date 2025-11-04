import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Link from 'next/link'
import { Routes } from '@/lib/routes'
import { AlbumDTO as Album } from '@/types/dto/album'

export default function CarouselSize({ albums }: { albums: Album[] }) {
  return (
    <Carousel
      opts={{
        align: "start",
      }}
      className="w-full"
    >
        <div className="flex gap-10 justify-end pb-2"> 
          <CarouselPrevious  className='relative left-4 top-4'/>
          <CarouselNext className='relative right-4 top-4' />
        </div>
      <CarouselContent className=''>
        {albums?.map((album, index) => (
          <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/6">
              <Card className='border-transparent py-4 shadow-none h-full hover:border-neutral-100 bg-neutral-50 hover:bg-white duration-300'>
                <CardContent className="flex flex-col px-4 gap-2">
                <Link href={Routes.client.albums.details(album.id)}>
                     {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img className='aspect-square rounded-sm' src={album.images[1].url} alt={album.name} />
                </Link>
                  <Link href={Routes.client.albums.details(album.id)} className="font-semibold text-sm">{album.name}</Link>
                </CardContent>
              </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  )
}
