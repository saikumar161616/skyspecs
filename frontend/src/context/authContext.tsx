// import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
// import { jwtDecode } from 'jwt-decode';

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
//   const [user, setUser] = useState<User | null>(null);
//   const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

//   useEffect(() => {
//     if (token) {
//       try {
//         const decoded = jwtDecode<User>(token);
//         setUser(decoded);
//       } catch (e) {
//         logout();
//       }
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



import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';

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

  // 2. Initialize User SYNCHRONOUSLY to prevent redirect on refresh
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

  // Keep the useEffect to handle token updates (e.g. login/logout actions)
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

  const login = (newToken: string) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
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