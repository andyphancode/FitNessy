import React from "react";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
    const token = window.localStorage.getItem("fitnessy-token");

    if(token==="undefined") {
        return <Navigate to="/login" replace/>
    }

    return children;
}

export default ProtectedRoute;