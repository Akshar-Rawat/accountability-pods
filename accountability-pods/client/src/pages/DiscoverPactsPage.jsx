import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../lib/axios";
import useAuthStore from "../stores/authStore";

export default function DiscoverPactsPage() {
  const [pacts, setPacts] = useState([]);
  const user = useAuthStore((state) => state.user);
  const [search, setSearch] = useState("");
  const [frequency, setFrequency] = useState("");
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");
  const load = useCallback(async () => {
    try {
      const response = await api.get("/pods/public", { params: { search, frequency: frequency || undefined } });
      setPacts(response.data.data);
      setError("");
    } catch { setError("Could not load public pacts. Please try again."); }
  }, [search, frequency]);
  useEffect(() => { const timer = setTimeout(load, 0); return () => clearTimeout(timer); }, [load]);
  const join = async (id) => {
    setBusy(id); setError("");
    try { await api.post(`/pods/public/${id}/join`); await load(); }
    catch (err) { setError(err.response?.data?.message || "Could not join this pact."); }
    finally { setBusy(""); }
  };
  return <section className="min-h-[calc(100vh-4rem)] bg-surface"><div className="mx-auto max-w-container px-5 py-12 md:px-16">
    <h1 className="text-headline-xl text-primary">Discover Pacts</h1><p className="mb-8 mt-2 text-body-lg text-on-surface-variant">Find a public pact and build consistency together.</p>
    <div className="mb-6 flex flex-col gap-3 sm:flex-row"><input aria-label="Search pacts" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search name or goal" className="flex-1 rounded-lg border border-outline-variant bg-surface-container-lowest px-4 py-3 text-on-surface" /><select aria-label="Filter by frequency" value={frequency} onChange={(e) => setFrequency(e.target.value)} className="rounded-lg border border-outline-variant bg-surface-container-lowest px-4 py-3 text-on-surface"><option value="">Any frequency</option>{["daily", "weekdays", "monthly", "custom"].map((item) => <option key={item}>{item}</option>)}</select></div>
    {error && <p role="alert" className="mb-4 text-error">{error}</p>}
    {!pacts.length ? <p className="rounded-xl border border-outline-variant bg-surface-container-lowest p-8 text-on-surface-variant">No public pacts found.</p> : <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{pacts.map((pact) => { const alreadyJoined = pact.members?.some((member) => String(member._id) === String(user?._id)); return <article key={pact._id} className="rounded-xl border border-outline-variant bg-surface-container-lowest p-6"><p className="text-label-caps uppercase text-secondary">{pact.frequency}</p><h2 className="mt-2 text-headline-md text-primary">{pact.name}</h2><p className="my-3 text-body-sm text-on-surface-variant">{pact.goal}</p><p className="mb-4 text-label-caps text-on-surface-variant">{pact.members?.length || 0} / {pact.maxMembers} members · {Math.max(0, pact.maxMembers - (pact.members?.length || 0))} spaces</p><button disabled={busy === pact._id || alreadyJoined || pact.members?.length >= pact.maxMembers} onClick={() => join(pact._id)} className="rounded-full bg-primary px-4 py-2 text-body-sm text-on-primary disabled:opacity-50">{busy === pact._id ? "Joining…" : alreadyJoined ? "Joined" : pact.members?.length >= pact.maxMembers ? "Full" : "Join pact"}</button></article>; })}</div>}
    <Link to="/pods/create" className="mt-8 inline-block text-body-sm text-primary underline">Create a pact</Link>
  </div></section>;
}
