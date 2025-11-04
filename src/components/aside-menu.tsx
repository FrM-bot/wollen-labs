'use client'
import { TrendingUp, Music, Users } from 'lucide-react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import TopTracksTab from './top-tracks-tab'
import TopArtistsTab from './top-artists-tab'

export default function AsideMenu() {

  return (
    <aside className='w-full overflow-hidden flex flex-col h-full'>
      <div className='p-4 md:p-6 pb-4'>
        <div className='flex items-center gap-2 mb-2'>
          <TrendingUp className='w-5 h-5 text-emerald-400' />
          <h2 className='text-lg font-bold'>Top Charts</h2>
        </div>
        <p className='text-xs text-zinc-500'>Most played worldwide</p>
      </div>
      
      <Tabs defaultValue="tracks" className='flex-1 flex flex-col overflow-hidden'>
        <div>
          <TabsList className='w-full'>
            <TabsTrigger value="tracks" className='flex-1'>
              <Music className='w-4 h-4' />
              Tracks
            </TabsTrigger>
            <TabsTrigger value="artists" className='flex-1'>
              <Users className='w-4 h-4' />
              Artists
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="tracks" className='flex-1 overflow-hidden flex flex-col m-0'>
          <TopTracksTab />
        </TabsContent>
        
        <TabsContent value="artists" className='flex-1 overflow-hidden flex flex-col m-0'>
          <TopArtistsTab />
        </TabsContent>
      </Tabs>
    </aside>
  )
}
