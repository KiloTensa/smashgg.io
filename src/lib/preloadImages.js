export async function preloadImages(urls = []) {
  const unique = Array.from(new Set(urls.filter(Boolean)));
  const CONCURRENCY_LIMIT = 6;
  
  for (let i = 0; i < unique.length; i += CONCURRENCY_LIMIT) {
    const chunk = unique.slice(i, i + CONCURRENCY_LIMIT);
    await Promise.all(chunk.map((u) => new Promise((res) => {
      const img = new Image();
      img.onload = img.onerror = () => res();
      img.src = u;
    })));
  }
}

export default preloadImages;