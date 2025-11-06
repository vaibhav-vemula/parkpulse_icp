"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, User, MapPin, Shield, Save } from "lucide-react";
import WalletStatus from "@/components/WalletStatus";
import CustomCursor from "@/components/CustomCursor";
import { getPrincipal } from "@/lib/auth";

export default function ProfilePage() {
  const router = useRouter();
  const [principal, setPrincipal] = useState<string>("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    addressLine1: "",
    city: "",
    state: "",
    pincode: "",
    isGovernmentEmployee: false,
    pin: "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  useEffect(() => {
    loadProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadProfile() {
    try {
      const p = await getPrincipal();
      if (p && p !== "2vxsx-fae") {
        setPrincipal(p);

        // Load profile from API
        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
        const response = await fetch(`${apiUrl}/api/user/profile/${p}`);
        const data = await response.json();

        if (data.success && data.data) {
          setFormData({
            name: data.data.name || "",
            email: data.data.email || "",
            addressLine1: data.data.address_line1 || "",
            city: data.data.city || "",
            state: data.data.state || "",
            pincode: data.data.pincode || "",
            isGovernmentEmployee: data.data.is_government_employee || false,
            pin: data.data.pin || "",
          });
        }
      } else {
        router.push("/");
      }
    } catch (error) {
      console.error("Error loading profile:", error);
      router.push("/");
    }
  }

  function handleInputChange(field: string, value: string | boolean) {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  async function handleSave() {
    try {
      setIsSaving(true);
      setSaveMessage("");

      // Validate government employee PIN if checked
      if (formData.isGovernmentEmployee && !formData.pin) {
        setSaveMessage("Please enter the PIN sent by ParkPulse team");
        setIsSaving(false);
        return;
      }

      // Verify PIN is correct if government employee
      if (formData.isGovernmentEmployee && formData.pin !== "000000") {
        setSaveMessage("Error: Invalid PIN. Please enter the correct PIN sent by ParkPulse team");
        setIsSaving(false);
        return;
      }

      // Save to API
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
      const response = await fetch(`${apiUrl}/api/user/profile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          principal_id: principal,
          name: formData.name,
          email: formData.email,
          address_line1: formData.addressLine1,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          is_government_employee: formData.isGovernmentEmployee,
          pin: formData.pin,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSaveMessage("Profile saved successfully!");
        setTimeout(() => setSaveMessage(""), 3000);
      } else {
        setSaveMessage(data.error || "Error saving profile. Please try again.");
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      setSaveMessage("Error saving profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <>
      <CustomCursor />
      <div className="h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950">
        <WalletStatus />

        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="absolute top-6 left-6 z-20 group flex items-center gap-2 px-5 py-2.5 bg-slate-800/90 backdrop-blur-md text-gray-300 hover:text-white rounded-full border-2 border-emerald-500/30 hover:border-emerald-400 shadow-lg hover:shadow-emerald-500/25 transition-all duration-300 hover:bg-gradient-to-r hover:from-emerald-500 hover:to-teal-600"
        >
          <ArrowLeft
            size={18}
            className="group-hover:-translate-x-1 transition-transform duration-300"
            strokeWidth={2.5}
          />
          <span className="font-semibold text-sm">Back</span>
        </button>

        <div className="container mx-auto px-6 pt-24 pb-6 h-full flex flex-col">

          {/* Profile Card */}
          <div className="flex-1 overflow-y-auto scrollbar-hide">
            <div className="max-w-3xl mx-auto pb-6">
              <div className="bg-slate-900/50 backdrop-blur-xl border border-emerald-500/20 rounded-2xl shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border-b border-emerald-500/20 px-8 py-6">
                  <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                    <div className="p-2 bg-emerald-500/20 rounded-lg">
                      <User className="text-emerald-400" size={28} />
                    </div>
                    Profile Settings
                  </h1>
                  <p className="text-gray-400 text-sm">
                    Manage your personal information and account preferences
                  </p>
                </div>

                <div className="px-8 py-6 space-y-6">
                  {/* Wallet Address Section */}
                  <div>
                    <h2 className="text-sm font-semibold text-emerald-400 mb-3 uppercase tracking-wide">
                      Identity
                    </h2>
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-2">
                        Wallet Address
                      </label>
                      <div className="px-4 py-3 bg-slate-800/70 border border-emerald-500/30 rounded-lg text-gray-300 font-mono text-sm break-all">
                        {principal}
                      </div>
                    </div>
                  </div>

                  {/* Personal Information Section */}
                  <div className="border-t border-emerald-500/20 pt-6">
                    <h2 className="text-sm font-semibold text-emerald-400 mb-4 uppercase tracking-wide">
                      Personal Information
                    </h2>
                    <div className="space-y-4">

                      {/* Name */}
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) =>
                            handleInputChange("name", e.target.value)
                          }
                          placeholder="Enter your full name"
                          className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                        />
                      </div>

                      {/* Email */}
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Email Address
                        </label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) =>
                            handleInputChange("email", e.target.value)
                          }
                          placeholder="your.email@example.com"
                          className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Address Section */}
                  <div className="border-t border-emerald-500/20 pt-6">
                    <h2 className="text-sm font-semibold text-emerald-400 mb-4 uppercase tracking-wide flex items-center gap-2">
                      <MapPin size={16} />
                      Address
                    </h2>
                    <div className="space-y-4">
                      {/* Address Line 1 */}
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Street Address
                        </label>
                        <input
                          type="text"
                          value={formData.addressLine1}
                          onChange={(e) =>
                            handleInputChange("addressLine1", e.target.value)
                          }
                          placeholder="Enter your street address"
                          className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                        />
                      </div>

                      {/* City and State */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            City
                          </label>
                          <input
                            type="text"
                            value={formData.city}
                            onChange={(e) =>
                              handleInputChange("city", e.target.value)
                            }
                            placeholder="City"
                            className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            State
                          </label>
                          <input
                            type="text"
                            value={formData.state}
                            onChange={(e) =>
                              handleInputChange("state", e.target.value)
                            }
                            placeholder="State"
                            className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                          />
                        </div>
                      </div>

                      {/* Pincode */}
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Pincode / ZIP Code
                        </label>
                        <input
                          type="text"
                          value={formData.pincode}
                          onChange={(e) =>
                            handleInputChange("pincode", e.target.value)
                          }
                          placeholder="Enter pincode"
                          maxLength={6}
                          className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Government Employee Section */}
                  <div className="border-t border-emerald-500/20 pt-6">
                    <h2 className="text-sm font-semibold text-emerald-400 mb-4 uppercase tracking-wide flex items-center gap-2">
                      <Shield size={16} />
                      Special Access
                    </h2>

                    <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-5">
                      <label className="flex items-start gap-4 cursor-pointer group">
                        <div className="relative flex-shrink-0 mt-1">
                          <input
                            type="checkbox"
                            checked={formData.isGovernmentEmployee}
                            onChange={(e) =>
                              handleInputChange(
                                "isGovernmentEmployee",
                                e.target.checked
                              )
                            }
                            className="sr-only peer"
                          />
                          <div className="w-6 h-6 bg-slate-700 border-2 border-slate-600 rounded-md peer-checked:bg-emerald-500 peer-checked:border-emerald-400 transition-all flex items-center justify-center group-hover:border-emerald-500/50">
                            {formData.isGovernmentEmployee && (
                              <svg
                                className="w-4 h-4 text-white"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={3}
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            )}
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="text-white font-medium mb-1">
                            I am a Government Employee
                          </div>
                          <p className="text-sm text-gray-400">
                            Government employees have additional privileges including proposal creation and administrative access
                          </p>
                        </div>
                      </label>

                      {/* PIN Input (shows when government employee is checked) */}
                      {formData.isGovernmentEmployee && (
                        <div className="mt-5 pt-5 border-t border-emerald-500/20">
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Verification PIN
                          </label>
                          <input
                            type="password"
                            value={formData.pin}
                            onChange={(e) =>
                              handleInputChange("pin", e.target.value)
                            }
                            placeholder="Enter 6-digit PIN"
                            maxLength={6}
                            className="w-full px-4 py-3 bg-slate-800/50 border border-emerald-500/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20 transition-all font-mono tracking-widest text-center text-lg"
                          />
                          <p className="text-xs text-gray-400 mt-2 flex items-center gap-1.5">
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Enter the 6-digit PIN sent to your registered email by the ParkPulse team
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Save Button */}
                  <div className="border-t border-emerald-500/20 pt-6">
                    <button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <Save size={20} />
                      <span className="text-base">
                        {isSaving ? "Saving Changes..." : "Save Profile"}
                      </span>
                    </button>

                    {saveMessage && (
                      <div
                        className={`mt-4 p-4 rounded-lg text-center font-medium ${
                          saveMessage.includes("Error")
                            ? "bg-red-900/20 border border-red-500/50 text-red-300"
                            : "bg-emerald-900/20 border border-emerald-500/50 text-emerald-300"
                        }`}
                      >
                        <div className="flex items-center justify-center gap-2">
                          {saveMessage.includes("Error") ? (
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          ) : (
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          )}
                          <span>{saveMessage}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
