import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from '../store/authStore.js';

const RequireAuth = ({ allowedRoles }) => {
    const { user, isAuthenticated } = useAuthStore();

    // Fix 1: Spelling mistake (sAuthenticated -> isAuthenticated)
    // Fix 2: Add '/' before login to make it an absolute path
    if (!isAuthenticated) return <Navigate to='/login' replace />

    // Fix 3: Add '!' (NOT). We redirect if the role is NOT in the list.
    // Fix 4: Syntax fix (user?.role)
    if (allowedRoles && !allowedRoles.includes(user?.role)) {
        return <Navigate to='/unauthorized' replace />
    }

    return <Outlet />;
}

export default RequireAuth;