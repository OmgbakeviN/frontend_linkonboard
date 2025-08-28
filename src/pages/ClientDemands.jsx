import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import {
  ArrowLeftIcon,
  ArrowPathIcon,
  EyeIcon,
  CheckBadgeIcon,
  XCircleIcon,
  FunnelIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  CalendarIcon
} from "@heroicons/react/24/outline";

export default function ClientDemands() {
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState("PENDING");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [expandedRow, setExpandedRow] = useState(null);

  async function load() {
    setLoading(true);
    setErr("");
    try {
      const res = await api.get(`/admin/submissions/`, { params: { status } });
      const data = Array.isArray(res.data) ? res.data : res.data.results;
      setItems(data || []);
    } catch (e) {
      setErr("Impossible de charger la liste des demandes.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { 
    load(); 
  }, [status]);

  async function act(path) {
    try {
      await path();
      await load();
    } catch (e) {
      alert(e?.response?.data?.detail || "Action échouée");
    }
  }

  const toggleRow = (id) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING": return "bg-yellow-100 text-yellow-800";
      case "APPROVED": return "bg-green-100 text-green-800";
      case "REJECTED": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "PENDING": return "En attente";
      case "APPROVED": return "Approuvé";
      case "REJECTED": return "Rejeté";
      default: return status;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white pb-16">
      {/* Header */}
      <header className="bg-white shadow-sm py-4 px-6 sticky top-0 z-10">
        <div className="flex items-center">
          <Link to="/dashboard" className="mr-4 text-indigo-600 hover:text-indigo-800">
            <ArrowLeftIcon className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-indigo-900">Gestion des Demandes</h1>
            <p className="text-sm text-gray-600">Examinez et traitez les soumissions</p>
          </div>
        </div>
      </header>

      <div className="p-4">
        {/* Filter Section */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center">
              <FunnelIcon className="w-5 h-5 text-indigo-600 mr-2" />
              <span className="text-gray-700 font-medium">Filtrer par statut :</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {["PENDING", "APPROVED", "REJECTED"].map(s => (
                <button
                  key={s}
                  onClick={() => setStatus(s)}
                  disabled={status === s}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    status === s
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {getStatusText(s)}
                </button>
              ))}
            </div>
            <button
              onClick={load}
              disabled={loading}
              className="flex items-center justify-center px-3 py-1.5 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors disabled:opacity-50"
            >
              <ArrowPathIcon className={`w-4 h-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
              Rafraîchir
            </button>
          </div>
        </div>

        {/* Error Message */}
        {err && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl border border-red-200 flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{err}</span>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <svg className="animate-spin h-8 w-8 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        )}

        {/* Empty State */}
        {!loading && items.length === 0 && !err && (
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
            <UserIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-700 mb-2">Aucune demande</h3>
            <p className="text-gray-500">Aucune demande {status === "PENDING" ? "en attente" : status === "APPROVED" ? "approuvée" : "rejetée"}.</p>
          </div>
        )}

        {/* Demands List */}
        {!loading && items.length > 0 && (
          <div className="space-y-4">
            {items.map((row) => (
              <div key={row.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Summary Row */}
                <div 
                  className="p-4 flex items-center justify-between cursor-pointer"
                  onClick={() => toggleRow(row.id)}
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mr-3">
                      <UserIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-800">{row.full_name || "Non renseigné"}</h3>
                      <p className="text-sm text-gray-500">{row.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium mr-2 ${getStatusColor(row.status)}`}>
                      {getStatusText(row.status)}
                    </span>
                    <svg 
                      className={`w-5 h-5 text-gray-400 transition-transform ${expandedRow === row.id ? 'rotate-180' : ''}`} 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                {/* Expanded Details */}
                {expandedRow === row.id && (
                  <div className="border-t border-gray-100 p-4 bg-gray-50">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      {/* Personal Info */}
                      <div className="space-y-3">
                        <h4 className="font-medium text-gray-700">Informations personnelles</h4>
                        <div className="space-y-2">
                          <div className="flex items-center text-sm">
                            <EnvelopeIcon className="w-4 h-4 mr-2 text-gray-400" />
                            <span className="text-gray-600">{row.email || "-"}</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <PhoneIcon className="w-4 h-4 mr-2 text-gray-400" />
                            <span className="text-gray-600">{row.phone || "-"}</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <CalendarIcon className="w-4 h-4 mr-2 text-gray-400" />
                            <span className="text-gray-600">{row.birth_date || "-"}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t border-gray-200">
                      <Link 
                        to={`/${row.token}`} 
                        target="_blank"
                        className="flex items-center justify-center px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors"
                      >
                        <EyeIcon className="w-4 h-4 mr-2" />
                        Voir le formulaire
                      </Link>
                      
                      {row.status === "PENDING" && (
                        <>
                          <button 
                            onClick={() => act(() => api.post(`/admin/submissions/${row.id}/approve/`))}
                            className="flex items-center justify-center px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                          >
                            <CheckBadgeIcon className="w-4 h-4 mr-2" />
                            Accepter
                          </button>
                          <button 
                            onClick={() => act(() => api.post(`/admin/submissions/${row.id}/reject/`))}
                            className="flex items-center justify-center px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                          >
                            <XCircleIcon className="w-4 h-4 mr-2" />
                            Refuser
                          </button>
                        </>
                      )}
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