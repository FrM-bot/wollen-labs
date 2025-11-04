"use client"
import React, { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import useSearchArtists from '@/app/hooks/use-search-artists'
import { Routes } from '@/lib/routes'
import { Search, X } from 'lucide-react'
import { Spinner } from '@/components/ui/spinner'

export default function ArtistSearch() {
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const { data, loading } = useSearchArtists(debouncedQuery, 10)

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery)
    }, 300)

    return () => clearTimeout(timer)
  }, [searchQuery])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    setIsOpen(true)
  }

  const handleArtistSelect = (artistId: string) => {
    setSearchQuery('')
    setIsOpen(false)
    router.push(Routes.client.artists.details(artistId))
  }

  const handleClear = () => {
    setSearchQuery('')
    setIsOpen(false)
  }

  const showResults = isOpen && debouncedQuery && debouncedQuery.trim() !== ''

  return (
    <div ref={searchRef} className="relative flex-1 max-w-md mx-4">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search className="w-4 h-4 text-gray-400" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          placeholder="Buscar artistas..."
          className="w-full pl-10 pr-20 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white"
        />
        {searchQuery && (
          <button
            onClick={handleClear}
            className="absolute inset-y-0 right-8 flex items-center pr-2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
        {loading && (
          <div className="absolute inset-y-0 right-2 flex items-center">
            <Spinner className="w-4 h-4" />
          </div>
        )}
      </div>

      {/* Dropdown Results */}
      {showResults && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-neutral-200 rounded-lg shadow-lg max-h-96 overflow-y-auto">
          {loading && data.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              <Spinner className="w-5 h-5 mx-auto" />
            </div>
          ) : data.length > 0 ? (
            <div className="py-1">
              {data.map((artist) => {
                const imageUrl = artist.images[0]?.url || artist.images[1]?.url
                return (
                  <button
                    key={artist.id}
                    onClick={() => handleArtistSelect(artist.id)}
                    className="w-full flex items-center gap-3 px-4 py-2 hover:bg-neutral-50 transition-colors text-left"
                  >
                    {imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={imageUrl}
                        alt={artist.name}
                        className="w-10 h-10 rounded object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded bg-neutral-200 flex items-center justify-center">
                        <Search className="w-5 h-5 text-neutral-400" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {artist.name}
                      </p>
                      {artist.genres.length > 0 && (
                        <p className="text-xs text-gray-500 truncate">
                          {artist.genres.slice(0, 2).join(', ')}
                        </p>
                      )}
                    </div>
                  </button>
                )
              })}
            </div>
          ) : (
            <div className="p-4 text-center text-gray-500 text-sm">
              No se encontraron artistas
            </div>
          )}
        </div>
      )}
    </div>
  )
}

