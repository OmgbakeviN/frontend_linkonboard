import { useState, useRef } from "react";
import api from "../api";
import { 
  LinkIcon, 
  DocumentDuplicateIcon, 
  CheckIcon,
  ArrowLeftIcon,
  ShareIcon
} from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";

export default function NewInvitePage() {
  const [invite, setInvite] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [copied, setCopied] = useState(false);
  const linkInputRef = useRef(null);

  async function createInvite() {
    setLoading(true);
    setErr("");
    setInvite(null);
    setCopied(false);
    try {
      const res = await api.post("/invites/", {});
      setInvite(res.data);
    } catch (e) {
      setErr("Impossible de générer un lien d'invitation");
    } finally {
      setLoading(false);
    }
  }

  function copyToClipboard() {
    const inviteUrl = `${window.location.origin}/${invite.token}`;
    
    // Méthode moderne avec l'API Clipboard
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(inviteUrl)
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        })
        .catch(err => {
          console.error('Erreur avec clipboard API: ', err);
          fallbackCopyToClipboard(inviteUrl);
        });
    } else {
      // Fallback pour les navigateurs qui ne supportent pas l'API Clipboard
      fallbackCopyToClipboard(inviteUrl);
    }
  }

  function fallbackCopyToClipboard(text) {
    // Méthode alternative avec textarea pour les mobiles
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.opacity = 0;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      const successful = document.execCommand('copy');
      if (successful) {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } else {
        setErr("Impossible de copier le lien. Veuillez le sélectionner manuellement.");
        // Sélectionner le texte pour permettre la copie manuelle
        if (linkInputRef.current) {
          linkInputRef.current.select();
        }
      }
    } catch (err) {
      console.error('Erreur avec fallback: ', err);
      setErr("Impossible de copier le lien. Veuillez le sélectionner manuellement.");
      if (linkInputRef.current) {
        linkInputRef.current.select();
      }
    }
    
    document.body.removeChild(textArea);
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white pb-12">
      {/* Header */}
      <header className="bg-white shadow-sm py-4 px-6 sticky top-0 z-10">
        <div className="flex items-center">
          <Link to="/dashboard" className="mr-4 text-indigo-600 hover:text-indigo-800">
            <ArrowLeftIcon className="w-6 h-6" />
          </Link>
          <h1 className="text-xl font-bold text-indigo-900">Nouvelle invitation</h1>
        </div>
      </header>

      <div className="p-6 max-w-lg mx-auto">
        {/* Instructions */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 mb-4 mx-auto">
            <LinkIcon className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-semibold text-center text-gray-800 mb-2">
            Créer un lien d'invitation
          </h2>
          <p className="text-gray-600 text-center text-sm">
            Générez un lien unique à partager avec une personne que vous souhaitez inviter à rejoindre la plateforme.
          </p>
        </div>

        {/* Generate Button */}
        <button
          onClick={createInvite}
          disabled={loading}
          className={`w-full py-3 px-4 rounded-xl font-medium text-white transition-all duration-200 flex items-center justify-center
            ${loading 
              ? 'bg-indigo-400 cursor-not-allowed' 
              : 'bg-indigo-600 hover:bg-indigo-700 shadow-sm hover:shadow-md'}`}
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Création en cours...
            </>
          ) : (
            'Générer un lien d\'invitation'
          )}
        </button>

        {/* Error Message */}
        {err && (
          <div className="mt-6 p-4 bg-red-50 text-red-700 rounded-xl border border-red-200 flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{err}</span>
          </div>
        )}

        {/* Invitation Link */}
        {invite && (
          <div className="mt-6 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-500 to-violet-500 p-4 text-white">
              <h3 className="font-medium flex items-center">
                <LinkIcon className="w-5 h-5 mr-2" />
                Lien d'invitation généré
              </h3>
            </div>
            
            <div className="p-4">
              <div className="mb-3">
                <div className="relative">
                  <input
                    ref={linkInputRef}
                    type="text"
                    readOnly
                    value={`${window.location.origin}/${invite.token}`}
                    className="w-full bg-gray-50 rounded-lg p-3 border border-gray-200 pr-20 text-sm text-gray-600 truncate"
                    onClick={(e) => e.target.select()}
                  />
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex">
                    {/* Bouton pour copier le lien */}
                    <button
                      onClick={copyToClipboard}
                      className="p-2 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 rounded-lg transition-colors duration-200 flex items-center justify-center ml-2"
                      title="Copier le lien"
                    >
                      {copied ? (
                        <CheckIcon className="w-5 h-5 text-green-600" />
                      ) : (
                        <DocumentDuplicateIcon className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-2 mt-4">
                <button
                  onClick={copyToClipboard}
                  className="flex-1 py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors duration-200 flex items-center justify-center"
                >
                  {copied ? (
                    <>
                      <CheckIcon className="w-5 h-5 mr-2" />
                      Lien copié!
                    </>
                  ) : (
                    <>
                      <DocumentDuplicateIcon className="w-5 h-5 mr-2" />
                      Copier le lien
                    </>
                  )}
                </button>
              </div>
              
              <p className="text-sm text-gray-600 mt-4 flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Copiez ou partagez ce lien avec la personne que vous souhaitez inviter. Ce lien expirera après utilisation.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}