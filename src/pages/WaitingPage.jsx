import { useEffect, useRef, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import {
  ClockIcon,
  CheckBadgeIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  EnvelopeIcon
} from "@heroicons/react/24/outline";

export default function WaitingPage() {
  const { token } = useParams()
  const navigate = useNavigate()
  const [status, setStatus] = useState('PENDING')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const intervalRef = useRef(null)

  useEffect(() => {
    let mounted = true

    async function fetchStatus() {
      try {
        const res = await axios.get(`/api/invites/${token}/`)
        if (!mounted) return
        const s = res.data.status || 'PENDING'
        setStatus(s)
        setLoading(false)
        
        // Redirections selon le statut
        if (s === 'APPROVED') {
          // navigate('/login')
        }
        if (s === 'REJECTED') {
          // navigate(`/${token}`)
        }
      } catch (e) {
        setError("Impossible de récupérer le statut de votre demande.")
        setLoading(false)
      }
    }

    // Premier fetch immédiat
    fetchStatus()
    // Poll toutes les 5 secondes
    intervalRef.current = setInterval(fetchStatus, 5000)

    return () => {
      mounted = false
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [token, navigate])

  const statusConfig = {
    PENDING: {
      icon: ClockIcon,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200',
      title: 'Validation en cours',
      message: 'Votre demande est en cours de validation. Vous recevrez un email avec votre mot de passe par défaut et identifiant. Merci de patienter…'
    },
    APPROVED: {
      icon: CheckBadgeIcon,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      title: 'Demande acceptée',
      message: 'Votre demande a été acceptée. Vous allez recevoir les instructions de connexion par email.'
    },
    REJECTED: {
      icon: XCircleIcon,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      title: 'Demande refusée',
      message: 'Votre demande a été refusée. Vous pouvez réessayer ultérieurement.'
    },
    EXPIRED: {
      icon: ExclamationTriangleIcon,
      color: 'text-gray-600',
      bgColor: 'bg-gray-50',
      borderColor: 'border-gray-200',
      title: 'Lien expiré',
      message: 'Le lien d\'invitation a expiré. Merci de contacter le support.'
    }
  }

  const currentStatus = statusConfig[status] || statusConfig.PENDING
  const StatusIcon = currentStatus.icon

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-red-200 max-w-md w-full text-center">
          <XCircleIcon className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-gray-800 mb-2">Erreur</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden w-full max-w-md">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-violet-600 p-6 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
            <EnvelopeIcon className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-xl font-bold text-white">Statut de votre demande</h1>
          <p className="text-indigo-100 mt-2">Token: {token}</p>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Status Indicator */}
          <div className="text-center mb-6">
            <div className={`w-20 h-20 mx-auto rounded-full ${currentStatus.bgColor} flex items-center justify-center mb-4`}>
              <StatusIcon className={`w-10 h-10 ${currentStatus.color}`} />
            </div>
            <h2 className="text-lg font-semibold text-gray-800 mb-2">{currentStatus.title}</h2>
            <div className={`p-4 rounded-lg border ${currentStatus.borderColor} ${currentStatus.bgColor}`}>
              <p className="text-gray-700">{currentStatus.message}</p>
            </div>
          </div>

          {/* Loading Animation for Pending Status */}
          {status === 'PENDING' && (
            <div className="text-center mb-6">
              <div className="flex justify-center space-x-1">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce"
                    style={{ animationDelay: `${i * 0.1}s` }}
                  />
                ))}
              </div>
              <p className="text-sm text-gray-500 mt-2">Vérification du statut...</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            {status === 'REJECTED' && (
              <button
                onClick={() => navigate(`/${token}`)}
                className="w-full flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <ArrowLeftIcon className="w-5 h-5 mr-2" />
                Revenir au formulaire
              </button>
            )}
            
            {status === 'APPROVED' && (
              <button
                onClick={() => navigate('/login')}
                className="w-full flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Aller à la connexion
                <ArrowRightIcon className="w-5 h-5 ml-2" />
              </button>
            )}

            {(status === 'PENDING' || status === 'EXPIRED') && (
              <button
                onClick={() => navigate('/')}
                className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Retour à l'accueil
              </button>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 p-4 border-t border-gray-100 text-center">
          <p className="text-sm text-gray-500">
            Besoin d'aide ? <a href="#" className="text-indigo-600 hover:text-indigo-800">Contactez le support</a>
          </p>
        </div>
      </div>
    </div>
  )
}