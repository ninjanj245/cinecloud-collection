
import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFilms } from '@/context/FilmContext';
import { useAuth } from '@/context/AuthContext';
import SearchBar from '@/components/SearchBar';
import FilmCard from '@/components/FilmCard';
import BottomNavigation from '@/components/BottomNavigation';

const Home = () => {
  const { films, recentSearches, getStorageUsedPercentage, getMostAddedGenre } = useFilms();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedFilm, setSelectedFilm] = useState<string | null>(null);

  // Get the 5 most recently added films
  const recentFilms = useMemo(() => {
    return [...films]
      .sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime())
      .slice(0, 5);
  }, [films]);

  // Calculate statistics
  const totalFilms = films.length;
  
  // Calculate days since last film was added
  const daysSinceLastUpload = useMemo(() => {
    if (films.length === 0) return 0;
    
    const latestFilmDate = new Date(Math.max(...films.map(film => 
      new Date(film.dateAdded).getTime()
    )));
    
    const diffTime = Math.abs(new Date().getTime() - latestFilmDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }, [films]);

  // Get storage used percentage
  const storagePercentage = getStorageUsedPercentage();
  
  // Get most added genre
  const { genre: mostAddedGenre, count: genreCount } = getMostAddedGenre();

  return (
    <div className="pb-16 px-4 max-w-3xl mx-auto">
      <h1 className="text-4xl font-bold mt-6 mb-8">Welcome, {user?.name || "User"}</h1>
      
      <div className="grid grid-cols-2 gap-4 mb-8">
        <button 
          onClick={() => navigate('/add')}
          className="bg-coral text-white font-bold py-4 px-6 rounded-lg text-xl"
        >
          Add film
        </button>
        <button 
          onClick={() => navigate('/library')}
          className="border-3 border-black text-black font-bold py-4 px-6 rounded-lg text-xl"
          style={{ borderWidth: '3px' }}
        >
          View Library
        </button>
      </div>
      
      <div className="mb-8">
        <SearchBar navigateOnSearch={true} />
      </div>
      
      {/* Recent searches */}
      {recentSearches.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Last 5 searches</h2>
          <div className="grid grid-cols-2 gap-4">
            {recentSearches.map((search, index) => (
              <div
                key={`search-${index}`}
                onClick={() => navigate(`/search?q=${encodeURIComponent(search)}`)}
                className="bg-light-pink p-4 rounded-lg cursor-pointer"
              >
                <p className="text-lg font-semibold">Search #{index + 1}</p>
                <p className="text-sm text-gray-600">{search}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Recently added films */}
      {recentFilms.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Last 5 added</h2>
          <div className="grid grid-cols-2 gap-4">
            {recentFilms.map((film) => (
              <div 
                key={film.id} 
                onClick={() => setSelectedFilm(film.id)}
                className="cursor-pointer"
              >
                <FilmCard film={film} small />
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Statistics */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Stats</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-light-gray p-4 rounded-lg">
            <p className="text-center text-gray-600">Films in storage</p>
            <p className="text-center text-5xl font-bold">{totalFilms}</p>
          </div>
          <div className="bg-light-gray p-4 rounded-lg">
            <p className="text-center text-gray-600">Days since last film added</p>
            <p className="text-center text-5xl font-bold">{daysSinceLastUpload}</p>
          </div>
          <div className="bg-light-gray p-4 rounded-lg">
            <p className="text-center text-gray-600">Most Added Genre</p>
            <p className="text-center text-3xl font-bold">{mostAddedGenre}</p>
            {genreCount > 0 && (
              <p className="text-center text-sm text-gray-600">({genreCount} films)</p>
            )}
          </div>
          <div className="bg-light-gray p-4 rounded-lg">
            <p className="text-center text-gray-600">Total Storage Used</p>
            <p className="text-center text-3xl font-bold">{storagePercentage}%</p>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
              <div 
                className="bg-coral h-2.5 rounded-full" 
                style={{ width: `${storagePercentage}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Film details modal */}
      {selectedFilm && films.find(film => film.id === selectedFilm) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="max-w-md w-full">
            <FilmCard 
              film={films.find(film => film.id === selectedFilm)!} 
              onClose={() => setSelectedFilm(null)} 
            />
          </div>
        </div>
      )}
      
      <BottomNavigation />
    </div>
  );
};

export default Home;
