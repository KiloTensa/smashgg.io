export function preloadImages(urls = []) {
  const unique = Array.from(new Set(urls.filter(Boolean)));
  const promises = unique.map((u) => new Promise((res) => {
    try {
      const img = new Image();
      img.onload = img.onerror = () => res();
      img.src = u;
    } catch (e) {
      // ignore
      res();
    }
  }));

  return Promise.all(promises);
}

export default preloadImages;
