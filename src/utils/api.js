const BASE = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

export async function request(path, { method = "GET", body, token, params } = {}) {
  const url = new URL(`${BASE}${path}`, window.location.origin);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        url.searchParams.set(key, value);
      }
    });
  }
  const headers = {};
  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (token) {
    headers["X-Auth-Token"] = token;
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  let data = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    throw new Error(data?.message || data?.error || `Erreur ${response.status}`);
  }
  return data;
}
