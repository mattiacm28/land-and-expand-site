// Dati applicati a tutti gli articoli in src/blog/*.md
module.exports = {
  layout: "article.njk",
  eleventyComputed: {
    // URL pulito /blog/<slug> servito da /blog/<slug>/index.html
    permalink: (data) => `/blog/${data.page.fileSlug}/index.html`,
    canonical: (data) => `https://www.landandexpand.it/blog/${data.page.fileSlug}`,
    metaTitle: (data) => `${data.seo_title || data.title} | Land and Expand`,
    metaDescription: (data) => data.description,
    ogTitle: (data) => data.title,
    ogType: () => "article",
    ogImage: (data) => {
      const img = data.og_image;
      if (!img) return "https://www.landandexpand.it/assets/og-image.png";
      // encodeURI: i nomi file caricati dal pannello possono avere spazi/virgole
      // (es. "Mercato pronto, visione industriale.png"); LinkedIn/Facebook
      // non leggono un og:image con spazi non codificati.
      if (/^https?:\/\//.test(img)) return encodeURI(decodeURI(img));
      return encodeURI(`https://www.landandexpand.it${img.startsWith("/") ? "" : "/"}${img}`);
    },
  },
};
