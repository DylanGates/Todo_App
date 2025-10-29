"use client";
import { useState } from "react";
import Link from "next/link";

export default function TestEmail() {
  const [testEmail, setTestEmail] = useState("");
  const [status, setStatus] = useState("Ready to test email functionality");
  const [loading, setLoading] = useState(false);

  const sendTestEmail = async () => {
    if (!testEmail) {
      alert("Please enter an email address");
      return;
    }

    setLoading(true);
    setStatus("📧 Sending email...");

    try {
      console.log("Sending test email to:", testEmail);

      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: testEmail,
          subject: "Test Email from Todo App",
          text: "This is a test email from your Todo App. If you received this, the email functionality is working correctly!",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #6C63FF;">Test Email ✉️</h2>
              <p>This is a test email from your Todo App.</p>
              <p>If you received this, the email functionality is working correctly! 🎉</p>
              <hr style="border: 1px solid #eee; margin: 20px 0;" />
              <p style="color: #666; font-size: 14px;">Best regards,<br/>Todo App Team</p>
            </div>
          `,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Email sent successfully:", data);
        setStatus(
          "✅ Email sent successfully! Check your inbox (and spam folder)"
        );
        alert("Success! Email sent. Check your inbox.");
      } else {
        console.error("Failed to send email:", data);
        setStatus(`❌ Failed to send email: ${data.error || "Unknown error"}`);
        alert(`Failed to send email: ${data.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error sending email:", error);
      setStatus("❌ Error sending email. Check console for details.");
      alert("Error sending email. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="max-w-md w-full space-y-6 border rounded-lg p-8 shadow-lg">
        <div>
          <h1 className="text-3xl font-bold text-center mb-2">
            Email Test Page
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
            Test your Nodemailer email configuration
          </p>
        </div>

        <div className="space-y-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <h3 className="font-semibold mb-2">Email Configuration:</h3>
            <div className="text-sm space-y-1">
              <p>
                Service:{" "}
                <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                  Nodemailer (Gmail)
                </code>
              </p>
              <p>
                Status:{" "}
                <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                  Ready
                </code>
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                Configure your Gmail credentials in .env.local
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Your Email Address:
            </label>
            <input
              type="email"
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              placeholder="your-email@example.com"
              className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#6C63FF]"
            />
          </div>

          <button
            onClick={sendTestEmail}
            disabled={loading}
            className="w-full bg-[#6C63FF] text-white py-3 rounded-lg hover:bg-[#5a54d3] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Sending..." : "Send Test Email"}
          </button>

          {status && (
            <div className="bg-gray-50 dark:bg-gray-800 border rounded-lg p-4">
              <p className="text-sm">{status}</p>
            </div>
          )}
        </div>

        <div className="border-t pt-4">
          <h3 className="font-semibold mb-2">Troubleshooting:</h3>
          <ul className="text-sm space-y-1 text-gray-600 dark:text-gray-400">
            <li>• Check browser console (F12) for detailed logs</li>
            <li>• Configure EMAIL_USER and EMAIL_PASSWORD in .env.local</li>
            <li>• For Gmail: Use App Password (not regular password)</li>
            <li>
              • Enable 2FA, then create App Password at:
              myaccount.google.com/apppasswords
            </li>
            <li>• Check spam/junk folder after sending</li>
            <li>• Restart dev server after changing .env.local</li>
          </ul>
        </div>

        <div className="text-center">
          <Link href="/" className="text-[#6C63FF] hover:underline text-sm">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
