
import { useState } from 'react';
import { X, Trash2 } from 'lucide-react';
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
      <div className={film.genre === 'horror' ? "bg-light-green bg-opacity-20 rounded-lg overflow-hidden" : "bg-light-pink rounded-lg overflow-hidden"}>
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
    <div className="bg-light-green bg-opacity-20 rounded-3xl overflow-hidden max-w-md w-full">
      {onClose && (
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 bg-black bg-opacity-0 text-black p-1 rounded-full z-10"
        >
          <X className="w-6 h-6" />
        </button>
      )}
      
      {film.imageUrl && (
        <div className="relative w-full h-80 rounded-t-3xl overflow-hidden">
          <img src={film.imageUrl} alt={film.title} className="w-full h-full object-cover" />
        </div>
      )}
      
      <div className="p-6">
        <div className="flex justify-between items-start mb-6">
          <h3 className="text-2xl font-bold">{film.title}</h3>
          <p className="text-xl">ID nr {film.idNumber}</p>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div>
            <p className="italic">{film.director}</p>
          </div>
          <div className="text-right">
            <p>{film.genre}</p>
          </div>
          <div>
            <p>{film.year}</p>
          </div>
        </div>
        
        {film.actors && (
          <div className="mb-8">
            <p className="italic">{film.actors}</p>
          </div>
        )}
        
        {film.tags && film.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-8">
            {film.tags.map((tag) => (
              <span
                key={tag}
                className="bg-black text-white text-xs px-2 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        
        <div className="grid grid-cols-2 gap-4 mt-8">
          <button
            onClick={handleEdit}
            className="bg-black text-white px-6 py-3 rounded-xl font-medium text-lg"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="text-black px-6 py-3 rounded-xl font-medium text-lg"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilmCard;
