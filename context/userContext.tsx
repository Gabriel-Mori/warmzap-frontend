"use client";

import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

interface UserData {
  id?: string;
  name?: string;
  email?: string;
  [key: string]: any;
}

interface UserContextType {
  userData: UserData;
  putUserData: (userInfo: UserData) => Promise<void>;
  logout: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [userData, setUserData] = useState<UserData>({});

  const putUserData = async (userInfo: UserData) => {
    setUserData(userInfo);
    await localStorage.setItem("warmzap:userData", JSON.stringify(userInfo));
  };

  const logout = async () => {
    await localStorage.removeItem("warmzap:userData");
    setUserData({});
  };

  useEffect(() => {
    const loadUserData = async () => {
      const customerInfo = localStorage.getItem("warmzap:userData");
      if (customerInfo) {
        setUserData(JSON.parse(customerInfo));
      }
    };
    loadUserData();
  }, []);

  return (
    <UserContext.Provider value={{ userData, putUserData, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
