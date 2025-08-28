import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  CalendarIcon,
  PaperAirplaneIcon,
  ArrowLeftIcon,
  ExclamationTriangleIcon
} from "@heroicons/react/24/outline";

export default function InviteFormPage() {
  const { token } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [invite, setInvite] = useState(null)
  const [error, setError] = useState("")
  const [form, setForm] = useState({ 
    full_name: "", 
    email: "", 
    phone: "", 
    birth_date: "" 
  })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    let mounted = true
    async function fetchInvite() {
      try {
        const res = await fetch(`https://linkonboard.pythonanywhere.com/api/invites/${token}/`)
        if (!mounted) return
        if (!res.ok) throw new Error("HTTP " + res.status)
        const data = await res.json()
        if (data.status === "EXPIRED") {
          setError("Ce lien d'invitation a expiré.")
        } else {
          setInvite(data)
        }
      } catch (e) {
        setError("Lien d'invitation invalide ou introuvable.")
      } finally {
        setLoading(false)
      }
    }
    fetchInvite()
    return () => { mounted = false }
  }, [token])

  function onChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function onSubmit(e) {
    e.preventDefault()
    setSubmitting(true)
    setError("")
    try {
      const res = await fetch(`https://linkonboard.pythonanywhere.com/api/invites/${token}/submit/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      if (!res.ok) {
        const maybe = await res.json().catch(() => null)
        throw new Error(maybe?.detail || "Erreur lors de l'envoi du formulaire.")
      }
      navigate(`/waiting/${token}`)
    } catch (e) {
      setError(e.message || "Une erreur s'est produite lors de l'envoi.")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <svg className="animate-spin h-12 w-12 text-indigo-600 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-gray-600">Chargement du formulaire...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-red-200 max-w-md w-full text-center">
          <ExclamationTriangleIcon className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-gray-800 mb-2">Erreur</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-gray-50 py-8 px-4">
      <div className="max-w-md mx-auto">
        {/* Header Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="text-center mb-4">
            <div className="w-16 h-16 mx-auto mb-4 bg-indigo-100 rounded-full flex items-center justify-center">
              <EnvelopeIcon className="w-8 h-8 text-indigo-600" />
            </div>
            <h1 className="text-2xl font-bold text-indigo-900 mb-2">Formulaire d'Inscription</h1>
            <p className="text-gray-600">Complétez vos informations pour finaliser votre inscription</p>
          </div>
          
          {invite?.target_email && (
            <div className="bg-indigo-50 p-3 rounded-lg border border-indigo-200 text-center">
              <p className="text-sm text-indigo-700">
                Invitation pour: <span className="font-medium">{invite.target_email}</span>
              </p>
            </div>
          )}
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <form onSubmit={onSubmit} className="p-6 space-y-4">
            {/* Full Name Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <UserIcon className="w-4 h-4 mr-2 text-indigo-600" />
                Nom complet *
              </label>
              <input
                name="full_name"
                value={form.full_name}
                onChange={onChange}
                required
                placeholder="Votre nom complet"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                disabled={submitting}
              />
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <EnvelopeIcon className="w-4 h-4 mr-2 text-indigo-600" />
                Adresse email *
              </label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={onChange}
                required
                placeholder="votre@email.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                disabled={submitting}
              />
            </div>

            {/* Phone Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <PhoneIcon className="w-4 h-4 mr-2 text-indigo-600" />
                Numéro de téléphone *
              </label>
              <input
                name="phone"
                value={form.phone}
                onChange={onChange}
                required
                placeholder="Votre numéro de téléphone"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                disabled={submitting}
              />
            </div>

            {/* Birth Date Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <CalendarIcon className="w-4 h-4 mr-2 text-indigo-600" />
                Date de naissance *
              </label>
              <input
                name="birth_date"
                type="date"
                value={form.birth_date}
                onChange={onChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                disabled={submitting}
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-50 text-red-700 rounded-lg border border-red-200 flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm">{error}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              disabled={submitting}
              type="submit"
              className="w-full py-3 px-4 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {submitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Envoi en cours...
                </>
              ) : (
                <>
                  <PaperAirplaneIcon className="w-5 h-5 mr-2" />
                  Envoyer le formulaire
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="bg-gray-50 p-4 border-t border-gray-100 text-center">
            <p className="text-xs text-gray-500">
              Token: {token}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}