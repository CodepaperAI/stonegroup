import sanitizeHtml from "sanitize-html";

export function sanitizeBlogHtml(html?: string | null) {
  return sanitizeHtml(html || "", {
    allowedTags: [
      "p",
      "br",
      "strong",
      "em",
      "b",
      "i",
      "u",
      "a",
      "ul",
      "ol",
      "li",
      "h2",
      "h3",
      "h4",
      "blockquote",
      "img",
      "figure",
      "figcaption",
      "table",
      "thead",
      "tbody",
      "tr",
      "th",
      "td",
      "code",
      "pre"
    ],
    allowedAttributes: {
      a: ["href", "name", "target", "rel"],
      img: ["src", "alt", "width", "height", "loading", "decoding"],
      h2: ["id"],
      h3: ["id"],
      h4: ["id"],
      p: ["class"],
      table: ["class"]
    },
    allowedSchemes: ["http", "https", "mailto", "tel"],
    transformTags: {
      a: sanitizeHtml.simpleTransform("a", {
        rel: "noopener noreferrer",
        target: "_blank"
      }),
      img: sanitizeHtml.simpleTransform("img", {
        loading: "lazy",
        decoding: "async"
      })
    }
  });
}
