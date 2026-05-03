import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";

function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const fallbackName = form.email.split("@")[0] || "User";
      await api.post("/auth/register", {
        email: form.email,
        password: form.password,
        name: fallbackName,
      });
      const loginResponse = await api.post("/auth/login", {
        email: form.email,
        password: form.password,
      });
      localStorage.setItem("token", loginResponse.data.data.token);
      localStorage.setItem("user", JSON.stringify(loginResponse.data.data.user));
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-100 via-white to-violet-50/50 px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200/80 bg-white/95 p-8 shadow-xl shadow-indigo-900/10 backdrop-blur-sm">
        <h1 className="text-center text-2xl font-semibold tracking-tight text-slate-900">
          Create account
        </h1>
        <p className="mt-2 text-center text-sm text-slate-600">
          Sign up to upload PDFs and chat with your documents.
        </p>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
            placeholder="Email"
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400"
          />
          <input
            type="password"
            required
            value={form.password}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, password: e.target.value }))
            }
            placeholder="Password"
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400"
          />
          {error ? <p className="text-sm text-rose-500">{error}</p> : null}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 py-3 text-sm font-semibold text-white shadow-md shadow-indigo-900/15 transition hover:from-indigo-500 hover:to-violet-500 disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2"
          >
            {loading ? "Creating..." : "Create account"}
          </button>
        </form>
        <p className="mt-5 text-center text-sm text-slate-500">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-indigo-700 hover:text-indigo-800">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
