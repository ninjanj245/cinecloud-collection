
import { useState } from 'react';
import { X, Edit2, Trash2 } from 'lucide-react';
import { Film, useFilms } from '@/context/FilmContext';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

type FilmCardProps = {
  film: Film;
  onClose?: () => void;
  small?: boolean;
};

const FilmCard = ({ film, onClose, small = false }: FilmCardProps) => {
  const { deleteFilm } = useFilms();
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = () => {
    setIsDeleting(true);
    deleteFilm(film.id);
    toast({
      title: "Film deleted",
      description: `${film.title} has been removed from your library`,
    });
    if (onClose) {
      onClose();
    }
  };

  const handleEdit = () => {
    navigate(`/edit/${film.id}`);
  };

  if (small) {
    return (
      <div className={film.genre === 'horror' ? "bg-light-green rounded-lg overflow-hidden" : "bg-light-pink rounded-lg overflow-hidden"}>
        {film.imageUrl && (
          <div className="relative w-full h-48">
            <img src={film.imageUrl} alt={film.title} className="w-full h-full object-cover" />
          </div>
        )}
        <div className="p-3">
          <p className="font-bold text-lg">{film.title}</p>
          <p className="text-sm">ID nr {film.idNumber}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-lime-green-20 rounded-lg overflow-hidden max-w-md w-full">
      <div className="relative">
        {film.imageUrl && (
          <div className="relative w-full h-64">
            <img src={film.imageUrl} alt={film.title} className="w-full h-full object-cover" />
          </div>
        )}
        {onClose && (
          <button 
            onClick={onClose} 
            className="absolute top-2 right-2 bg-black bg-opacity-50 text-white p-1 rounded-full"
          >
            <X className="w-6 h-6" />
          </button>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="text-xl font-bold mb-2">{film.title}</h3>
        <div className="mb-4">
          <p><span className="font-bold">Director:</span> {film.director}</p>
          <p><span className="font-bold">ID Number:</span> {film.idNumber}</p>
          {film.actors && <p><span className="font-bold">Actors:</span> {film.actors}</p>}
          {film.year && <p><span className="font-bold">Year:</span> {film.year}</p>}
          {film.genre && <p><span className="font-bold">Genre:</span> {film.genre}</p>}
          {film.tags && film.tags.length > 0 && (
            <div className="mt-2">
              <span className="font-bold">Tags:</span>{' '}
              <div className="flex flex-wrap gap-1 mt-1">
                {film.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-black text-white text-xs px-2 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={handleEdit}
            className="flex items-center justify-center bg-black text-white px-4 py-2 rounded-lg flex-1"
          >
            <Edit2 className="w-4 h-4 mr-2" />
            Edit
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex items-center justify-center bg-red-500 text-white px-4 py-2 rounded-lg flex-1"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilmCard;
