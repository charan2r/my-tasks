import React, { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../lib/store";
import { getMe } from "../../services/auth/authSlice";
import { Loader } from "../common/Loader";

const ProtectedRoute = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { token, isAuthChecked } = useSelector(
    (state: RootState) => state.auth,
  );

  useEffect(() => {
    if (token && !isAuthChecked) {
      void dispatch(getMe());
    }
  }, [dispatch, isAuthChecked, token]);

  if (token && !isAuthChecked) {
    return <Loader fullScreen size={32} />;
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
