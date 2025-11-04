"use client"
import React, { useState, useCallback } from 'react'
import useSearchArtists from '@/app/hooks/use-search-artists'
import SearchArtistItem from '@/components/search-artist-item'
import { Spinner } from '@/components/ui/spinner'
import { Search } from 'lucide-react'
import { Typography } from '@/components/typography'

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const { data, error, loading } = useSearchArtists(debouncedQuery, 20)

  // Debounce search query
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery)
    }, 500) // 500ms debounce

    return () => clearTimeout(timer)
  }, [searchQuery])

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }, [])

  return (
    <div className="w-full p-4 md:p-6">
      <div className="mb-6">
        <Typography size="heading" className="mb-2">
          Buscar Artistas
        </Typography>
        <p className="text-sm text-gray-500 mb-4">
          Encuentra tus artistas favoritos en Spotify
        </p>
        
        {/* Search Input */}
        <div className="relative max-w-md">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="w-5 h-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Buscar artistas..."
            className="w-full pl-10 pr-4 py-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white"
          />
        </div>
      </div>

      {/* Loading State */}
      {loading && debouncedQuery && (
        <div className="flex items-center justify-center py-12">
          <Spinner className="w-8 h-8" />
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="p-4 text-center text-red-500 bg-red-50 rounded-lg">
          <p>Error al buscar artistas: {error.message}</p>
        </div>
      )}

      {/* Results */}
      {!loading && debouncedQuery && data.length > 0 && (
        <div className="space-y-2">
          <Typography size="subtitle" className="mb-4">
            Resultados ({data.length})
          </Typography>
          <div className="space-y-2">
            {data.map((artist) => (
              <SearchArtistItem key={artist.id} artist={artist} />
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && debouncedQuery && data.length === 0 && !error && (
        <div className="text-center py-12 text-gray-500">
          <p>No se encontraron artistas para &quot;{debouncedQuery}&quot;</p>
        </div>
      )}

      {/* Initial State */}
      {!debouncedQuery && (
        <div className="text-center py-12 text-gray-400">
          <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Ingresa el nombre de un artista para comenzar la búsqueda</p>
        </div>
      )}
    </div>
  )
}
