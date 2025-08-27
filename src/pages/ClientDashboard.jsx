// src/pages/ClientDashboard.jsx
import { Link } from "react-router-dom";

function DashLink({ to, children }) {
  return (
    <p>
      <Link to={to}>{children}</Link>
    </p>
  );
}

export default function ClientDashboard() {
  return (
    <main>
      <h1>Dashboard Client</h1>

      <section>
        <h2>Navigation</h2>
        <DashLink to="/new-invite">Créer une invitation</DashLink>
        <DashLink to="/post">Nouveau post</DashLink>
        <DashLink to="/my-posts">Mes posts</DashLink>
        <DashLink to="/wall">Mur des membres</DashLink>
        <DashLink to="/admin/members">Liste des membres</DashLink>
        <DashLink to="/demands">Demandes</DashLink>
      </section>

      <section>
        <h2>Raccourcis</h2>
        <DashLink to="/new-invite">→ Nouvelle invitation</DashLink>
        <DashLink to="/post">→ Publier un post</DashLink>
        <DashLink to="/my-posts">→ Voir mes posts</DashLink>
      </section>
    </main>
  );
}
