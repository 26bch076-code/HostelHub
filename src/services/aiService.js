/**
 * Frontend AI Service for HostelHub
 * Communicates with the secure server-side Gemma AI proxy at /api/ai/*
 * Never handles raw API keys or secrets on the client.
 */

export async function checkAIStatus() {
  try {
    const res = await fetch('/api/ai/status');
    if (!res.ok) {
      return { configured: false, message: 'AI proxy returned error status.' };
    }
    return await res.json();
  } catch (err) {
    return {
      configured: false,
      message: 'AI backend proxy is unreachable.'
    };
  }
}

export async function requestComplaintCategorization(description) {
  if (!description || !description.trim()) {
    throw new Error('Please write a complaint description first.');
  }

  try {
    const res = await fetch('/api/ai/categorize', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ description: description.trim() })
    });

    const data = await res.json();
    return data;
  } catch (err) {
    return {
      success: false,
      configured: false,
      error: 'NETWORK_ERROR',
      message: `Failed to connect to AI backend: ${err.message}`
    };
  }
}
