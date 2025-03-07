
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Filter, SortDesc, ChevronDown, ChevronUp } from 'lucide-react';
import { useFilms, Film } from '@/context/FilmContext';
import SearchBar from '@/components/SearchBar';
import FilmCard from '@/components/FilmCard';
import BottomNavigation from '@/components/BottomNavigation';

type ViewMode = 'grid' | 'list';
type SortOption = 'title' | 'director' | 'year' | 'idNumber' | 'dateAdded';
type FilterCategory = 'director' | 'actor' | 'genre' | 'year';

interface FilterOptions {
  category: FilterCategory;
  value: string;
}

const Search = () => {
  const { searchFilms, addSearch, sortFilms } = useFilms();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Film[]>([]);
  const [selectedFilm, setSelectedFilm] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortBy, setSortBy] = useState<SortOption>('title');
  const [showFilters, setShowFilters] = useState(false);
  const [showSortOptions, setShowSortOptions] = useState(false);
  const [filterOptions, setFilterOptions] = useState<FilterOptions | null>(null);
  const [expandedFilmId, setExpandedFilmId] = useState<string | null>(null);
  
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
  
  // Extract unique values for filter dropdowns
  const directors = Array.from(new Set(searchResults.filter(film => film.director).map(film => film.director)));
  const actors = Array.from(new Set(searchResults.filter(film => film.actors).flatMap(film => film.actors?.split(';') || []).map(actor => actor.trim())));
  const genres = Array.from(new Set(searchResults.filter(film => film.genre).map(film => film.genre as string)));
  const years = Array.from(new Set(searchResults.filter(film => film.year).map(film => film.year as string)));
  
  // Apply filters and sorting
  const filteredResults = searchResults.filter(film => {
    if (!filterOptions) return true;
    
    switch (filterOptions.category) {
      case 'director':
        return film.director === filterOptions.value;
      case 'actor':
        return film.actors?.includes(filterOptions.value);
      case 'genre':
        return film.genre === filterOptions.value;
      case 'year':
        return film.year === filterOptions.value;
      default:
        return true;
    }
  });
  
  const sortedResults = sortFilms(filteredResults, sortBy);
  
  const toggleViewMode = () => {
    setViewMode(viewMode === 'grid' ? 'list' : 'grid');
  };
  
  const toggleSortOptions = () => {
    setShowSortOptions(!showSortOptions);
    if (showFilters) setShowFilters(false);
  };
  
  const toggleFilters = () => {
    setShowFilters(!showFilters);
    if (showSortOptions) setShowSortOptions(false);
  };
  
  const handleSetSort = (option: SortOption) => {
    setSortBy(option);
    setShowSortOptions(false);
  };
  
  const handleSetFilter = (category: FilterCategory, value: string) => {
    setFilterOptions({ category, value });
    setShowFilters(false);
  };
  
  const clearFilters = () => {
    setFilterOptions(null);
    setShowFilters(false);
  };
  
  const toggleExpandFilm = (filmId: string) => {
    if (expandedFilmId === filmId) {
      setExpandedFilmId(null);
    } else {
      setExpandedFilmId(filmId);
    }
  };
  
  const renderListView = () => (
    <div className="space-y-2 mt-4">
      {sortedResults.length === 0 ? (
        <p className="text-center py-8 text-gray-500">No films found</p>
      ) : (
        sortedResults.map((film) => (
          <div key={film.id} className="overflow-hidden">
            <div
              onClick={() => toggleExpandFilm(film.id)}
              className="bg-gray-300 p-4 rounded-lg flex justify-between items-center cursor-pointer"
            >
              <span className="font-semibold">{film.title}</span>
              <div className="flex items-center">
                <span className="mr-2">Nr #{film.idNumber}</span>
                {expandedFilmId === film.id ? 
                  <ChevronUp className="w-5 h-5" /> : 
                  <ChevronDown className="w-5 h-5" />
                }
              </div>
            </div>
            
            {/* Expanded details */}
            {expandedFilmId === film.id && (
              <div className="bg-gray-200 p-4 rounded-b-lg transition-all duration-300 ease-in-out transform origin-top">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Director:</p>
                    <p>{film.director}</p>
                  </div>
                  {film.actors && (
                    <div>
                      <p className="text-sm text-gray-600">Actors:</p>
                      <p>{film.actors}</p>
                    </div>
                  )}
                  {film.genre && (
                    <div>
                      <p className="text-sm text-gray-600">Genre:</p>
                      <p>{film.genre}</p>
                    </div>
                  )}
                  {film.year && (
                    <div>
                      <p className="text-sm text-gray-600">Year:</p>
                      <p>{film.year}</p>
                    </div>
                  )}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedFilm(film.id);
                  }}
                  className="bg-black text-white px-4 py-2 rounded-lg mt-4"
                >
                  View Details
                </button>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );

  const renderGridView = () => (
    <div className="grid grid-cols-2 gap-4 mt-4">
      {sortedResults.length === 0 ? (
        <p className="text-center py-8 text-gray-500 col-span-2">No films found</p>
      ) : (
        sortedResults.map((film) => (
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
        ))
      )}
    </div>
  );

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
          onClick={toggleFilters}
          className="flex items-center justify-center p-2 border border-gray-300 rounded-lg"
        >
          <Filter className="w-4 h-4 mr-2" />
          <span>Filters</span>
        </button>
        
        <button
          onClick={toggleSortOptions}
          className="flex items-center justify-center p-2 border border-gray-300 rounded-lg"
        >
          <SortDesc className="w-4 h-4 mr-2" />
          <span>Sort</span>
        </button>
        
        <button
          onClick={toggleViewMode}
          className="flex items-center justify-center p-2 border border-gray-300 rounded-lg"
        >
          <span>{viewMode === 'grid' ? 'List View' : 'Grid View'}</span>
        </button>
      </div>
      
      {/* Sort options dropdown */}
      {showSortOptions && (
        <div className="bg-white shadow-lg rounded-lg p-4 mt-2 border border-gray-200">
          <h3 className="font-semibold mb-2">Sort by</h3>
          <div className="space-y-2">
            <button
              onClick={() => handleSetSort('title')}
              className={`block w-full text-left px-2 py-1 rounded ${sortBy === 'title' ? 'bg-black text-white' : 'hover:bg-gray-100'}`}
            >
              Title
            </button>
            <button
              onClick={() => handleSetSort('director')}
              className={`block w-full text-left px-2 py-1 rounded ${sortBy === 'director' ? 'bg-black text-white' : 'hover:bg-gray-100'}`}
            >
              Director
            </button>
            <button
              onClick={() => handleSetSort('year')}
              className={`block w-full text-left px-2 py-1 rounded ${sortBy === 'year' ? 'bg-black text-white' : 'hover:bg-gray-100'}`}
            >
              Year
            </button>
            <button
              onClick={() => handleSetSort('idNumber')}
              className={`block w-full text-left px-2 py-1 rounded ${sortBy === 'idNumber' ? 'bg-black text-white' : 'hover:bg-gray-100'}`}
            >
              ID Number
            </button>
            <button
              onClick={() => handleSetSort('dateAdded')}
              className={`block w-full text-left px-2 py-1 rounded ${sortBy === 'dateAdded' ? 'bg-black text-white' : 'hover:bg-gray-100'}`}
            >
              Date Added
            </button>
          </div>
        </div>
      )}
      
      {/* Filter options dropdown */}
      {showFilters && (
        <div className="bg-white shadow-lg rounded-lg p-4 mt-2 border border-gray-200">
          <h3 className="font-semibold mb-2">Filter by category</h3>
          
          <div className="mb-4">
            <div className="flex items-center mb-1">
              <input 
                type="radio" 
                id="director-category" 
                name="filter-category" 
                checked={filterOptions?.category === 'director'}
                onChange={() => setFilterOptions(prev => ({ category: 'director', value: prev?.value || '' }))} 
                className="mr-2"
              />
              <label htmlFor="director-category" className="text-sm font-medium">Director</label>
            </div>
            <select
              disabled={filterOptions?.category !== 'director'}
              value={filterOptions?.category === 'director' ? filterOptions.value : ''}
              onChange={(e) => handleSetFilter('director', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="">Select a director</option>
              {directors.map((director) => (
                <option key={director} value={director}>
                  {director}
                </option>
              ))}
            </select>
          </div>
          
          <div className="mb-4">
            <div className="flex items-center mb-1">
              <input 
                type="radio" 
                id="actor-category" 
                name="filter-category" 
                checked={filterOptions?.category === 'actor'} 
                onChange={() => setFilterOptions(prev => ({ category: 'actor', value: prev?.value || '' }))}
                className="mr-2"
              />
              <label htmlFor="actor-category" className="text-sm font-medium">Actor</label>
            </div>
            <select
              disabled={filterOptions?.category !== 'actor'}
              value={filterOptions?.category === 'actor' ? filterOptions.value : ''}
              onChange={(e) => handleSetFilter('actor', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="">Select an actor</option>
              {actors.map((actor) => (
                <option key={actor} value={actor}>
                  {actor}
                </option>
              ))}
            </select>
          </div>
          
          <div className="mb-4">
            <div className="flex items-center mb-1">
              <input 
                type="radio" 
                id="genre-category" 
                name="filter-category" 
                checked={filterOptions?.category === 'genre'} 
                onChange={() => setFilterOptions(prev => ({ category: 'genre', value: prev?.value || '' }))}
                className="mr-2"
              />
              <label htmlFor="genre-category" className="text-sm font-medium">Genre</label>
            </div>
            <select
              disabled={filterOptions?.category !== 'genre'}
              value={filterOptions?.category === 'genre' ? filterOptions.value : ''}
              onChange={(e) => handleSetFilter('genre', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="">Select a genre</option>
              {genres.map((genre) => (
                <option key={genre} value={genre}>
                  {genre}
                </option>
              ))}
            </select>
          </div>
          
          <div className="mb-4">
            <div className="flex items-center mb-1">
              <input 
                type="radio" 
                id="year-category" 
                name="filter-category" 
                checked={filterOptions?.category === 'year'} 
                onChange={() => setFilterOptions(prev => ({ category: 'year', value: prev?.value || '' }))}
                className="mr-2"
              />
              <label htmlFor="year-category" className="text-sm font-medium">Year</label>
            </div>
            <select
              disabled={filterOptions?.category !== 'year'}
              value={filterOptions?.category === 'year' ? filterOptions.value : ''}
              onChange={(e) => handleSetFilter('year', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="">Select a year</option>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
          
          <button
            onClick={clearFilters}
            className="w-full bg-black text-white p-2 rounded mt-2"
          >
            Clear Filters
          </button>
        </div>
      )}
      
      {query && (
        <div className="mt-6">
          <h2 className="text-2xl font-bold mb-4">Results</h2>
          
          {viewMode === 'list' ? renderListView() : renderGridView()}
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
