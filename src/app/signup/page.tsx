"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { signupSchema } from "../../lib/validation/authSchemas";

export default function SignUp() {
  const { signup } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const validated = signupSchema.parse(form);
      setLoading(true);

      // Sign up the user
      signup(validated.email, validated.password);

      // Send welcome email
      try {
        const userName = form.username || validated.email.split("@")[0];

        console.log("Sending welcome email to:", validated.email);

        const response = await fetch("/api/send-email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            to: validated.email,
            subject: "Welcome to Todo App! 🎉",
            text: `Hi ${userName},\n\nWelcome! Your account has been successfully created. Thank you for joining us!\n\nBest regards,\nTodo App Team`,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #6C63FF;">Welcome to Todo App!</h2>
                <p>Hi <strong>${userName}</strong>,</p>
                <p>Welcome! Your account has been successfully created. Thank you for joining us!</p>
                <p>You can now start organizing your tasks and boosting your productivity.</p>
                <hr style="border: 1px solid #eee; margin: 20px 0;" />
                <p style="color: #666; font-size: 14px;">Best regards,<br/>Todo App Team</p>
              </div>
            `,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          console.log("Welcome email sent successfully:", data);
        } else {
          console.error("Failed to send email:", data);
        }
      } catch (emailError) {
        console.error("Failed to send email:", emailError);
        // Don't block signup if email fails
      }

      setError(null);
      alert("Signed up successfully! Check your email for confirmation.");

      router.push("/");
    } catch (err: unknown) {
      if (err && typeof err === "object" && "errors" in err) {
        const zodError = err as { errors?: Array<{ message: string }> };
        setError(zodError.errors?.[0]?.message || "Something went wrong.");
      } else {
        setError("Something went wrong.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 max-w-sm w-full mx-auto p-6 border rounded-lg shadow-lg"
      >
        <h2 className="text-2xl font-bold text-center mb-2">Sign Up</h2>

        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="border rounded-lg px-3 py-3 focus:outline-none focus:ring-2 focus:ring-[#6C63FF]"
          required
        />
        <input
          name="username"
          type="text"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          className="border rounded-lg px-3 py-3 focus:outline-none focus:ring-2 focus:ring-[#6C63FF]"
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="border rounded-lg px-3 py-3 focus:outline-none focus:ring-2 focus:ring-[#6C63FF]"
          required
        />
        <input
          name="confirmPassword"
          type="password"
          placeholder="Confirm Password"
          value={form.confirmPassword}
          onChange={handleChange}
          className="border rounded-lg px-3 py-3 focus:outline-none focus:ring-2 focus:ring-[#6C63FF]"
          required
        />

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="bg-[#6C63FF] text-white py-3 rounded-lg hover:bg-[#5a54d3] transition-all disabled:opacity-60"
        >
          {loading ? "Creating Account..." : "Create Account"}
        </button>

        <p className="text-center text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{" "}
          <Link href="/signin" className="text-[#6C63FF] hover:underline">
            Sign In
          </Link>
        </p>
      </form>
    </div>
  );
}
