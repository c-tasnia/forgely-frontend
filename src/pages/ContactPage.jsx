import { useState } from "react";
import { Spinner } from "../components/UI.jsx";

const ContactPage = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | sending | sent

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Name is required";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = "Enter a valid email";
    if (!form.message.trim()) errs.message = "Message can't be empty";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    setStatus("sending");
    setTimeout(() => setStatus("sent"), 800); // wire up to a real endpoint when the contact API exists
  };

  return (
    <div className="mx-auto max-w-lg px-4 py-16">
      <h1 className="mb-2 text-3xl font-bold">Contact us</h1>
      <p className="mb-6 text-sm text-slate-500 dark:text-slate-400">Questions, bugs, feedback — we read everything.</p>

      {status === "sent" ? (
        <div className="rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
          Thanks — we'll get back to you within a couple of days.
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Name</label>
            <input className="input-field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Email</label>
            <input type="email" className="input-field" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Message</label>
            <textarea rows={4} className="input-field" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
            {errors.message && <p className="mt-1 text-xs text-red-500">{errors.message}</p>}
          </div>
          <button type="submit" disabled={status === "sending"} className="btn-primary flex items-center gap-2">
            {status === "sending" && <Spinner />} Send message
          </button>
        </form>
      )}
    </div>
  );
};

export default ContactPage;
