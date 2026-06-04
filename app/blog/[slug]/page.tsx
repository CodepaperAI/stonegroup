import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatDate, getBlog, readingTime } from "../../../lib/blogs";
import { sanitizeBlogHtml } from "../../../lib/sanitize";

export const dynamic = "force-dynamic";

const logoUrl =
  "https://www.stonegroup.ca/files/themeManager/16663/theme18/woodhouse transparent background.png";
const fallbackImage = "https://www.stonegroup.ca/files/flashbanner/444562/luxury-office.jpg";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    const blog = await getBlog(slug);
    const title = blog.meta?.seoTitle || blog.title;
    const description =
      blog.meta?.seoDescription || blog.excerpt || "Real estate insight from Woodhouse Realty in Surrey.";

    return {
      title,
      description,
      openGraph: {
        title: blog.meta?.ogTitle || title,
        description: blog.meta?.ogDescription || description,
        type: "article",
        images: blog.featuredImage
          ? [
              {
                url: blog.featuredImage,
                alt: blog.title
              }
            ]
          : undefined
      }
    };
  } catch {
    return {
      title: "Blog Article"
    };
  }
}

export default async function BlogDetail({ params }: PageProps) {
  const { slug } = await params;
  let blog;

  try {
    blog = await getBlog(slug);
  } catch {
    notFound();
  }

  const html = sanitizeBlogHtml(blog.content);
  const image = blog.featuredImage || fallbackImage;

  return (
    <>
      <header className="site-header site-header-light">
        <Link href="/" className="brand" aria-label="Woodhouse Realty blog home">
          <img src={logoUrl} alt="Woodhouse Realty" />
        </Link>
        <nav className="primary-nav" aria-label="Primary navigation">
          <Link href="/">Blog</Link>
          <a href="https://www.stonegroup.ca/listings">Listings</a>
          <a href="https://www.stonegroup.ca/buying">Buying</a>
          <a href="https://www.stonegroup.ca/selling">Selling</a>
          <a href="https://www.stonegroup.ca/node/add/contactSite">Contact</a>
        </nav>
        <a className="phone-link" href="tel:604-547-3338">
          604-547-3338
        </a>
      </header>

      <main>
        <article className="article-shell">
          <header className="article-hero">
            <Link href="/" className="back-link">
              Back to insights
            </Link>
            <div className="eyebrow-row article-eyebrow">
              <span>{blog.categories?.[0] || "Real Estate Insight"}</span>
              <span>{formatDate(blog.publishDate)}</span>
              <span>{readingTime(blog)}</span>
            </div>
            <h1>{blog.title}</h1>
            {blog.excerpt ? <p>{blog.excerpt}</p> : null}
            {blog.authorName ? <p className="author-line">By {blog.authorName}</p> : null}
          </header>
          <img src={image} alt="" className="article-image" />
          <div className="article-layout">
            <aside className="article-aside">
              <img src={logoUrl} alt="Woodhouse Realty" />
              <p>Need local context for this article?</p>
              <a href="https://www.stonegroup.ca/node/add/contactSite" className="button button-dark">
                Contact Us
              </a>
            </aside>
            <div className="article-content" dangerouslySetInnerHTML={{ __html: html }} />
          </div>
        </article>
      </main>
    </>
  );
}
