"use client";
import { useEffect, useState } from "react";
import { validateJSON } from "../utils/json";

export default function SharePage({ params }: { params: { id: string } }) {
  const { id } = params;
  const [doc, setDoc] = useState<string | null>(null);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const isValid = validateJSON(text);

  async function load() {
    setLoading(true);
    const res = await fetch(`/api/blobs/${id}`);
    const json = await res.json();
    setDoc(json);
    setText(JSON.stringify(json.data, null, 2));
    setLoading(false);
  }

  async function save() {
    setLoading(true);
    await fetch(`/api/blobs/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: text,
    });
    await load();
  }

  async function remove() {
    await fetch(`/api/blobs/${id}`, { method: "DELETE" });
    setDoc(null);
  }

  useEffect(() => {
    load();
  }, [id]);

  if (!loading && !doc) return <p className="p-6">Ej hittad/borttagen.</p>;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Blob ID {id}</h1>
      <textarea
        className="w-full border p-2 mb-4 font-mono"
        rows={10}
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      {!isValid && !loading && (
        <p className="text-red-500 mb-4">Ogiltig JSON</p>
      )}

      <div className="flex gap-3">
        <button
          onClick={isValid ? save : undefined}
          className="text-blue-500"
          disabled={!isValid || loading}
        >
          Spara
        </button>
        <button onClick={remove} className="text-red-500">
          Radera
        </button>
      </div>
      <div className="mt-6">
        <p className="font-bold mb-2">Data</p>
        {loading ? (
          <div className="h-32 flex items-center justify-center">
            <span className="animate-wiggle text-5xl">🌭</span>
          </div>
        ) : (
          <pre className="bg-white/5 p-4">{JSON.stringify(doc, null, 2)}</pre>
        )}
      </div>
    </div>
  );
}
