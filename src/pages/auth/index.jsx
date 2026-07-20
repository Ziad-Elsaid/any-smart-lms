import CommonForm from "@/components/common-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { signInFormControls, signUpFormControls } from "@/config";
import { AuthContext } from "@/context/auth-context";
import { GraduationCap, AlertCircle } from "lucide-react";
import { useContext, useState } from "react";
import { Link } from "react-router-dom";

function AuthPage() {
  const [activeTab, setActiveTab] = useState("signin");
  
  // Sign In: show errors only after clicking submit
  const [signInSubmitted, setSignInSubmitted] = useState(false);
  const [signInError, setSignInError] = useState("");
  const [signInLoading, setSignInLoading] = useState(false);
  
  // Sign Up: track which fields have been blurred (left) + backend error
  const [signUpTouched, setSignUpTouched] = useState({});
  const [signUpError, setSignUpError] = useState("");
  const [signUpLoading, setSignUpLoading] = useState(false);
  
  const {
    signInFormData,
    setSignInFormData,
    signUpFormData,
    setSignUpFormData,
    handleRegisterUser,
    handleLoginUser,
  } = useContext(AuthContext);

  function handleTabChange(value) {
    setActiveTab(value);
    setSignInSubmitted(false);
    setSignInError("");
    setSignUpTouched({});
    setSignUpError("");
  }

  // Simple email validation
  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  // ============ SIGN IN ============
  function getSignInError() {
    if (!signInFormData?.userEmail) return "Email is required";
    if (!isValidEmail(signInFormData.userEmail)) return "Please enter a valid email";
    if (!signInFormData?.password) return "Password is required";
    return "";
  }

  async function handleSignInSubmit(e) {
    e.preventDefault();
    setSignInSubmitted(true);
    const validationError = getSignInError();
    
    if (validationError) {
      setSignInError(validationError);
      return;
    }
    
    // No validation errors, call backend
    setSignInLoading(true);
    setSignInError("");
    
    const result = await handleLoginUser(e);
    setSignInLoading(false);
    
    if (result && !result.success) {
      setSignInError(result.message);
    }
  }

  // ============ SIGN UP ============
  function getSignUpErrors() {
    const errors = {};
    
    if (!signUpFormData?.userName) {
      errors.userName = "Username is required";
    } else if (signUpFormData.userName.length < 3) {
      errors.userName = "Username must be at least 3 characters";
    }
    
    if (!signUpFormData?.userEmail) {
      errors.userEmail = "Email is required";
    } else if (!isValidEmail(signUpFormData.userEmail)) {
      errors.userEmail = "Please enter a valid email";
    }
    
    if (!signUpFormData?.role) {
      errors.role = "Please select a role";
    }
    
    if (!signUpFormData?.password) {
      errors.password = "Password is required";
    } else if (signUpFormData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    } else if (!/(?=.*[a-zA-Z])(?=.*\d)/.test(signUpFormData.password)) {
      errors.password = "Password must contain at least one letter and one number";
    }
    
    if (!signUpFormData?.confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
    } else if (signUpFormData.password !== signUpFormData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }
    
    return errors;
  }

  const signUpErrors = getSignUpErrors();
  const isSignUpValid = Object.keys(signUpErrors).length === 0;

  // Only show errors for fields that have been touched (blurred)
  const visibleSignUpErrors = {};
  Object.keys(signUpErrors).forEach(key => {
    if (signUpTouched[key]) {
      visibleSignUpErrors[key] = signUpErrors[key];
    }
  });

  function handleSignUpBlur(fieldName) {
    setSignUpTouched(prev => ({ ...prev, [fieldName]: true }));
  }

  async function handleSignUpSubmit(e) {
    e.preventDefault();
    setSignUpError("");
    setSignUpLoading(true);
    
    const result = await handleRegisterUser(e);
    setSignUpLoading(false);
    
    if (result && !result.success) {
      setSignUpError(result.message);
    } else if (result && result.success) {
      // Switch to sign in tab after successful registration
      handleTabChange("signin");
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#F4F5F7]">
      <header className="px-4 lg:px-6 h-14 flex items-center border-b bg-white shadow-sm">
        <Link
          to={"/"}
          className="flex items-center justify-center text-[#1E4D2B]"
        >
          <GraduationCap className="h-8 w-8 mr-4" />
          <span className="font-extrabold text-xl">Any Smart</span>
        </Link>
      </header>

      <div className="flex items-center justify-center flex-1">
        <div className="flex flex-col w-full max-w-md px-4">
          {/* Tabs */}
          <div className="grid w-full grid-cols-2 h-10 rounded-lg bg-white p-1 text-gray-600 shadow-sm mb-6">
            <button
              className={`inline-flex items-center justify-center rounded-md px-3 py-1.5 text-sm font-medium transition-all ${
                activeTab === "signin"
                  ? "bg-[#1E4D2B] text-white shadow"
                  : "hover:bg-gray-100"
              }`}
              onClick={() => handleTabChange("signin")}
            >
              Sign In
            </button>

            <button
              className={`inline-flex items-center justify-center rounded-md px-3 py-1.5 text-sm font-medium transition-all ${
                activeTab === "signup"
                  ? "bg-[#1E4D2B] text-white shadow"
                  : "hover:bg-gray-100"
              }`}
              onClick={() => handleTabChange("signup")}
            >
              Sign Up
            </button>
          </div>

          {/* Sign In - errors show only after clicking submit */}
          {activeTab === "signin" && (
            <Card className="p-6 space-y-4 bg-white shadow-lg border-0">
              <CardHeader>
                <CardTitle className="text-[#1E4D2B] text-2xl text-center">
                  Welcome to the Engineering Learning Portal
                </CardTitle>
                <CardDescription className="text-gray-600 text-center">
                  Sign in to access your courses and lectures
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <CommonForm
                  formControls={signInFormControls}
                  buttonText={signInLoading ? "Signing in..." : "Sign In"}
                  formData={signInFormData}
                  setFormData={setSignInFormData}
                  isButtonDisabled={signInLoading}
                  handleSubmit={handleSignInSubmit}
                />
                {/* Error shows only after submit attempt */}
                {signInSubmitted && signInError && (
                  <div className="flex items-center gap-2 mt-3 p-3 bg-red-50 border border-red-200 rounded-md animate-in fade-in duration-200">
                    <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
                    <p className="text-sm text-red-600">{signInError}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Sign Up - errors show on blur (leaving field) */}
          {activeTab === "signup" && (
            <Card className="p-6 space-y-4 bg-white shadow-lg border-0">
              <CardHeader>
                <CardTitle className="text-[#1E4D2B]">
                  Create a new account
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Enter your details to get started
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <CommonForm
                  formControls={signUpFormControls}
                  buttonText={signUpLoading ? "Creating account..." : "Sign Up"}
                  formData={signUpFormData}
                  setFormData={setSignUpFormData}
                  isButtonDisabled={!isSignUpValid || signUpLoading}
                  handleSubmit={handleSignUpSubmit}
                  validationErrors={visibleSignUpErrors}
                  touchedFields={signUpTouched}
                  onFieldBlur={handleSignUpBlur}
                />
                {/* Field validation errors */}
                {Object.keys(visibleSignUpErrors).length > 0 && (
                  <div className="flex items-center gap-2 mt-3 p-3 bg-red-50 border border-red-200 rounded-md">
                    <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
                    <p className="text-sm text-red-600">
                      Please fix the errors above to continue
                    </p>
                  </div>
                )}
                {/* Backend error */}
                {signUpError && (
                  <div className="flex items-center gap-2 mt-3 p-3 bg-red-50 border border-red-200 rounded-md">
                    <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
                    <p className="text-sm text-red-600">{signUpError}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

export default AuthPage;
