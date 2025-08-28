// src/pages/ClientDashboard.jsx
import { Link } from "react-router-dom";
import { 
  PlusCircleIcon, 
  DocumentTextIcon, 
  Squares2X2Icon, 
  UserGroupIcon, 
  ClipboardDocumentListIcon,
  ArrowRightIcon,
  HomeIcon
} from "@heroicons/react/24/outline";

function DashLink({ to, icon: Icon, children }) {
  return (
    <Link
      to={to}
      className="flex items-center p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 hover:translate-x-1 border border-gray-100"
    >
      <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 mr-3">
        <Icon className="w-5 h-5" />
      </div>
      <span className="text-gray-700 font-medium flex-1">{children}</span>
      <ArrowRightIcon className="w-4 h-4 text-gray-400" />
    </Link>
  );
}

function QuickAction({ to, icon: Icon, children, colorClass }) {
  return (
    <Link
      to={to}
      className={`flex flex-col items-center justify-center p-4 rounded-xl shadow-sm ${colorClass} text-white hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1`}
    >
      <Icon className="w-8 h-8 mb-2" />
      <span className="text-sm font-medium text-center">{children}</span>
    </Link>
  );
}

export default function ClientDashboard() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-indigo-50 to-white pb-12">
      {/* Header */}
      <header className="bg-white shadow-sm py-4 px-6 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-indigo-900">Tableau de bord</h1>
        </div>
      </header>

      <div className="p-6">
        {/* Welcome card */}
        <div className="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-2xl p-6 text-white shadow-lg mb-8">
          <h2 className="text-xl font-semibold mb-2">Bonjour !</h2>
          <p className="opacity-90">Bienvenue sur votre espace admin</p>
        </div>

        {/* Quick Actions */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <HomeIcon className="w-5 h-5 mr-2 text-indigo-600" />
            Raccourcis
          </h2>
          <div className="grid grid-cols-3 gap-3">
            <QuickAction 
              to="/new-invite" 
              icon={PlusCircleIcon} 
              colorClass="bg-indigo-500 hover:bg-indigo-600"
            >
              Invitation
            </QuickAction>
            <QuickAction 
              to="/post" 
              icon={DocumentTextIcon} 
              colorClass="bg-violet-500 hover:bg-violet-600"
            >
              Publier
            </QuickAction>
            <QuickAction 
              to="/my-posts" 
              icon={Squares2X2Icon} 
              colorClass="bg-blue-500 hover:bg-blue-600"
            >
              Mes posts
            </QuickAction>
          </div>
        </section>

        {/* Navigation */}
        <section>
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Squares2X2Icon className="w-5 h-5 mr-2 text-indigo-600" />
            Navigation
          </h2>
          <div className="space-y-3">
            <DashLink to="/new-invite" icon={PlusCircleIcon}>
              Créer une invitation
            </DashLink>
            <DashLink to="/post" icon={DocumentTextIcon}>
              Nouveau post
            </DashLink>
            <DashLink to="/my-posts" icon={Squares2X2Icon}>
              Mes posts
            </DashLink>
            <DashLink to="/admin/members" icon={UserGroupIcon}>
              Liste des membres
            </DashLink>
            <DashLink to="/demands" icon={ClipboardDocumentListIcon}>
              Demandes
            </DashLink>
          </div>
        </section>
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-3 flex justify-between">
        <Link to="/new-invite" className="flex flex-col items-center text-indigo-600">
          <PlusCircleIcon className="w-6 h-6" />
          <span className="text-xs mt-1">Inviter</span>
        </Link>
        <Link to="/post" className="flex flex-col items-center text-gray-500">
          <DocumentTextIcon className="w-6 h-6" />
          <span className="text-xs mt-1">Post</span>
        </Link>
        <Link to="/my-posts" className="flex flex-col items-center text-gray-500">
          <Squares2X2Icon className="w-6 h-6" />
          <span className="text-xs mt-1">Posts</span>
        </Link>
      </nav>
    </main>
  );
}