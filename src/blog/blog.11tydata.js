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
      if (/^https?:\/\//.test(img)) return img;
      return `https://www.landandexpand.it${img.startsWith("/") ? "" : "/"}${img}`;
    },
  },
};
