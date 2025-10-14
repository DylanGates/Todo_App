"use client";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

export default function SignInPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      login(email, password);

      // Check if login was successful
      const stored = localStorage.getItem("user");
      if (stored) {
        const user = JSON.parse(stored);
        if (user.email === email) {
          // Send email notification
          try {
            const userName = user.name || email.split("@")[0];

            console.log("Sending sign-in notification email to:", email);

            const response = await fetch("/api/send-email", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                to: email,
                subject: "Sign In Notification - Todo App",
                text: `Hi ${userName},\n\nWelcome back! You have successfully signed in to your account.\n\nIf this wasn't you, please secure your account immediately.\n\nBest regards,\nTodo App Team`,
                html: `
                  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #6C63FF;">Welcome Back! 👋</h2>
                    <p>Hi <strong>${userName}</strong>,</p>
                    <p>Welcome back! You have successfully signed in to your account.</p>
                    <p style="color: #666; font-size: 14px;">If this wasn't you, please secure your account immediately.</p>
                    <hr style="border: 1px solid #eee; margin: 20px 0;" />
                    <p style="color: #666; font-size: 14px;">Best regards,<br/>Todo App Team</p>
                  </div>
                `,
              }),
            });

            const data = await response.json();

            if (response.ok) {
              console.log("Sign-in email sent successfully:", data);
            } else {
              console.error("Failed to send email:", data);
            }
          } catch (emailError) {
            console.error("Failed to send email:", emailError);
            // Don't block the login if email fails
          }

          // Redirect to home page
          router.push("/");
        } else {
          setError("Invalid credentials. Please try again.");
        }
      } else {
        setError("No account found. Please sign up first.");
      }
    } catch (err) {
      setError("An error occurred during sign in.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <form
        onSubmit={handleLogin}
        className="flex flex-col gap-4 max-w-sm w-full mx-auto p-6 border rounded-lg shadow-lg"
      >
        <h2 className="text-2xl font-bold text-center mb-2">Sign In</h2>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-2 rounded-lg text-sm">
            {error}
          </div>
        )}

        <input
          className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6C63FF]"
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6C63FF]"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          className="bg-[#6C63FF] text-white p-3 rounded-lg hover:bg-[#5a54d3] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          type="submit"
          disabled={loading}
        >
          {loading ? "Signing In..." : "Sign In"}
        </button>

        <p className="text-center text-sm text-gray-600 dark:text-gray-400">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-[#6C63FF] hover:underline">
            Sign Up
          </Link>
        </p>
      </form>
    </div>
  );
}
