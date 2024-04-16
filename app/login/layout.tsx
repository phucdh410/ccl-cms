import { PropsWithChildren } from "react";

const LoginLayout: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="h-screen w-screen flex items-center justify-center bg-[url('/login-bg.jpg')] bg-no-repeat bg-center bg-cover">
      {children}
    </div>
  );
};

export default LoginLayout;
