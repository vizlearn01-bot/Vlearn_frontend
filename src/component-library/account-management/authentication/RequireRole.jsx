import React, { useContext } from "react";
import { Navigate, useLocation } from "react-router";
import UserContext from "../../../Context/UserContext";
import LoadingScreen from "../../utils/LoadingScreen";
import SEO from "../../../Components/Common/SEO";

const RequireRole = ({ children, allowedRoles = [], fallbackUrl }) => {
  const { user, token } = useContext(UserContext) || {};
  const location = useLocation();

  if (token == null) {
    const redirectTarget = location.pathname + location.search;
    return <Navigate to={`/login?next=${encodeURIComponent(redirectTarget)}`} replace state={{ from: location }} />;
  }

  if (user == null) {
    return <LoadingScreen message="Verifying permissions..." />;
  }

  const role = user.role || (user.is_superuser || user.is_staff ? "platform_admin" : "");

  if (!role) {
    return <Navigate to="/role-selection" replace />;
  }

  const isAllowed =
    allowedRoles.length === 0 ||
    allowedRoles.includes(role) ||
    role === "platform_admin" ||
    user.is_superuser;

  if (!isAllowed) {
    let target = "/student";
    if (role === "teacher") target = "/teacher";
    else if (role === "school_admin") target = "/school";
    else if (role === "platform_admin") target = "/admin-dashboard";

    return <Navigate to={fallbackUrl || target} replace />;
  }

  return (
    <>
      <SEO noindex={true} />
      {children}
    </>
  );
};

export default RequireRole;
