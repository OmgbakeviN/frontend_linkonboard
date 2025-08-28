// src/pages/AdminMembersList.jsx
import { useEffect, useState } from "react";
import api from "../api";
import { 
  UserGroupIcon, 
  UserIcon, 
  EnvelopeIcon, 
  PhoneIcon, 
  CalendarIcon, 
  KeyIcon,
  IdentificationIcon,
  ClockIcon,
  ArrowLeftIcon
} from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";

export default function AdminMembersList() {
  const [rows, setRows] = useState([]);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);
  const [expandedRow, setExpandedRow] = useState(null);

  useEffect(() => {
    setLoading(true);
    api.get("/admin/members-with-form/")
      .then(res => {
        setRows(res.data || []);
        setErr("");
      })
      .catch(() => setErr("Impossible de charger la liste des membres"))
      .finally(() => setLoading(false));
  }, []);

  const toggleRow = (index) => {
    setExpandedRow(expandedRow === index ? null : index);
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
            <h1 className="text-xl font-bold text-indigo-900">Membres & Formulaires</h1>
            <p className="text-sm text-gray-600">Gestion des membres de la plateforme</p>
          </div>
        </div>
      </header>

      <div className="p-4">
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
        {!loading && rows.length === 0 && !err && (
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
            <UserGroupIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-700 mb-2">Aucun membre</h3>
            <p className="text-gray-500">Aucun membre n'a encore rejoint la plateforme.</p>
          </div>
        )}

        {/* Members List */}
        {!loading && rows.length > 0 && (
          <div className="space-y-4">
            {rows.map((r, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Summary Row */}
                <div 
                  className="p-4 flex items-center justify-between cursor-pointer"
                  onClick={() => toggleRow(i)}
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mr-3">
                      <UserIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-800">{r.full_name || "Non renseigné"}</h3>
                      <p className="text-sm text-gray-500">{r.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium mr-2 ${
                      r.role === 'admin' 
                        ? 'bg-purple-100 text-purple-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {r.role}
                    </span>
                    <svg 
                      className={`w-5 h-5 text-gray-400 transition-transform ${expandedRow === i ? 'rotate-180' : ''}`} 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                {/* Expanded Details */}
                {expandedRow === i && (
                  <div className="border-t border-gray-100 p-4 bg-gray-50">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Personal Info */}
                      <div className="space-y-3">
                        <h4 className="font-medium text-gray-700 flex items-center">
                          <IdentificationIcon className="w-4 h-4 mr-2 text-indigo-600" />
                          Informations personnelles
                        </h4>
                        <div className="space-y-2">
                          <div className="flex items-center text-sm">
                            <EnvelopeIcon className="w-4 h-4 mr-2 text-gray-400" />
                            <span className="text-gray-600">{r.email || "-"}</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <PhoneIcon className="w-4 h-4 mr-2 text-gray-400" />
                            <span className="text-gray-600">{r.phone || "-"}</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <CalendarIcon className="w-4 h-4 mr-2 text-gray-400" />
                            <span className="text-gray-600">{r.birth_date || "-"}</span>
                          </div>
                        </div>
                      </div>

                      {/* Account Info */}
                      <div className="space-y-3">
                        <h4 className="font-medium text-gray-700 flex items-center">
                          <KeyIcon className="w-4 h-4 mr-2 text-indigo-600" />
                          Informations du compte
                        </h4>
                        <div className="space-y-2">
                          <div className="flex items-center text-sm">
                            <UserIcon className="w-4 h-4 mr-2 text-gray-400" />
                            <span className="text-gray-600">{r.username || "Non défini"}</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <KeyIcon className="w-4 h-4 mr-2 text-gray-400" />
                            <span className="text-gray-600">Invitation: {r.invite_status} / {r.token?.slice(0, 8)}…</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <ClockIcon className="w-4 h-4 mr-2 text-gray-400" />
                            <span className="text-gray-600">
                              Inscrit le: {new Date(r.submission_created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
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