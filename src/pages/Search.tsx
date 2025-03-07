
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useFilms, Film } from '@/context/FilmContext';
import SearchBar from '@/components/SearchBar';
import FilmCard from '@/components/FilmCard';
import BottomNavigation from '@/components/BottomNavigation';

const Search = () => {
  const { searchFilms, addSearch } = useFilms();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Film[]>([]);
  const [selectedFilm, setSelectedFilm] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Get search query from URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchQuery = params.get('q');
    
    if (searchQuery) {
      setQuery(searchQuery);
      handleSearch(searchQuery);
    }
  }, [location.search]);
  
  const handleSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    
    const results = searchFilms(searchQuery);
    setSearchResults(results);
    addSearch(searchQuery);
  };
  
  const toggleViewMode = () => {
    setViewMode(viewMode === 'grid' ? 'list' : 'grid');
  };

  return (
    <div className="pb-16 px-4 max-w-3xl mx-auto">
      <div className="flex items-center mb-6 mt-6">
        <button onClick={() => navigate(-1)} className="mr-4">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-3xl font-bold">Search</h1>
      </div>
      
      <SearchBar onSearch={handleSearch} />
      
      <div className="grid grid-cols-3 gap-4 mt-4">
        <button
          onClick={() => {}}
          className="flex items-center justify-center p-2 border border-gray-300 rounded-lg"
        >
          <span>Advanced Filter</span>
        </button>
        
        <button
          onClick={() => {}}
          className="flex items-center justify-center p-2 border border-gray-300 rounded-lg"
        >
          <span>Sort</span>
        </button>
        
        <button
          onClick={toggleViewMode}
          className="flex items-center justify-center p-2 border border-gray-300 rounded-lg"
        >
          <span>{viewMode === 'grid' ? 'List View' : 'Grid View'}</span>
        </button>
      </div>
      
      {query && (
        <div className="mt-6">
          <h2 className="text-2xl font-bold mb-4">Results</h2>
          
          {searchResults.length === 0 ? (
            <p className="text-center py-8 text-gray-500">No films found</p>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-2 gap-4">
              {searchResults.map((film) => (
                <div
                  key={film.id}
                  onClick={() => setSelectedFilm(film.id)}
                  className="cursor-pointer"
                >
                  <div className={film.genre === "horror" ? "bg-light-green rounded-lg overflow-hidden" : "bg-light-pink rounded-lg overflow-hidden"}>
                    {film.imageUrl ? (
                      <div className="relative pb-[100%]">
                        <img
                          src={film.imageUrl}
                          alt={film.title}
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="h-32 bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-500">No image</span>
                      </div>
                    )}
                    <div className="p-2">
                      <p className="font-bold truncate">{film.title}</p>
                      <p className="text-sm">ID nr {film.idNumber}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {searchResults.map((film) => (
                <div
                  key={film.id}
                  onClick={() => setSelectedFilm(film.id)}
                  className="bg-gray-300 p-4 rounded-lg flex justify-between items-center cursor-pointer"
                >
                  <span className="font-semibold">{film.title}</span>
                  <span>Nr #{film.idNumber}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      
      {/* Film details modal */}
      {selectedFilm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="max-w-md w-full">
            <FilmCard 
              film={searchResults.find(film => film.id === selectedFilm)!} 
              onClose={() => setSelectedFilm(null)} 
            />
          </div>
        </div>
      )}
      
      <BottomNavigation />
    </div>
  );
};

export default Search;
