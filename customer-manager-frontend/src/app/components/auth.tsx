"use client";
import { createContext, useContext, useEffect, useState } from "react"
import { User } from "@/app/lib/definitions";
import { useRouter } from "next/navigation";

type AuthContextType = {
    loading: boolean;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    isSignedIn: boolean;
    setIsSignedIn: React.Dispatch<React.SetStateAction<boolean>>;
    currentUser: User | null;
    setCurrentUser: React.Dispatch<React.SetStateAction<User | null>>;
};

type AuthProviderProps = {
    children: React.ReactNode;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [loading, setLoading] = useState<boolean>(true);
    const [isSignedIn, setIsSignedIn] = useState<boolean>(false);
    const [currentUser, setCurrentUser] = useState<User | null>(null);

    return (
        <AuthContext.Provider
            value={{
                loading,
                setLoading,
                isSignedIn,
                setIsSignedIn,
                currentUser,
                setCurrentUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuthContext = () => {
    const context = useContext(AuthContext);
    if (context === null)
        throw new Error("useAuthContextAuthProvider");

    return context;
};