import { Octokit } from "octokit";

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

if (!process.env.GITHUB_TOKEN) {
  throw new Error("Missing GITHUB_TOKEN env");
}

function randomName(len = 8) {
  return crypto.randomUUID().replace(/-/g, "").slice(0, len);
}

export async function createBlob(data: unknown) {
  const filename = `${randomName()}.json`;
  const content = JSON.stringify(data);

  const { status, data: gist } = await octokit.request("POST /gists", {
    description: "snus",
    public: false,
    files: {
      [filename]: { content },
    },
  });

  if (status !== 201) {
    throw new Error(`Gist create failed: ${status}`);
  }

  return { id: gist.id as string, filename };
}

export async function readBlob(id: string) {
  const { status, data: gist } = await octokit.request("GET /gists/{gist_id}", {
    gist_id: id,
  });

  if (status !== 200) throw new Error(`Gist read failed: ${status}`);

  const files = gist.files ?? {};
  const entry = Object.values(files)[0] as any | undefined;

  if (!entry || !entry.raw_url) {
    throw new Error("Unexpected gist shape (no files)");
  }

  const raw = await fetch(entry.raw_url as string, { cache: "no-store" });
  if (raw.status === 404) return null;
  if (!raw.ok) throw new Error(`Raw fetch failed: ${raw.status}`);

  const json = await raw.json();
  return { id, filename: entry.filename as string, data: json };
}

export async function updateBlob(id: string, newData: unknown) {
  const info = await readBlob(id);
  if (!info) return null;

  const content = JSON.stringify(newData);
  const { status } = await octokit.request("PATCH /gists/{gist_id}", {
    gist_id: id,
    files: {
      [info.filename]: { content },
    },
  });

  if (status !== 200) throw new Error(`Gist update failed: ${status}`);

  return { id, filename: info.filename };
}

export async function deleteBlob(id: string) {
  const { status } = await octokit.request("DELETE /gists/{gist_id}", {
    gist_id: id,
  });

  if (status !== 204) throw new Error(`Gist delete failed: ${status}`);
  return true;
}
