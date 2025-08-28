import { useEffect, useState } from "react";
import api from "../api";
import {
  ArrowLeftIcon,
  PhotoIcon,
  DocumentTextIcon,
  UserGroupIcon,
  GlobeAltIcon,
  PaperAirplaneIcon,
  CheckCircleIcon,
  XCircleIcon
} from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";

export default function ClientPostForm() {
  const [members, setMembers] = useState([]);
  const [checked, setChecked] = useState([]);
  const [form, setForm] = useState({ title: "", body: "", is_broadcast: false });
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [previews, setPreviews] = useState([]);

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get("/members/");
        setMembers(res.data || []);
      } catch (e) {
        setErr("Impossible de récupérer la liste des membres.");
      }
    }
    load();
  }, []);

  useEffect(() => {
    // Create previews for selected images
    const newPreviews = [];
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        newPreviews.push(e.target.result);
        if (newPreviews.length === files.length) {
          setPreviews([...newPreviews]);
        }
      };
      reader.readAsDataURL(file);
    });
    
    if (files.length === 0) setPreviews([]);
  }, [files]);

  function toggle(id) {
    setChecked(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  }

  function removeImage(index) {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
  }

  async function onSubmit(e) {
    e.preventDefault();
    setMsg(""); 
    setErr("");
    setLoading(true);
    
    try {
      const fd = new FormData();
      fd.append("title", form.title);
      fd.append("body", form.body);
      fd.append("is_broadcast", String(form.is_broadcast));
      if (!form.is_broadcast) checked.forEach(id => fd.append("recipient_ids", id));
      files.forEach(f => fd.append("images", f));
      
      await api.post("/posts/", fd, { headers: { "Content-Type": "multipart/form-data" } });
      setMsg("Message publié avec succès !");
      setForm({ title: "", body: "", is_broadcast: false });
      setChecked([]); 
      setFiles([]);
      setPreviews([]);
    } catch (e) { 
      setErr(e?.response?.data?.detail || "Échec de la publication."); 
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white pb-16">
      {/* Header */}
      <header className="bg-white shadow-sm py-4 px-6 sticky top-0 z-10">
        <div className="flex items-center">
          <Link to="/dashboard" className="mr-4 text-indigo-600 hover:text-indigo-800">
            <ArrowLeftIcon className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-indigo-900">Publier un message</h1>
            <p className="text-sm text-gray-600">Partagez des informations avec les membres</p>
          </div>
        </div>
      </header>

      <div className="p-4 max-w-2xl mx-auto">
        <form onSubmit={onSubmit} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          {/* File Upload */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
              <PhotoIcon className="w-5 h-5 mr-2 text-indigo-600" />
              Images (optionnel)
            </label>
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-indigo-400 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <PhotoIcon className="w-8 h-8 mb-3 text-gray-400" />
                  <p className="mb-2 text-sm text-gray-500">Cliquez pour ajouter des images</p>
                  <p className="text-xs text-gray-500">PNG, JPG, JPEG (max. 10Mo)</p>
                </div>
                <input 
                  type="file" 
                  multiple 
                  accept="image/*" 
                  onChange={(e) => setFiles(Array.from(e.target.files))}
                  className="hidden" 
                />
              </label>
            </div>

            {/* Image Previews */}
            {previews.length > 0 && (
              <div className="mt-4 grid grid-cols-2 gap-3">
                {previews.map((preview, index) => (
                  <div key={index} className="relative group">
                    <img 
                      src={preview} 
                      alt={`Preview ${index}`} 
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <XCircleIcon className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Title */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
              <DocumentTextIcon className="w-5 h-5 mr-2 text-indigo-600" />
              Titre (optionnel)
            </label>
            <input
              type="text"
              placeholder="Donnez un titre à votre publication..."
              value={form.title}
              onChange={e => setForm({...form, title: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          {/* Content */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
              <DocumentTextIcon className="w-5 h-5 mr-2 text-indigo-600" />
              Contenu *
            </label>
            <textarea
              placeholder="Rédigez votre message ici..."
              rows={6}
              value={form.body}
              onChange={e => setForm({...form, body: e.target.value})}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          {/* Broadcast Option */}
          <div className="mb-6">
            <label className="flex items-center cursor-pointer">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={form.is_broadcast}
                  onChange={e => setForm({...form, is_broadcast: e.target.checked})}
                  className="sr-only"
                />
                <div className={`block w-14 h-7 rounded-full ${form.is_broadcast ? 'bg-indigo-600' : 'bg-gray-300'}`}></div>
                <div className={`absolute left-1 top-1 bg-white w-5 h-5 rounded-full transition-transform ${form.is_broadcast ? 'transform translate-x-7' : ''}`}></div>
              </div>
              <div className="ml-3 flex items-center">
                <GlobeAltIcon className="w-5 h-5 mr-2 text-indigo-600" />
                <span className="text-gray-700 font-medium">Envoyer à tous les membres</span>
              </div>
            </label>
          </div>

          {/* Member Selection */}
          {!form.is_broadcast && (
            <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
              <h3 className="font-medium text-gray-700 mb-3 flex items-center">
                <UserGroupIcon className="w-5 h-5 mr-2 text-indigo-600" />
                Choisir les membres destinataires
              </h3>
              <div className="max-h-60 overflow-y-auto space-y-2">
                {members.map(m => (
                  <label key={m.id} className="flex items-center p-2 rounded-lg hover:bg-gray-100 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={checked.includes(m.id)}
                      onChange={() => toggle(m.id)}
                      className="rounded text-indigo-600 focus:ring-indigo-500"
                    />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">{m.username}</p>
                      <p className="text-xs text-gray-500">{m.email}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-6 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Publication en cours...
              </>
            ) : (
              <>
                <PaperAirplaneIcon className="w-5 h-5 mr-2" />
                Publier le message
              </>
            )}
          </button>
        </form>

        {/* Messages */}
        {msg && (
          <div className="mt-6 p-4 bg-green-50 text-green-700 rounded-xl border border-green-200 flex items-start">
            <CheckCircleIcon className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
            <span>{msg}</span>
          </div>
        )}
        
        {err && (
          <div className="mt-6 p-4 bg-red-50 text-red-700 rounded-xl border border-red-200 flex items-start">
            <XCircleIcon className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
            <span>{err}</span>
          </div>
        )}
      </div>
    </div>
  );
}