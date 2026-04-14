"use client"; // Important: This must be a client component

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { checkAuthStatus } from "@/redux/authSlice"; 

export default function AuthChecker({ children }) {
  const dispatch = useDispatch();

  useEffect(() => {
    // Check authentication status when app loads
    dispatch(checkAuthStatus());
  }, [dispatch]);

  return <>{children}</>;
}
