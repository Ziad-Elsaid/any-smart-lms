import { Skeleton } from "@/components/ui/skeleton";
import { initialSignInFormData, initialSignUpFormData } from "@/config";
import { checkAuthService, loginService, registerService } from "@/services";
import { createContext, useEffect, useState } from "react";
import { toast } from "@/hooks/use-toast";

export const AuthContext = createContext(null);

export default function AuthProvider({ children }) {
  const [signInFormData, setSignInFormData] = useState(initialSignInFormData);
  const [signUpFormData, setSignUpFormData] = useState(initialSignUpFormData);
  const [auth, setAuth] = useState({
    authenticate: false,
    user: null,
  });
  const [loading, setLoading] = useState(true);

  async function handleRegisterUser(event) {
    event.preventDefault();
    
    try {
      const data = await registerService(signUpFormData);
      
      if (data.success) {
        toast({
          title: "Success",
          description: "Account created successfully! Please sign in.",
        });
        setSignUpFormData(initialSignUpFormData);
        return { success: true };
      } else {
        const errorMessage = data.message || "Failed to create account. Please try again.";
        return { success: false, message: errorMessage };
      }
    } catch (error) {
      console.log("Register error:", error);
      const errorMessage = error?.response?.data?.message || "Failed to create account. Please try again.";
      return { success: false, message: errorMessage };
    }
  }

  async function handleLoginUser(event) {
    event.preventDefault();
    
    try {
      const data = await loginService(signInFormData);
      console.log(data, "datadatadatadatadata");

      if (data.success) {
        localStorage.setItem(
          "accessToken",
          JSON.stringify(data.data.accessToken)
        );
        console.log("AuthContext saved token:", data.data.accessToken);
        setAuth({
          authenticate: true,
          user: data.data.user,
        });
        return { success: true };
      } else {
        const errorMessage = data.message || "Invalid email or password.";
        setAuth({
          authenticate: false,
          user: null,
        });
        return { success: false, message: errorMessage };
      }
    } catch (error) {
      console.log("Login error:", error);
      // Handle axios error response
      const errorMessage = error?.response?.data?.message || "Invalid email or password.";
      setAuth({
        authenticate: false,
        user: null,
      });
      return { success: false, message: errorMessage };
    }
  }

  //check auth user

  async function checkAuthUser() {
    // Check if token exists before making API call
    const token = localStorage.getItem("accessToken");
    
    if (!token) {
      console.log("No token found, skipping auth check");
      setAuth({
        authenticate: false,
        user: null,
      });
      setLoading(false);
      return;
    }

    try {
      const data = await checkAuthService();
      if (data.success) {
        setAuth({
          authenticate: true,
          user: data.data.user,
        });
        setLoading(false);
      } else {
        setAuth({
          authenticate: false,
          user: null,
        });
        setLoading(false);
      }
    } catch (error) {
      console.log("checkAuthUser error:", error);
      if (!error?.response?.data?.success) {
        setAuth({
          authenticate: false,
          user: null,
        });
        setLoading(false);
      }
    }
  }

  function resetCredentials() {
    setAuth({
      authenticate: false,
      user: null,
    });
  }

  useEffect(() => {
    checkAuthUser();
  }, []);

  console.log(auth, "gf");

  return (
    <AuthContext.Provider
      value={{
        signInFormData,
        setSignInFormData,
        signUpFormData,
        setSignUpFormData,
        handleRegisterUser,
        handleLoginUser,
        auth,
        setAuth,
        resetCredentials,
      }}
    >
      {loading ? <Skeleton /> : children}
    </AuthContext.Provider>
  );
}
