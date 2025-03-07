
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useFilms } from '@/context/FilmContext';
import FilmCard from '@/components/FilmCard';
import BottomNavigation from '@/components/BottomNavigation';

const FilmDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { getFilmById } = useFilms();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  
  useEffect(() => {
    if (id) {
      const film = getFilmById(id);
      if (!film) {
        setNotFound(true);
      }
    }
    setLoading(false);
  }, [id, getFilmById]);
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }
  
  if (notFound || !id) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold mb-4">Film Not Found</h1>
        <p className="mb-4">Sorry, the film you're looking for doesn't exist.</p>
        <button
          onClick={() => navigate('/library')}
          className="bg-black text-white px-4 py-2 rounded-lg"
        >
          Back to Library
        </button>
      </div>
    );
  }
  
  const film = getFilmById(id);
  
  if (!film) return null;
  
  return (
    <div className="pb-16 px-4 max-w-3xl mx-auto">
      <div className="flex items-center mb-6 mt-6">
        <button onClick={() => navigate(-1)} className="mr-4">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-3xl font-bold">Film Details</h1>
      </div>
      
      <div className="flex justify-center">
        <FilmCard film={film} />
      </div>
      
      <BottomNavigation />
    </div>
  );
};

export default FilmDetails;
