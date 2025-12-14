// import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
// import { jwtDecode } from 'jwt-decode';
// import socketService from '../services/socketService';

// interface User {
//   id: string;
//   email: string;
//   role: 'ADMIN' | 'ENGINEER' | 'VIEWER';
//   name: string;
// }

// interface AuthContextType {
//   user: User | null;
//   token: string | null;
//   login: (token: string) => void;
//   logout: () => void;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const AuthProvider = ({ children }: { children: ReactNode }) => {
//   // 1. Initialize Token from LocalStorage
//   const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

//   // 2. Initialize User SYNCHRONOUSLY to prevent redirect on refresh
//   const [user, setUser] = useState<User | null>(() => {
//     const storedToken = localStorage.getItem('token');
//     if (storedToken) {
//       try {
//         return jwtDecode<User>(storedToken);
//       } catch (e) {
//         console.error("Invalid token on startup", e);
//         return null;
//       }
//     }
//     return null;
//   });

//   // Keep the useEffect to handle token updates (e.g. login/logout actions)
//   useEffect(() => {
//     if (token) {
//       try {
//         const decoded = jwtDecode<User>(token);
//         setUser(decoded);
//       } catch (e) {
//         logout();
//       }
//     } else {
//       setUser(null);
//     }
//   }, [token]);

//   const login = (newToken: string) => {
//     localStorage.setItem('token', newToken);
//     setToken(newToken);
//   };

//   const logout = () => {
//     localStorage.removeItem('token');
//     setToken(null);
//     setUser(null);
//   };

//   return (
//     <AuthContext.Provider value={{ user, token, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) throw new Error('useAuth must be used within an AuthProvider');
//   return context;
// };


////////////////////////////////// 
// VERSION WITH SOCKET INTEGRATION //
//////////////////////////////////
import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';
import socketService from '../services/socketService'; // <--- 1. Ensure this import exists

interface User {
  id: string;
  email: string;
  role: 'ADMIN' | 'ENGINEER' | 'VIEWER';
  name: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // 1. Initialize Token from LocalStorage
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

  // 2. Initialize User SYNCHRONOUSLY
  const [user, setUser] = useState<User | null>(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      try {
        return jwtDecode<User>(storedToken);
      } catch (e) {
        console.error("Invalid token on startup", e);
        return null;
      }
    }
    return null;
  });

  // 3. Handle Token Updates (Keep this as is)
  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode<User>(token);
        setUser(decoded);
      } catch (e) {
        logout();
      }
    } else {
      setUser(null);
    }
  }, [token]);

  // ------------------------------------------------------------------
  // 4. NEW: Handle Socket Connection based on User state
  // ------------------------------------------------------------------
  useEffect(() => {
    if (user) {
      // User is logged in (or refreshed) -> Connect Socket
      // socketService.connect checks internally if it's already connected, so this is safe
      socketService.connect(user.id);
    } else {
      // User is logged out (or null) -> Disconnect Socket
      socketService.disconnect();
    }
  }, [user]); 
  // ------------------------------------------------------------------

  const login = (newToken: string) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    // No need to call socketService here manually, the useEffect([user]) above handles it
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    // socketService.disconnect() will be called automatically by the useEffect
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};