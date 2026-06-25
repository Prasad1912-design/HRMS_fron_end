import React from 'react'
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

export default function ProtectedRoutes({children, allowedRoles}) {
    
  const token = localStorage.getItem("token");
  if(!token)
  {
    return <Navigate to = "/login" />
  }
  const decodeToken = jwtDecode(token);

  if(decodeToken.role.toLowerCase() !== allowedRoles.toLowerCase())
  {
    return (
      <Navigate to = {decodeToken.role.toLowerCase()==="admin" ? "/admin/dashboard" : "/employee/attendance"} />
    )
  }

  return children;
}
