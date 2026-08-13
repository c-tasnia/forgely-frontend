import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { Spinner } from "../components/UI.jsx";

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const errs = {};
    if (!form.email) errs.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = "Enter a valid email";
    if (!form.password) errs.password = "Password is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    if (!validate()) return;
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate("/dashboard");
    } catch (err) {
      setServerError(err.response?.data?.message || "Login failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setServerError("");
    setLoading(true);
    try {
      await login("demo@projectforge.dev", "demo1234");
      navigate("/dashboard");
    } catch (err) {
      setServerError("Demo account unavailable right now — seed the database first.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-md flex-col justify-center px-4 py-12">
      <h1 className="mb-1 text-2xl font-bold">Welcome back</h1>
      <p className="mb-6 text-sm text-slate-500 dark:text-slate-400">Log in to your ProjectForge workspace.</p>

      {serverError && (
        <div className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 dark:bg-red-900/30 dark:text-red-400">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div>
          <label htmlFor="email" className="mb-1 block text-sm font-medium">Email</label>
          <input
            id="email"
            type="email"
            className="input-field"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
        </div>
        <div>
          <label htmlFor="password" className="mb-1 block text-sm font-medium">Password</label>
          <input
            id="password"
            type="password"
            className="input-field"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
        </div>
        <button type="submit" disabled={loading} className="btn-primary flex w-full items-center justify-center gap-2">
          {loading ? <Spinner /> : "Log in"}
        </button>
      </form>

      <button onClick={handleDemoLogin} disabled={loading} className="btn-secondary mt-3 w-full">
        Try demo account
      </button>

      <div className="my-4 flex items-center gap-3 text-xs text-slate-400">
        <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
        or continue with
        <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
      </div>

      <div className="flex gap-3">
        <button className="btn-secondary flex-1" onClick={() => setServerError("Social login requires OAuth credentials to be configured.")}>
          Google
        </button>
        <button className="btn-secondary flex-1" onClick={() => setServerError("Social login requires OAuth credentials to be configured.")}>
          Facebook
        </button>
      </div>

      <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
        Don't have an account? <Link to="/register" className="font-medium text-primary">Sign up</Link>
      </p>
    </div>
  );
};

export default LoginPage;
