import { useContext } from "react";
import { type IAuthContext, AuthContext } from "../context/AuthContext";

export function useAuth(): IAuthContext {
  const context = useContext(AuthContext);

  if (!context) {
    console.log("Oh loko");

    throw new Error("Without context");
  }

  return context;
}
