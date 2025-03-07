import React, { createContext, useContext, useState, useEffect } from 'react';

export type Film = {
  id: string;
  title: string;
  director: string;
  actors?: string;
  year?: string;
  genre?: string;
  tags?: string[];
  idNumber: string;
  imageUrl?: string;
  dateAdded: Date;
};

type FilmContextType = {
  films: Film[];
  addFilm: (film: Omit<Film, 'id' | 'dateAdded'>) => void;
  deleteFilm: (id: string) => void;
  updateFilm: (film: Film) => void;
  recentSearches: string[];
  addSearch: (search: string) => void;
  getFilmById: (id: string) => Film | undefined;
  searchFilms: (query: string) => Film[];
  sortFilms: (films: Film[], sortBy: string) => Film[];
  filterFilms: (films: Film[], filters: Record<string, any>) => Film[];
  getStorageUsedPercentage: () => number;
  getMostAddedGenre: () => { genre: string; count: number };
};

const FilmContext = createContext<FilmContextType | undefined>(undefined);

export const FilmProvider = ({ children }: { children: React.ReactNode }) => {
  const [films, setFilms] = useState<Film[]>(() => {
    const savedFilms = localStorage.getItem('films');
    return savedFilms ? JSON.parse(savedFilms) : [];
  });
  
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    const savedSearches = localStorage.getItem('recentSearches');
    return savedSearches ? JSON.parse(savedSearches) : [];
  });

  useEffect(() => {
    localStorage.setItem('films', JSON.stringify(films));
  }, [films]);

  useEffect(() => {
    localStorage.setItem('recentSearches', JSON.stringify(recentSearches));
  }, [recentSearches]);

  const addFilm = (film: Omit<Film, 'id' | 'dateAdded'>) => {
    const newFilm: Film = {
      ...film,
      id: crypto.randomUUID(),
      dateAdded: new Date(),
    };
    setFilms((prevFilms) => [newFilm, ...prevFilms]);
  };

  const deleteFilm = (id: string) => {
    setFilms((prevFilms) => prevFilms.filter((film) => film.id !== id));
  };

  const updateFilm = (updatedFilm: Film) => {
    setFilms((prevFilms) =>
      prevFilms.map((film) => (film.id === updatedFilm.id ? updatedFilm : film))
    );
  };

  const addSearch = (search: string) => {
    if (!search.trim()) return;
    
    setRecentSearches((prev) => {
      // Remove the search if it already exists
      const filtered = prev.filter((s) => s !== search);
      // Add to the beginning and keep only the last 5
      return [search, ...filtered].slice(0, 5);
    });
  };

  const getFilmById = (id: string) => {
    return films.find((film) => film.id === id);
  };

  const searchFilms = (query: string) => {
    if (!query.trim()) return films;
    
    const lowerCaseQuery = query.toLowerCase();
    return films.filter(
      (film) =>
        film.title.toLowerCase().includes(lowerCaseQuery) ||
        film.director.toLowerCase().includes(lowerCaseQuery) ||
        film.actors?.toLowerCase().includes(lowerCaseQuery) ||
        film.idNumber.toLowerCase().includes(lowerCaseQuery)
    );
  };

  const sortFilms = (filmsToSort: Film[], sortBy: string) => {
    switch (sortBy) {
      case 'title':
        return [...filmsToSort].sort((a, b) => a.title.localeCompare(b.title));
      case 'director':
        return [...filmsToSort].sort((a, b) => a.director.localeCompare(b.director));
      case 'year':
        return [...filmsToSort].sort((a, b) => (a.year || '').localeCompare(b.year || ''));
      case 'idNumber':
        return [...filmsToSort].sort((a, b) => a.idNumber.localeCompare(b.idNumber));
      case 'dateAdded':
        return [...filmsToSort].sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime());
      default:
        return filmsToSort;
    }
  };

  const filterFilms = (filmsToFilter: Film[], filters: Record<string, any>) => {
    return filmsToFilter.filter((film) => {
      for (const [key, value] of Object.entries(filters)) {
        if (!value) continue;
        
        if (key === 'genre' && film.genre !== value) {
          return false;
        }
        
        if (key === 'year' && film.year !== value) {
          return false;
        }
        
        if (key === 'tags' && Array.isArray(value) && value.length > 0) {
          if (!film.tags || !value.some(tag => film.tags?.includes(tag))) {
            return false;
          }
        }
      }
      return true;
    });
  };

  const getStorageUsedPercentage = () => {
    const totalStorageCapacity = 10000; // in MB
    const usedStorage = films.length * 2; // Each film is estimated at 2MB
    return Math.min(Math.round((usedStorage / totalStorageCapacity) * 100), 100);
  };

  const getMostAddedGenre = () => {
    const genreCounts: Record<string, number> = {};
    
    films.forEach(film => {
      if (film.genre) {
        genreCounts[film.genre] = (genreCounts[film.genre] || 0) + 1;
      }
    });
    
    let mostAddedGenre = "none";
    let maxCount = 0;
    
    for (const [genre, count] of Object.entries(genreCounts)) {
      if (count > maxCount) {
        mostAddedGenre = genre;
        maxCount = count;
      }
    }
    
    return { genre: mostAddedGenre, count: maxCount };
  };

  return (
    <FilmContext.Provider
      value={{
        films,
        addFilm,
        deleteFilm,
        updateFilm,
        recentSearches,
        addSearch,
        getFilmById,
        searchFilms,
        sortFilms,
        filterFilms,
        getStorageUsedPercentage,
        getMostAddedGenre
      }}
    >
      {children}
    </FilmContext.Provider>
  );
};

export const useFilms = () => {
  const context = useContext(FilmContext);
  if (context === undefined) {
    throw new Error('useFilms must be used within a FilmProvider');
  }
  return context;
};
