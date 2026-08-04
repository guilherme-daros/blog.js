"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface AdminHeaderData {
  title: ReactNode;
  actions: ReactNode;
}

interface AdminHeaderContextType {
  headerData: AdminHeaderData;
  setHeaderData: (data: AdminHeaderData) => void;
  isRealProvider?: boolean;
}

const AdminHeaderContext = createContext<AdminHeaderContextType | undefined>(undefined);

export function AdminHeaderProvider({ children }: { children: ReactNode }) {
  const [headerData, setHeaderData] = useState<AdminHeaderData>({
    title: "Dashboard",
    actions: null,
  });

  return (
    <AdminHeaderContext.Provider value={{ headerData, setHeaderData, isRealProvider: true }}>
      {children}
    </AdminHeaderContext.Provider>
  );
}

export function useAdminHeader() {
  const context = useContext(AdminHeaderContext);
  if (!context) {
    return {
      headerData: {
        title: "Dashboard",
        actions: null,
      },
      setHeaderData: () => {},
      isRealProvider: false,
    };
  }
  return context;
}
