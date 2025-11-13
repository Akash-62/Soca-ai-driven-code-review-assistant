// Simple in-memory cache for LLM responses
// Reduces redundant API calls for identical prompts

interface CacheEntry {
  response: string;
  timestamp: number;
}

class ResponseCache {
  private cache: Map<string, CacheEntry> = new Map();
  private maxAge: number = 5 * 60 * 1000; // 5 minutes
  private maxSize: number = 50; // Max 50 cached responses

  private generateKey(prompt: string, systemPrompt: string, temperature: number): string {
    return `${systemPrompt}|${temperature}|${prompt}`.substring(0, 200);
  }

  get(prompt: string, systemPrompt: string, temperature: number): string | null {
    const key = this.generateKey(prompt, systemPrompt, temperature);
    const entry = this.cache.get(key);

    if (!entry) return null;

    // Check if expired
    if (Date.now() - entry.timestamp > this.maxAge) {
      this.cache.delete(key);
      return null;
    }

    return entry.response;
  }

  set(prompt: string, systemPrompt: string, temperature: number, response: string): void {
    // Evict oldest entries if cache is full
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey) this.cache.delete(firstKey);
    }

    const key = this.generateKey(prompt, systemPrompt, temperature);
    this.cache.set(key, {
      response,
      timestamp: Date.now(),
    });
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }
}

export const responseCache = new ResponseCache();
