import { useAuth } from '../../hooks/useAuth';

export default function UserProfileCard() {
  const { user } = useAuth();

  const name = user?.name ?? user?.nombre ?? 'Usuario';
  const email = user?.email ?? user?.correo ?? '';
  const initial = name.charAt(0).toUpperCase();

  const roleLabel = {
    admin: 'Administrador',
    teacher: 'Profesor',
    student: 'Alumno',
  };

  return (
    <div className="sidebar-profile">
      <div className="sidebar-avatar">
        {initial}
      </div>

      <h6>{name}</h6>

      <span className="sidebar-role">
        {roleLabel[user?.type] ?? user?.type ?? 'Usuario'}
      </span>

      <small>{email}</small>
    </div>
  );
}