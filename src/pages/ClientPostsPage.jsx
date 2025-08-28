import { useEffect, useState } from "react";
import api from "../api";
import {
  ArrowPathIcon,
  TrashIcon,
  DocumentTextIcon,
  UserGroupIcon,
  GlobeAltIcon,
  CalendarIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  MapPinIcon
} from "@heroicons/react/24/outline";

export default function ClientPostsPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [expandedPost, setExpandedPost] = useState(null);

  async function load() {
    setLoading(true);
    setErr("");
    try {
      const res = await api.get("/posts/client/");
      const data = Array.isArray(res.data) ? res.data : res.data.results;
      setRows(data || []);
    } catch (e) {
      setErr("Impossible de charger vos posts.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function togglePin(id) {
    try {
      await api.post(`/posts/${id}/pin/`);
      await load();
    } catch (e) {
      setErr("Impossible de modifier l'état d'épinglage.");
    }
  }

  async function remove(id) {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce post ? Cette action est irréversible.")) return;
    
    try {
      await api.delete(`/posts/${id}/`);
      await load();
    } catch (e) {
      setErr("Impossible de supprimer le post.");
    }
  }

  const toggleExpand = (id) => {
    setExpandedPost(expandedPost === id ? null : id);
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-indigo-900 mb-2">Mes Publications</h1>
          <p className="text-gray-600">Gérez et consultez l'ensemble de vos posts</p>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6 p-4 bg-white rounded-xl shadow-sm">
          <div className="text-sm text-gray-500">
            {rows.length} post{rows.length !== 1 ? 's' : ''} au total
          </div>
          <button
            onClick={load}
            disabled={loading}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowPathIcon className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Rafraîchir
          </button>
        </div>

        {/* Error Message */}
        {err && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl border border-red-200 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{err}</span>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="text-center">
              <svg className="animate-spin h-12 w-12 text-indigo-600 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="text-gray-600">Chargement de vos posts...</p>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && rows.length === 0 && !err && (
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
            <DocumentTextIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Aucun post pour le moment</h3>
            <p className="text-gray-500 mb-4">Vous n'avez pas encore créé de publication.</p>
          </div>
        )}

        {/* Posts Grid */}
        {!loading && rows.length > 0 && (
          <div className="grid gap-4">
            {rows.map((post) => (
              <div key={post.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md">
                {/* Post Header */}
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        {post.is_pinned && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                            <MapPinIcon className="w-3 h-3 mr-1" />
                            Épinglé
                          </span>
                        )}
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          post.is_broadcast 
                            ? 'bg-purple-100 text-purple-800' 
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {post.is_broadcast ? (
                            <>
                              <GlobeAltIcon className="w-3 h-3 mr-1" />
                              Broadcast
                            </>
                          ) : (
                            <>
                              <UserGroupIcon className="w-3 h-3 mr-1" />
                              {post.recipients_count || 0} destinataire(s)
                            </>
                          )}
                        </span>
                      </div>

                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {post.title || "Sans titre"}
                      </h3>

                      <p className="text-gray-600 line-clamp-2 mb-4">
                        {post.body}
                      </p>

                      <div className="flex items-center text-sm text-gray-500">
                        <CalendarIcon className="w-4 h-4 mr-1" />
                        {formatDate(post.created_at)}
                      </div>
                    </div>

                    <button
                      onClick={() => toggleExpand(post.id)}
                      className="ml-4 p-2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {expandedPost === post.id ? (
                        <ChevronUpIcon className="w-5 h-5" />
                      ) : (
                        <ChevronDownIcon className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Expanded Content */}
                {expandedPost === post.id && (
                  <div className="p-6 bg-gray-50">
                    {/* Full Content */}
                    <div className="mb-6">
                      <h4 className="font-medium text-gray-700 mb-3">Contenu complet</h4>
                      <div className="prose prose-sm max-w-none text-gray-600 bg-white p-4 rounded-lg border">
                        {post.body}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
                      <button
                        onClick={() => togglePin(post.id)}
                        className={`flex-1 flex items-center justify-center px-4 py-2 rounded-lg transition-colors ${
                          post.is_pinned
                            ? 'bg-amber-500 text-white hover:bg-amber-600'
                            : 'bg-indigo-500 text-white hover:bg-indigo-600'
                        }`}
                      >
                        <MapPinIcon className="w-4 h-4 mr-2" />
                        {post.is_pinned ? 'Désépingler' : 'Épingler'}
                      </button>
                      
                      <button
                        onClick={() => remove(post.id)}
                        className="flex-1 flex items-center justify-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                      >
                        <TrashIcon className="w-4 h-4 mr-2" />
                        Supprimer
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}