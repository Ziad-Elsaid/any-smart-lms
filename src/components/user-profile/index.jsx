import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/context/auth-context";
import { updateUserService, changePasswordService } from "@/services";
import { useToast } from "@/hooks/use-toast";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { User, Mail, Phone, Shield, Lock, Eye, EyeOff, AlertCircle, CheckCircle } from "lucide-react";

function UserProfile() {
  const { auth, setAuth } = useContext(AuthContext);
  const { toast } = useToast();
  
  // Profile form state
  const [profileData, setProfileData] = useState({
    userName: "",
    phoneNumber: "",
  });
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);

  // Password form state
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [passwordTouched, setPasswordTouched] = useState({});

  useEffect(() => {
    if (auth?.user) {
      setProfileData({
        userName: auth.user.userName || "",
        phoneNumber: auth.user.phoneNumber || "",
      });
    }
  }, [auth.user]);

  // Profile update handler
  async function handleProfileUpdate(e) {
    e.preventDefault();
    setProfileLoading(true);
    setProfileSuccess(false);

    try {
      const result = await updateUserService(auth?.user?._id, profileData);

      if (result?.success) {
        setAuth((prev) => ({
          ...prev,
          user: { ...prev.user, ...result.data },
        }));
        setProfileSuccess(true);
        toast({
          title: "Profile updated successfully",
        });
        setTimeout(() => setProfileSuccess(false), 3000);
      } else {
        toast({
          title: result?.message || "Failed to update profile",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: error?.response?.data?.message || "Failed to update profile",
        variant: "destructive",
      });
    }
    
    setProfileLoading(false);
  }

  // Password validation
  function getPasswordErrors() {
    const errors = {};
    
    if (!passwordData.currentPassword) {
      errors.currentPassword = "Current password is required";
    }
    
    if (!passwordData.newPassword) {
      errors.newPassword = "New password is required";
    } else if (passwordData.newPassword.length < 6) {
      errors.newPassword = "Password must be at least 6 characters";
    } else if (!/(?=.*[a-zA-Z])(?=.*\d)/.test(passwordData.newPassword)) {
      errors.newPassword = "Password must contain at least one letter and one number";
    }
    
    if (!passwordData.confirmPassword) {
      errors.confirmPassword = "Please confirm your new password";
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }
    
    return errors;
  }

  const passwordErrors = getPasswordErrors();
  const isPasswordFormValid = Object.keys(passwordErrors).length === 0;

  // Show only touched field errors
  const visiblePasswordErrors = {};
  Object.keys(passwordErrors).forEach(key => {
    if (passwordTouched[key]) {
      visiblePasswordErrors[key] = passwordErrors[key];
    }
  });

  function handlePasswordBlur(field) {
    setPasswordTouched(prev => ({ ...prev, [field]: true }));
  }

  // Password change handler
  async function handlePasswordChange(e) {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess(false);
    
    // Mark all fields as touched
    setPasswordTouched({
      currentPassword: true,
      newPassword: true,
      confirmPassword: true,
    });

    if (!isPasswordFormValid) {
      return;
    }

    setPasswordLoading(true);

    try {
      const result = await changePasswordService(auth?.user?._id, {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      if (result?.success) {
        setPasswordSuccess(true);
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        setPasswordTouched({});
        toast({
          title: "Password changed successfully",
        });
        setTimeout(() => setPasswordSuccess(false), 3000);
      } else {
        setPasswordError(result?.message || "Failed to change password");
      }
    } catch (error) {
      setPasswordError(error?.response?.data?.message || "Failed to change password");
    }
    
    setPasswordLoading(false);
  }

  function togglePasswordVisibility(field) {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  }

  const inputClasses = "bg-white border border-gray-300 focus:border-[#1E4D2B] focus:ring-2 focus:ring-[#1E4D2B]/20";
  const inputErrorClasses = "border-red-400 focus:border-red-500 focus:ring-red-200";

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Profile Settings */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-[#1E4D2B]/10 flex items-center justify-center">
            <User className="w-5 h-5 text-[#1E4D2B]" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Profile Settings</h2>
            <p className="text-sm text-gray-500">Manage your account information</p>
          </div>
        </div>

        <form onSubmit={handleProfileUpdate} className="space-y-4">
          {/* User Name */}
          <div className="space-y-2">
            <Label htmlFor="userName" className="text-sm font-medium text-gray-700">
              User Name
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="userName"
                value={profileData.userName}
                onChange={(e) => setProfileData(prev => ({ ...prev, userName: e.target.value }))}
                className={`${inputClasses} pl-10`}
                placeholder="Enter your name"
              />
            </div>
          </div>

          {/* Email (Read-only) */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                value={auth?.user?.userEmail || ""}
                readOnly
                disabled
                className="pl-10 bg-gray-50 text-gray-500 cursor-not-allowed"
              />
            </div>
            <p className="text-xs text-gray-400">Email cannot be changed</p>
          </div>

          {/* Phone Number */}
          <div className="space-y-2">
            <Label htmlFor="phoneNumber" className="text-sm font-medium text-gray-700">
              Phone Number
            </Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="phoneNumber"
                type="tel"
                value={profileData.phoneNumber}
                onChange={(e) => setProfileData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                className={`${inputClasses} pl-10`}
                placeholder="Enter your phone number"
              />
            </div>
          </div>

          {/* Role (Read-only) */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">Role</Label>
            <div className="relative">
              <Shield className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                value={auth?.user?.role ? auth.user.role.charAt(0).toUpperCase() + auth.user.role.slice(1) : ""}
                readOnly
                disabled
                className="pl-10 bg-gray-50 text-gray-500 cursor-not-allowed"
              />
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={profileLoading}
            className="w-full bg-[#1E4D2B] hover:bg-[#173E23] text-white mt-4"
          >
            {profileLoading ? "Saving..." : profileSuccess ? (
              <span className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" /> Saved!
              </span>
            ) : "Save Changes"}
          </Button>
        </form>
      </div>

      {/* Password Change */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-[#1E4D2B]/10 flex items-center justify-center">
            <Lock className="w-5 h-5 text-[#1E4D2B]" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Change Password</h2>
            <p className="text-sm text-gray-500">Update your password for security</p>
          </div>
        </div>

        <form onSubmit={handlePasswordChange} className="space-y-4">
          {/* Current Password */}
          <div className="space-y-2">
            <Label htmlFor="currentPassword" className={`text-sm font-medium ${visiblePasswordErrors.currentPassword ? 'text-red-600' : 'text-gray-700'}`}>
              Current Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="currentPassword"
                type={showPasswords.current ? "text" : "password"}
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                onBlur={() => handlePasswordBlur("currentPassword")}
                className={`${inputClasses} ${visiblePasswordErrors.currentPassword ? inputErrorClasses : ''} pl-10 pr-10`}
                placeholder="Enter current password"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("current")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {visiblePasswordErrors.currentPassword && (
              <p className="text-xs text-red-500">{visiblePasswordErrors.currentPassword}</p>
            )}
          </div>

          {/* New Password */}
          <div className="space-y-2">
            <Label htmlFor="newPassword" className={`text-sm font-medium ${visiblePasswordErrors.newPassword ? 'text-red-600' : 'text-gray-700'}`}>
              New Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="newPassword"
                type={showPasswords.new ? "text" : "password"}
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                onBlur={() => handlePasswordBlur("newPassword")}
                className={`${inputClasses} ${visiblePasswordErrors.newPassword ? inputErrorClasses : ''} pl-10 pr-10`}
                placeholder="Enter new password (min 6 characters)"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("new")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {visiblePasswordErrors.newPassword && (
              <p className="text-xs text-red-500">{visiblePasswordErrors.newPassword}</p>
            )}
          </div>

          {/* Confirm New Password */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className={`text-sm font-medium ${visiblePasswordErrors.confirmPassword ? 'text-red-600' : 'text-gray-700'}`}>
              Confirm New Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="confirmPassword"
                type={showPasswords.confirm ? "text" : "password"}
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                onBlur={() => handlePasswordBlur("confirmPassword")}
                className={`${inputClasses} ${visiblePasswordErrors.confirmPassword ? inputErrorClasses : ''} pl-10 pr-10`}
                placeholder="Confirm new password"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("confirm")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {visiblePasswordErrors.confirmPassword && (
              <p className="text-xs text-red-500">{visiblePasswordErrors.confirmPassword}</p>
            )}
          </div>

          {/* Backend Error */}
          {passwordError && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md">
              <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
              <p className="text-sm text-red-600">{passwordError}</p>
            </div>
          )}

          {/* Success Message */}
          {passwordSuccess && (
            <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-md">
              <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
              <p className="text-sm text-green-600">Password changed successfully!</p>
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={passwordLoading || !isPasswordFormValid}
            className="w-full bg-[#1E4D2B] hover:bg-[#173E23] text-white mt-4 disabled:bg-[#1E4D2B]/50"
          >
            {passwordLoading ? "Changing Password..." : "Change Password"}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default UserProfile;
