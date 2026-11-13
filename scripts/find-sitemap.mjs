async function checkSitemap() {
  const sitemaps = [
    "https://www.jaxicloud.com/sitemap_index.xml",
    "https://www.jaxicloud.com/page-sitemap.xml",
    "https://www.jaxicloud.com/post-sitemap.xml",
    "https://www.jaxicloud.com/en/page-sitemap.xml"
  ];
  for (const url of sitemaps) {
    try {
      const res = await fetch(url);
      console.log(`=== ${url} status ${res.status} ===`);
      if (res.status === 200) {
        const text = await res.text();
        const urls = [...text.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => m[1]);
        console.log(`Found ${urls.length} URLs in ${url}`);
        urls.forEach(u => console.log('  ', u));
      }
    } catch (e) {
      console.error(`Failed ${url}: ${e.message}`);
    }
  }
}
checkSitemap();
