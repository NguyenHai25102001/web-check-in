// AuthContext.js
import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [phoneUser, setPhoneUser] = useState("");
    const [showModalFollow, setShowModalFollow] = useState(false);

    return (
        <AuthContext.Provider value={{ phoneUser, setPhoneUser, setShowModalFollow, showModalFollow }}>
            {children}
        </AuthContext.Provider>
    );
};

const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export { AuthProvider, useAuth };
