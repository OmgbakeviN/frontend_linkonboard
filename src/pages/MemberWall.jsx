import { useEffect, useState } from "react";
import api from "../api";
import Linkified from "../components/Linkified";
import {
  UserIcon,
  PhotoIcon,
  GlobeAltIcon,
  CalendarIcon,
  ArrowPathIcon,
  ChatBubbleLeftRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from "@heroicons/react/24/outline";

export default function MemberWall() {
  const [items, setItems] = useState([]);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [currentImageIndexes, setCurrentImageIndexes] = useState({});

  async function load() {
    try {
      const res = await api.get("/posts/mine/");
      setItems(res.data || []);
      setErr("");
      
      // Initialize image indexes for each post
      const indexes = {};
      res.data.forEach(post => {
        if (post.images_out?.length) {
          indexes[post.id] = 0;
        }
      });
      setCurrentImageIndexes(indexes);
    } catch (e) {
      setErr("Impossible de charger vos messages.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await load();
  };

  const nextImage = (postId) => {
    setCurrentImageIndexes(prev => ({
      ...prev,
      [postId]: (prev[postId] + 1) % items.find(p => p.id === postId).images_out.length
    }));
  };

  const prevImage = (postId) => {
    setCurrentImageIndexes(prev => ({
      ...prev,
      [postId]: (prev[postId] - 1 + items.find(p => p.id === postId).images_out.length) % 
                items.find(p => p.id === postId).images_out.length
    }));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-gray-50 flex items-center justify-center">
        <div className="text-center">
          <svg className="animate-spin h-12 w-12 text-indigo-600 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-gray-600">Chargement de votre mur...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-gray-50 pb-8">
      {/* Header */}
      <div className="bg-white shadow-sm py-4 px-6 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <ChatBubbleLeftRightIcon className="w-8 h-8 text-indigo-600 mr-3" />
            <div>
              <h1 className="text-xl font-bold text-indigo-900">Mon Mur</h1>
              <p className="text-sm text-gray-600">Vos messages et annonces</p>
            </div>
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center px-3 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors disabled:opacity-50"
          >
            <ArrowPathIcon className={`w-4 h-4 mr-1 ${refreshing ? 'animate-spin' : ''}`} />
            Actualiser
          </button>
        </div>
      </div>

      <div className="p-4 max-w-2xl mx-auto">
        {/* Error Message */}
        {err && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl border border-red-200 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{err}</span>
          </div>
        )}

        {/* Empty State */}
        {!loading && items.length === 0 && !err && (
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
            <ChatBubbleLeftRightIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Aucun message</h3>
            <p className="text-gray-500">Aucun message n'a été partagé avec vous pour le moment.</p>
          </div>
        )}

        {/* Posts Grid */}
        {items.length > 0 && (
          <div className="space-y-6">
            {items.map((p) => (
              <div key={p.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md">
                {/* Post Header */}
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mr-3">
                        <UserIcon className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{p.author_name}</h3>
                        <div className="flex items-center text-sm text-gray-500">
                          <CalendarIcon className="w-4 h-4 mr-1" />
                          {formatDate(p.created_at)}
                        </div>
                      </div>
                    </div>
                    
                    {p.is_broadcast && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        <GlobeAltIcon className="w-3 h-3 mr-1" />
                        Annonce générale
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  {p.title && (
                    <h4 className="text-lg font-medium text-gray-800 mb-3">
                      {p.title}
                    </h4>
                  )}
                </div>

                {/* Images Carousel */}
                {p.images_out?.length > 0 && (
                  <div className="relative bg-black">
                    <div className="relative h-64 sm:h-80 w-full overflow-hidden">
                      <img
                        src={p.images_out[currentImageIndexes[p.id]]?.image}
                        alt={`Image ${currentImageIndexes[p.id] + 1} de ${p.images_out.length}`}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    
                    {/* Navigation Arrows */}
                    {p.images_out.length > 1 && (
                      <>
                        <button
                          onClick={() => prevImage(p.id)}
                          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
                        >
                          <ChevronLeftIcon className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => nextImage(p.id)}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
                        >
                          <ChevronRightIcon className="w-5 h-5" />
                        </button>
                      </>
                    )}
                    
                    {/* Image Counter */}
                    {p.images_out.length > 1 && (
                      <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded-full text-sm">
                        {currentImageIndexes[p.id] + 1} / {p.images_out.length}
                      </div>
                    )}
                  </div>
                )}

                {/* Content */}
                <div className="p-6">
                  <div className="prose prose-sm max-w-none text-gray-600">
                    <Linkified text={p.body} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}