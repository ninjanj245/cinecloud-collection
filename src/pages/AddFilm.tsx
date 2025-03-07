import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useFilms } from '@/context/FilmContext';
import ImageUpload from '@/components/ImageUpload';
import BottomNavigation from '@/components/BottomNavigation';
import { toast } from '@/hooks/use-toast';

const AddFilm = () => {
  const [title, setTitle] = useState('');
  const [director, setDirector] = useState('');
  const [actors, setActors] = useState('');
  const [genre, setGenre] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [year, setYear] = useState('');
  const [tags, setTags] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<'single' | 'bulk'>('single');
  const [bulkData, setBulkData] = useState('');
  
  const { addFilm } = useFilms();
  const navigate = useNavigate();
  
  const handleImageUpload = (url: string) => {
    setImageUrl(url);
  };
  
  const handleSingleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
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
    
    addFilm({
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
      title: "Film added",
      description: `${title} has been added to your library`,
    });
    
    setTimeout(() => {
      setIsSubmitting(false);
      navigate('/');
    }, 3000);
  };
  
  const handleBulkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!bulkData.trim()) {
      toast({
        title: "No data",
        description: "Please enter some data to import",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Simple CSV parsing (could be improved)
      const rows = bulkData.trim().split('\n');
      const headers = rows[0].split(',');
      
      const titleIndex = headers.findIndex(h => h.toLowerCase().includes('title'));
      const directorIndex = headers.findIndex(h => h.toLowerCase().includes('director'));
      const idNumberIndex = headers.findIndex(h => h.toLowerCase().includes('id'));
      
      if (titleIndex === -1 || directorIndex === -1 || idNumberIndex === -1) {
        throw new Error("CSV must include title, director, and ID number columns");
      }
      
      setIsSubmitting(true);
      
      let addedCount = 0;
      
      // Start from index 1 to skip the header row
      for (let i = 1; i < rows.length; i++) {
        const values = rows[i].split(',');
        
        if (values.length < 3) continue;
        
        const filmTitle = values[titleIndex].trim();
        const filmDirector = values[directorIndex].trim();
        const filmIdNumber = values[idNumberIndex].trim();
        
        if (!filmTitle || !filmDirector || !filmIdNumber) continue;
        
        addFilm({
          title: filmTitle,
          director: filmDirector,
          idNumber: filmIdNumber,
          // Other fields could be extracted here if they exist in the CSV
        });
        
        addedCount++;
      }
      
      toast({
        title: "Bulk import successful",
        description: `Added ${addedCount} films to your library`,
      });
      
      setTimeout(() => {
        setIsSubmitting(false);
        navigate('/');
      }, 3000);
    } catch (error) {
      setIsSubmitting(false);
      toast({
        title: "Import failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    }
  };
  
  const downloadTemplate = () => {
    const template = "Title,Director,Actors,Genre,ID Number,Year,Tags\nFilm Title,Director Name,Actor1;Actor2,Genre,ID1,2023,tag1;tag2";
    const blob = new Blob([template], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'film_import_template.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="pb-16 px-4 max-w-3xl mx-auto">
      <div className="flex items-center mb-6 mt-6">
        <button onClick={() => navigate(-1)} className="mr-4">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-3xl font-bold">Add</h1>
      </div>
      
      <div className="mb-4 flex border-b">
        <button
          className={`px-4 py-2 ${activeTab === 'single' ? 'border-b-2 border-black font-semibold' : ''}`}
          onClick={() => setActiveTab('single')}
        >
          Add Single Film
        </button>
        <button
          className={`px-4 py-2 ${activeTab === 'bulk' ? 'border-b-2 border-black font-semibold' : ''}`}
          onClick={() => setActiveTab('bulk')}
        >
          Bulk Import
        </button>
      </div>
      
      {activeTab === 'single' ? (
        <div className="border border-coral rounded-lg p-6">
          <form onSubmit={handleSingleSubmit} className="space-y-4">
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
            
            <ImageUpload onImageUpload={handleImageUpload} />
            
            <div className="grid grid-cols-2 gap-4 mt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-green-500 text-white py-3 px-6 rounded-lg font-semibold"
              >
                {isSubmitting ? 'Adding...' : 'Add'}
              </button>
              
              <button
                type="button"
                onClick={() => navigate('/')}
                className="border border-coral text-coral py-3 px-6 rounded-lg font-semibold"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="border border-coral rounded-lg p-6">
          <div className="mb-4">
            <button 
              onClick={downloadTemplate}
              className="bg-black text-white px-4 py-2 rounded-lg text-sm"
            >
              Download Template
            </button>
            <p className="text-sm text-gray-500 mt-2">
              CSV format with columns: Title, Director, Actors, Genre, ID Number, Year, Tags
            </p>
          </div>
          
          <form onSubmit={handleBulkSubmit} className="space-y-4">
            <textarea
              value={bulkData}
              onChange={(e) => setBulkData(e.target.value)}
              placeholder="Paste your CSV data here..."
              className="w-full p-3 border border-gray-300 rounded-lg h-64"
              required
            />
            
            <div className="grid grid-cols-2 gap-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-green-500 text-white py-3 px-6 rounded-lg font-semibold"
              >
                {isSubmitting ? 'Importing...' : 'Import Films'}
              </button>
              
              <button
                type="button"
                onClick={() => navigate('/')}
                className="border border-coral text-coral py-3 px-6 rounded-lg font-semibold"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
      
      <BottomNavigation />
    </div>
  );
};

export default AddFilm;
