// Motore statico del sito Land and Expand.
// Genera le pagine del blog dai contenuti scritti nel pannello /admin (Sveltia CMS),
// mantenendo identica la grafica attuale (stesso styles.css, nav e footer).

module.exports = function (eleventyConfig) {
  // --- File statici copiati senza modifiche (grafica, landing, pagine legali) ---
  eleventyConfig.addPassthroughCopy({ "src/styles.css": "styles.css" });
  eleventyConfig.addPassthroughCopy({ "src/script.js": "script.js" });
  eleventyConfig.addPassthroughCopy({ "src/index.html": "index.html" });
  eleventyConfig.addPassthroughCopy({ "src/privacy.html": "privacy.html" });
  eleventyConfig.addPassthroughCopy({ "src/termini.html": "termini.html" });
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  eleventyConfig.addPassthroughCopy({ "src/admin": "admin" });
  eleventyConfig.addPassthroughCopy({ "src/_redirects": "_redirects" });
  eleventyConfig.addPassthroughCopy({ "src/robots.txt": "robots.txt" });

  // --- Markdown: lascia passare l'HTML inserito nel testo (pull-quote, box, ecc.) ---
  eleventyConfig.amendLibrary("md", (md) => md.set({ html: true, breaks: false, linkify: false }));

  // --- Collezione articoli del blog, dal più recente al più vecchio ---
  eleventyConfig.addCollection("post", (api) =>
    api
      .getFilteredByGlob("src/blog/*.md")
      .filter((p) => p.data.published !== false)
      .sort((a, b) => b.date - a.date)
  );

  // --- Data in italiano: "Novembre 2026" ---
  eleventyConfig.addFilter("itMonthYear", (date) => {
    const d = date instanceof Date ? date : new Date(date);
    const s = new Intl.DateTimeFormat("it-IT", {
      month: "long",
      year: "numeric",
      timeZone: "UTC",
    }).format(d);
    return s.charAt(0).toUpperCase() + s.slice(1);
  });

  // --- Minuti di lettura stimati (fallback se non indicati a mano) ---
  eleventyConfig.addFilter("readingTime", (htmlOrText) => {
    const text = String(htmlOrText || "").replace(/<[^>]+>/g, " ");
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.round(words / 200));
  });

  // --- Le citazioni in evidenza (blockquote) diventano il box viola ".pull" ---
  eleventyConfig.addTransform("pullQuotes", function (content) {
    if ((this.page.outputPath || "").endsWith(".html")) {
      return content
        .replace(/<blockquote>/g, '<div class="pull">')
        .replace(/<\/blockquote>/g, "</div>");
    }
    return content;
  });

  return {
    dir: { input: "src", includes: "_includes", data: "_data", output: "_site" },
    templateFormats: ["njk", "md"],
    markdownTemplateEngine: false,
    htmlTemplateEngine: "njk",
  };
};
