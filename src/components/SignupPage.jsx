import { useForm } from "react-hook-form";
import { signUp } from "../services/api";
import React, { useState } from "react";

export default function SignupPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();
  const [userdata, setUserData] = useState(null);

  const onSubmit = async (data) => {
    try {
        const res = await signUp(data);
      console.log("Success:", res);
      setUserData(res);
    } catch (error) {
      console.error("Signup failed", error);
      alert("Registration failed! Check console for details.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex items-center justify-center">
      <div className="bg-white p-8 rounded shadow-lg w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          Open Bank Account
        </h2>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {/* --- Personal Details --- */}

          {/* First Name */}
          <div>
            <label className="block text-sm font-medium">First Name</label>
            <input
              className="border p-2 w-full rounded"
              {...register("firstName", { required: "First Name is required" })}
            />
            {errors.firstName && (
              <small className="text-red-500">{errors.firstName.message}</small>
            )}
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-sm font-medium">Last Name</label>
            <input
              className="border p-2 w-full rounded"
              {...register("lastName", { required: "Last Name is required" })}
            />
            {errors.lastName && (
              <small className="text-red-500">{errors.lastName.message}</small>
            )}
          </div>

          {/* Username */}
          <div>
            <label className="block text-sm font-medium">Username</label>
            <input
              className="border p-2 w-full rounded"
              {...register("username", { required: "Username is required" })}
            />
            {errors.username && (
              <small className="text-red-500">{errors.username.message}</small>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium">Password</label>
            <input
              type="password"
              className="border p-2 w-full rounded"
              {...register("password", {
                required: "Password is required",
                minLength: { value: 6, message: "Min 6 characters" },
              })}
            />
            {errors.password && (
              <small className="text-red-500">{errors.password.message}</small>
            )}
          </div>

          {/* --- Contact Details --- */}

          {/* Email */}
          <div className="md:col-span-2">
            {" "}
            {/* Spans full width */}
            <label className="block text-sm font-medium">Email</label>
            <input
              className="border p-2 w-full rounded"
              {...register("email", {
                required: "Email is required",
                pattern: { value: /^\S+@\S+$/i, message: "Invalid email" },
              })}
            />
            {errors.email && (
              <small className="text-red-500">{errors.email.message}</small>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium">Phone</label>
            <input
              type="number"
              className="border p-2 w-full rounded"
              {...register("phone", {
                required: "Phone is required",
                minLength: { value: 10, message: "Must be 10 digits" },
                maxLength: { value: 10, message: "Must be 10 digits" },
              })}
            />
            {errors.phone && (
              <small className="text-red-500">{errors.phone.message}</small>
            )}
          </div>

          {/* Branch ID */}
          <div>
            <label className="block text-sm font-medium">Branch ID</label>
            <input
              type="number"
              className="border p-2 w-full rounded"
              {...register("branchId", { required: "Branch ID is required" })}
            />
            {errors.branchId && (
              <small className="text-red-500">{errors.branchId.message}</small>
            )}
          </div>

          {/* Address */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium">Address</label>
            <textarea
              className="border p-2 w-full rounded"
              rows="2"
              {...register("address", { required: "Address is required" })}
            />
            {errors.address && (
              <small className="text-red-500">{errors.address.message}</small>
            )}
          </div>

          {/* --- Legal Documents --- */}

          {/* Aadhar Number */}
          <div>
            <label className="block text-sm font-medium">Aadhar Number</label>
            <input
              className="border p-2 w-full rounded"
              {...register("aadharNumber", {
                required: "Aadhar is required",
                pattern: { value: /^[0-9]{12}$/, message: "Must be 12 digits" },
              })}
            />
            {errors.aadharNumber && (
              <small className="text-red-500">
                {errors.aadharNumber.message}
              </small>
            )}
          </div>

          {/* PAN Number */}
          <div>
            <label className="block text-sm font-medium">PAN Number</label>
            <input
              className="border p-2 w-full rounded uppercase"
              {...register("panNumber", {
                required: "PAN is required",
                pattern: {
                  value: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
                  message: "Invalid PAN format",
                },
              })}
            />
            {errors.panNumber && (
              <small className="text-red-500">{errors.panNumber.message}</small>
            )}
          </div>

          {/* Submit Button */}
          <div className="md:col-span-2 mt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700 font-bold transition"
            >
              {isSubmitting ? "Processing Application..." : "Open Account"}
            </button>
          </div>
        </form>

        {userdata && (
          <div className="mt-8 p-6 bg-slate-800 text-green-400 rounded-lg w-full max-w-2xl overflow-auto shadow-xl">
            <h3 className="text-xl font-bold border-b border-gray-600 pb-2 mb-4">
              Backend Response (Live):
            </h3>
            <pre className="text-sm font-mono">
              {JSON.stringify(userdata, null, 2)}
            </pre>
          </div>
        )}
        {/* ----------------------------- */}
      </div>
    </div>
  );
}
