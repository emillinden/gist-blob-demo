"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { validateJSON } from "./utils/json";

export default function HomePage() {
  const router = useRouter();
  const [data, setData] = useState('{"foo": "bar"}');
  const isValid = validateJSON(data);

  async function createBlob() {
    const res = await fetch("/api/blobs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: data || "{}",
    });

    const json = await res.json();
    router.push(`/${json.id}`);
  }

  return (
    <div className="p-6 max-w-lg mx-auto">
      <textarea
        className="w-full border p-2 mb-4"
        rows={5}
        value={data}
        onChange={(e) => setData(e.target.value)}
      />

      {!isValid && <p className="text-red-500 mb-4">Ogiltig JSON</p>}

      <button
        onClick={isValid ? createBlob : undefined}
        className="text-blue-500"
        disabled={!isValid}
      >
        Skapa
      </button>
    </div>
  );
}
