
import { useState } from 'react';
import { Search } from 'lucide-react';
import { useFilms } from '@/context/FilmContext';
import { useNavigate } from 'react-router-dom';

type SearchBarProps = {
  onSearch?: (query: string) => void;
  navigateOnSearch?: boolean;
};

const SearchBar = ({ onSearch, navigateOnSearch = false }: SearchBarProps) => {
  const [query, setQuery] = useState('');
  const { addSearch } = useFilms();
  const navigate = useNavigate();

  const handleSearch = () => {
    if (!query.trim()) return;
    
    if (onSearch) {
      onSearch(query);
    }
    
    addSearch(query);
    
    if (navigateOnSearch) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="relative w-full">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyPress}
        placeholder="Search"
        className="w-full p-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
      />
      <button
        onClick={handleSearch}
        className="absolute right-1 top-1 bg-black text-white p-2 rounded-lg"
      >
        <Search className="w-6 h-6" />
      </button>
    </div>
  );
};

export default SearchBar;
