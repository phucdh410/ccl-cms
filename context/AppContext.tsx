"use client";
import { notification } from "antd";
import { createContext, useContext } from "react";

type NotificationType = "success" | "info" | "warning" | "error";

interface AppContextProps {
  openNotification: (
    type: NotificationType,
    message: string,
    description?: string
  ) => void;
}

export const AppContext = createContext({} as AppContextProps);

export const useAppContext = () => useContext(AppContext);

export const AppContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [api, contextHolder] = notification.useNotification();

  const openNotification = (
    type: NotificationType,
    message: string,
    description?: string
  ) => {
    api[type]({
      message,
      description,
    });
  };

  const contextValue: AppContextProps = {
    openNotification,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {contextHolder}
      {children}
    </AppContext.Provider>
  );
};
