import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { fetchAuthUser } from '../api/api';

// interface User {
//   id: number;
//   type: 'worker' | 'establishment' | 'department';
//   firstName: string;
//   middleName?: string;
//   lastName?: string;
//   fullName?: string;
//   emailId?: string;
//   mobileNumber?: number;
//   lastLoggedIn?: string;
// }

// export interface User {
//   id: number;                 // unique id for all
//   type: "worker" | "establishment" | "department";

//   // display info
//   fullName: string;
//   emailId?: string;
//   mobileNumber?: number;

//   // extra info depending on type
//   roleName?: string;           // for department
//   establishmentName?: string;  // for establishment
//   contactPerson?: string;      // for establishment
//   lastLoggedIn?: string | null;
// }

// Worker login response
export interface WorkerUser {
  type: "worker";
  id: number;
  firstName: string;
  middleName?: string;
  lastName: string;
  fullName: string;
  mobileNumber: number;
  emailId: string;
  lastLoggedIn?: string | null;
  establishmentId: number;
  estmtWorkerId: number;
  establishmentName: string;
  workLocation: string;
  status: string;
}

// Establishment login response
export interface EstablishmentUser {
  type: "establishment";
  establishmentId: number;
  establishmentName: string;
  mobileNumber: number;
  emailId: string;
  contactPerson: string;
  lastLoggedIn?: string | null;
}

// Department login response
export interface DepartmentUser {
  type: "department";
  departmentRoleId: number;
  roleName: string;
  roleDescription: string;
  departmentUserId: number;
  emailId: string;
  contactNumber: number;
  lastLoggedIn?: string | null;
}

export type User = WorkerUser | EstablishmentUser | DepartmentUser;



// Worker login response → User
// export function mapWorkerToUser(data: any): WorkerUser {
//   return {
//     id: data.id,
//     type: "worker",
//     fullName: data.fullName,
//     emailId: data.emailId,
//     mobileNumber: data.mobileNumber,
//     lastLoggedIn: data.lastLoggedIn,
//   };
// }

// // Establishment login response → User
// export function mapEstablishmentToUser(data: any): User {
//   return {
//     id: data.establishmentId,
//     type: "establishment",
//     fullName: data.establishmentName, // normalize to fullName
//     emailId: data.emailId,
//     mobileNumber: data.mobileNumber,
//     contactPerson: data.contactPerson,
//     lastLoggedIn: data.lastLoggedIn,
//     establishmentName: data.establishmentName,
//   };
// }

// // Department login response → User
// export function mapDepartmentToUser(data: any): User {
//   return {
//     departmentUserId: data.departmentUserId,
//     type: "department",
//     // fullName: data.roleName, // or roleName + " Dept"
//     emailId: data.emailId,
//     contactNumber: data.contactNumber,
//     roleName: data.roleName,
//     lastLoggedIn: data.lastLoggedIn,
//     roleDescription: data.roleDescription,
//   };
// }


export function mapWorkerToUser(data: any): WorkerUser {
  return {
    type: "worker",
    id: data.id,
    firstName: data.firstName,
    middleName: data.middleName,
    lastName: data.lastName,
    fullName: data.fullName,
    emailId: data.emailId,
    mobileNumber: data.mobileNumber,
    lastLoggedIn: data.lastLoggedIn,
    establishmentId: data.establishmentId,
    estmtWorkerId: data.estmtWorkerId,
    establishmentName: data.establishmentName,
    workLocation: data.workLocation,
    status: data.status,
  };
}

// Establishment login response → User
export function mapEstablishmentToUser(data: any): EstablishmentUser {
  return {
    type: "establishment",
    establishmentId: data.establishmentId,
    establishmentName: data.establishmentName,
    emailId: data.emailId,
    mobileNumber: data.mobileNumber,
    contactPerson: data.contactPerson,
    lastLoggedIn: data.lastLoggedIn,
  };
}

// Department login response → User
export function mapDepartmentToUser(data: any): DepartmentUser {
  return {
    type: "department",
    departmentRoleId: data.departmentRoleId,
    departmentUserId: data.departmentUserId,
    roleName: data.roleName,
    roleDescription: data.roleDescription,
    emailId: data.emailId,
    contactNumber: data.contactNumber,
    lastLoggedIn: data.lastLoggedIn,
  };
}


interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
  expiresAt?: number | null;   // 👈 add
  loading: boolean;            // 👈 add
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  // console.log(context, 'contenxt')
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const login = (userData: User) => {
    const expiresAt = Date.now() + 60 * 60 * 1000;
    setUser(userData);
    localStorage.setItem("authUser", JSON.stringify(userData));
    localStorage.setItem("authExpiry", expiresAt.toString());

    // Auto-set role for compatibility with useRole /AuthGuard
    if (userData.type) {
      localStorage.setItem('role', userData.type);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("authUser");
    localStorage.removeItem("authExpiry");
    sessionStorage.removeItem("session_token");
  };

  // Check for existing session on mount
  useEffect(() => {
    const initAuth = async () => {
      const params = new URLSearchParams(window.location.search);
      const sessionToken = params.get("session_token");
      if (sessionToken) {
        sessionStorage.setItem("session_token", sessionToken);
        params.delete("session_token");
        const cleanUrl = window.location.pathname + (params.toString() ? `?${params.toString()}` : "");
        window.history.replaceState({}, "", cleanUrl);
      }
      try {
        // 1. Check local storage first (legacy/mobile/quick load)
        const storedUser = localStorage.getItem("authUser");
        const storedExpiry = localStorage.getItem("authExpiry");
        let restored = false;

        if (storedUser && storedExpiry) {
          const expiryTime = parseInt(storedExpiry, 10);
          if (Date.now() < expiryTime) {
            try {
              const parsedUser = JSON.parse(storedUser);
              // Quick set to unblock UI
              setUser(parsedUser);
              restored = true;
            } catch (e) {
              console.error("Failed to parse local user", e);
            }
          } else {
            // Expired local session
            localStorage.removeItem("authUser");
            localStorage.removeItem("authExpiry");
          }
        }

        // 2. Validate/Fetch session from backend (SAML Source of Truth)
        // This is critical for SAML callback flow where localStorage is empty but backend has cookie.
        try {
          const remoteUser = await fetchAuthUser();

          // Backend returns: { nameID, role, name, establishmentId, ... }
          // We need to map 'role' to 'type' and create proper User object
          if (remoteUser && remoteUser.role) {
            let mappedUser: User | null = null;

            // Helper to generate numeric ID from string
            const generateNumericId = (str: string): number => {
              if (!str) return Date.now();
              let hash = 0;
              for (let i = 0; i < str.length; i++) {
                hash = ((hash << 5) - hash) + str.charCodeAt(i);
                hash = hash & hash; // Convert to 32bit integer
              }
              return Math.abs(hash);
            };

            // Map based on the 'role' field from SAML backend
            if (remoteUser.role === 'worker') {
              // Create WorkerUser from SAML response
              mappedUser = {
                type: 'worker',
                id: remoteUser.nameID ? generateNumericId(remoteUser.nameID) : Date.now(),
                firstName: remoteUser.name || 'Worker',
                middleName: '',
                lastName: '',
                fullName: remoteUser.name || 'Worker User',
                emailId: remoteUser.email || '',
                mobileNumber: 0,
                lastLoggedIn: new Date().toISOString(),
                establishmentId: remoteUser.establishmentId || 0,
                estmtWorkerId: 0,
                establishmentName: '',
                workLocation: '',
                status: 'active'
              } as WorkerUser;
            } else if (remoteUser.role === 'establishment') {
              mappedUser = {
                type: 'establishment',
                establishmentId: remoteUser.establishmentId || 0,
                establishmentName: remoteUser.name || 'Establishment',
                emailId: remoteUser.email || '',
                mobileNumber: 0,
                contactPerson: remoteUser.name || '',
                lastLoggedIn: new Date().toISOString()
              } as EstablishmentUser;
            } else if (remoteUser.role === 'department') {
              mappedUser = {
                type: 'department',
                departmentRoleId: 0,
                departmentUserId: remoteUser.nameID ? generateNumericId(remoteUser.nameID) : Date.now(),
                roleName: remoteUser.name || 'Department',
                roleDescription: '',
                emailId: remoteUser.email || '',
                contactNumber: 0,
                lastLoggedIn: new Date().toISOString()
              } as DepartmentUser;
            }

            if (mappedUser) {
              login(mappedUser); // This will update localStorage and State
              restored = true;
            }
          }
        } catch (serverError) {
          // If backend returns 401, that's fine, we are just not logged in.
          console.error("Failed to fetch remote user:", serverError);
          if (!restored) {
            // ensure clean state
            logout();
          }
        }

      } catch (error) {
        console.error("Auth init error", error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // Auto-logout effect
  useEffect(() => {
    if (!user) return;

    const expiryTime = Number(localStorage.getItem("authExpiry"));
    const remaining = expiryTime - Date.now();

    const timer = setTimeout(() => {
      logout();
    }, remaining > 0 ? remaining : 0);

    return () => clearTimeout(timer);
  }, [user]);

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated, loading }}>
      {children}
    </AuthContext.Provider>
  );
};