
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useFilms } from '@/context/FilmContext';
import ImageUpload from '@/components/ImageUpload';
import BottomNavigation from '@/components/BottomNavigation';
import { toast } from '@/hooks/use-toast';

const EditFilm = () => {
  const { id } = useParams<{ id: string }>();
  const { getFilmById, updateFilm } = useFilms();
  const navigate = useNavigate();
  
  const [title, setTitle] = useState('');
  const [director, setDirector] = useState('');
  const [actors, setActors] = useState('');
  const [genre, setGenre] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [year, setYear] = useState('');
  const [tags, setTags] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notFound, setNotFound] = useState(false);
  
  useEffect(() => {
    if (id) {
      const film = getFilmById(id);
      if (film) {
        setTitle(film.title);
        setDirector(film.director);
        setActors(film.actors || '');
        setGenre(film.genre || '');
        setIdNumber(film.idNumber);
        setYear(film.year || '');
        setTags(film.tags ? film.tags.join(', ') : '');
        setImageUrl(film.imageUrl || '');
      } else {
        setNotFound(true);
      }
    }
  }, [id, getFilmById]);
  
  const handleImageUpload = (url: string) => {
    setImageUrl(url);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!id) return;
    
    if (!title.trim() || !director.trim() || !idNumber.trim()) {
      toast({
        title: "Missing required fields",
        description: "Title, director, and ID number are required",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Process tags into an array
    const tagArray = tags
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag);
    
    const film = getFilmById(id);
    
    if (film) {
      updateFilm({
        ...film,
        title,
        director,
        actors,
        genre,
        idNumber,
        year,
        tags: tagArray,
        imageUrl,
      });
      
      toast({
        title: "Film updated",
        description: `${title} has been updated`,
      });
      
      setTimeout(() => {
        setIsSubmitting(false);
        navigate(-1);
      }, 1000);
    }
  };
  
  if (notFound) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold mb-4">Film Not Found</h1>
        <p className="mb-4">Sorry, the film you're trying to edit doesn't exist.</p>
        <button
          onClick={() => navigate('/library')}
          className="bg-black text-white px-4 py-2 rounded-lg"
        >
          Back to Library
        </button>
      </div>
    );
  }

  return (
    <div className="pb-16 px-4 max-w-3xl mx-auto">
      <div className="flex items-center mb-6 mt-6">
        <button onClick={() => navigate(-1)} className="mr-4">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-3xl font-bold">Edit Film</h1>
      </div>
      
      <div className="border border-coral rounded-lg p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Film Title"
            className="w-full p-3 border border-gray-300 rounded-lg"
            required
          />
          
          <input
            type="text"
            value={director}
            onChange={(e) => setDirector(e.target.value)}
            placeholder="Director"
            className="w-full p-3 border border-gray-300 rounded-lg"
            required
          />
          
          <input
            type="text"
            value={actors}
            onChange={(e) => setActors(e.target.value)}
            placeholder="Actor"
            className="w-full p-3 border border-gray-300 rounded-lg"
          />
          
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              placeholder="Genre"
              className="p-3 border border-gray-300 rounded-lg"
            />
            
            <input
              type="text"
              value={idNumber}
              onChange={(e) => setIdNumber(e.target.value)}
              placeholder="ID number"
              className="p-3 border border-gray-300 rounded-lg"
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="Tags (comma separated)"
              className="p-3 border border-gray-300 rounded-lg"
            />
            
            <input
              type="text"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              placeholder="Year"
              className="p-3 border border-gray-300 rounded-lg"
            />
          </div>
          
          <ImageUpload onImageUpload={handleImageUpload} defaultImage={imageUrl} />
          
          <div className="grid grid-cols-2 gap-4 mt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-green-500 text-white py-3 px-6 rounded-lg font-semibold"
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
            
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="border border-coral text-coral py-3 px-6 rounded-lg font-semibold"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
      
      <BottomNavigation />
    </div>
  );
};

export default EditFilm;
