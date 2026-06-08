import Link from "next/link";
import { getBlogs, formatDate, type BlogSummary } from "../lib/blogs";

export const dynamic = "force-dynamic";

const logoUrl =
  "https://www.stonegroup.ca/files/themeManager/16663/theme18/woodhouse transparent background.png";
const heroImage = "https://www.stonegroup.ca/files/flashbanner/444562/luxury-office.jpg";

type PageProps = {
  searchParams?: Promise<{
    page?: string;
  }>;
};

function getPageNumber(value?: string) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : 1;
}

function categoryList(blogs: BlogSummary[]) {
  return Array.from(new Set(blogs.flatMap((blog) => blog.categories || []))).slice(0, 8);
}

function imageFor(blog?: BlogSummary) {
  return blog?.featuredImage || heroImage;
}

function metaLine(blog: BlogSummary) {
  return `${formatDate(blog.publishDate)} / ${blog.authorName || "Woodhouse Realty"}`;
}

function labelFor(blog?: BlogSummary) {
  return blog?.categories?.[0] || "Real Estate";
}

function excerptFor(blog?: BlogSummary) {
  return blog?.excerpt || "Local guidance for buying, selling, and planning your next real estate move.";
}

function TopStory({ blog }: { blog: BlogSummary }) {
  return (
    <Link href={`/blog/${blog.slug}`} className="top-story">
      <img src={imageFor(blog)} alt="" />
      <div>
        <p>{metaLine(blog)}</p>
        <h2>{blog.title}</h2>
      </div>
    </Link>
  );
}

function HeroFeature({ blog }: { blog: BlogSummary }) {
  return (
    <Link href={`/blog/${blog.slug}`} className="hero-feature">
      <img src={imageFor(blog)} alt="" />
      <div className="hero-feature-scrim" />
      <span className="post-pill">{labelFor(blog)}</span>
      <div className="sponsored-pill">Woodhouse Insight</div>
      <div className="hero-feature-copy">
        <p>{metaLine(blog)}</p>
        <h1>{blog.title}</h1>
      </div>
    </Link>
  );
}

function LatestPost({ blog }: { blog: BlogSummary }) {
  return (
    <article className="latest-post">
      <Link href={`/blog/${blog.slug}`} className="latest-image">
        <img src={imageFor(blog)} alt="" />
        <span className="post-pill">{labelFor(blog)}</span>
      </Link>
      <p className="post-meta">{metaLine(blog)}</p>
      <h3>
        <Link href={`/blog/${blog.slug}`}>{blog.title}</Link>
      </h3>
      <p>{excerptFor(blog)}</p>
    </article>
  );
}

export default async function Home({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = getPageNumber(params?.page);
  const { blogs, pagination } = await getBlogs(page, 9);
  const [leadBlog] = blogs;
  const categories = categoryList(blogs);
  const topStories = blogs.slice(1, 4);
  const latestPosts = blogs.slice(0, 6);
  const galleryImages = blogs.slice(0, 3);

  return (
    <>
      <header className="magazine-header">
        <a href="https://www.stonegroup.ca/" className="magazine-brand" aria-label="Woodhouse Realty home">
          <img src={logoUrl} alt="Woodhouse Realty" />
        </a>
        <nav className="magazine-nav" aria-label="Primary navigation">
          <a href="https://www.stonegroup.ca/">Home</a>
          <a href="#latest">Articles</a>
          <a href="https://www.stonegroup.ca/about">About</a>
        </nav>
        <a className="magazine-talk" href="https://www.stonegroup.ca/node/add/contactSite">
          Let&apos;s Talk
        </a>
      </header>

      <main className="magazine-page">
        {leadBlog ? (
          <>
            <section className="top-story-strip" aria-label="Featured articles">
              {topStories.map((blog) => (
                <TopStory key={blog.id} blog={blog} />
              ))}
            </section>

            <section className="feature-wrap" aria-label="Lead article">
              <HeroFeature blog={leadBlog} />
            </section>

            <section className="magazine-section" id="latest" aria-labelledby="latest-heading">
              <div className="latest-heading-row">
                <h2 id="latest-heading">Latest posts</h2>
                <span>{pagination.total} published insights</span>
              </div>
              <div className="latest-grid">
                {latestPosts.map((blog) => (
                  <LatestPost key={blog.id} blog={blog} />
                ))}
              </div>
              {pagination.totalPages > 1 ? (
                <div className="pagination magazine-pagination" aria-label="Blog pagination">
                  <Link
                    aria-disabled={page <= 1}
                    className={page <= 1 ? "disabled" : ""}
                    href={`/?page=${Math.max(1, page - 1)}#latest`}
                  >
                    Previous
                  </Link>
                  <span>
                    Page {pagination.page} of {pagination.totalPages}
                  </span>
                  <Link
                    aria-disabled={page >= pagination.totalPages}
                    className={page >= pagination.totalPages ? "disabled" : ""}
                    href={`/?page=${Math.min(pagination.totalPages, page + 1)}#latest`}
                  >
                    Next
                  </Link>
                </div>
              ) : null}
            </section>

            <section className="subscribe-panel" aria-label="Subscribe">
              <div>
                <h2>Subscribe now to stay updated with top news.</h2>
                <p>Get market notes, buyer guides, and seller strategy from Woodhouse Realty.</p>
              </div>
              <form action="https://www.stonegroup.ca/node/add/contactSite">
                <input type="email" name="email" placeholder="Enter your email" aria-label="Email address" />
                <button type="submit" aria-label="Submit email">
                  -&gt;
                </button>
                <small>By clicking submit, you agree to be contacted by Woodhouse Realty.</small>
              </form>
            </section>

            <section className="social-gallery" aria-label="Woodhouse Realty visual stories">
              <a className="instagram-card" href="https://www.stonegroup.ca/node/add/contactSite">
                <span>WR</span>
                <h2>Talk with Woodhouse Realty</h2>
                <p>604-547-3338</p>
              </a>
              {galleryImages.map((blog) => (
                <Link key={blog.id} href={`/blog/${blog.slug}`} className="gallery-card">
                  <img src={imageFor(blog)} alt="" />
                </Link>
              ))}
            </section>
          </>
        ) : (
          <section className="empty-state magazine-empty">
            <h1>No published blogs found.</h1>
            <p>When Uplift returns published articles, they will appear here automatically.</p>
          </section>
        )}
      </main>

      <footer className="magazine-footer">
        <div>
          <img src={logoUrl} alt="Woodhouse Realty" />
          <p>
            Local real estate articles, search guidance, and seller strategy from Woodhouse Realty in Surrey, British
            Columbia.
          </p>
          <p className="footer-small">2026 Woodhouse Realty. All rights reserved.</p>
        </div>
        <nav aria-label="Quick links">
          <h2>Quick Link</h2>
          <a href="https://www.stonegroup.ca/">Homepage</a>
          <a href="#latest">Articles</a>
          <a href="https://www.stonegroup.ca/node/add/contactSite">Contact us</a>
        </nav>
        <nav aria-label="Real estate categories">
          <h2>Category</h2>
          {categories.slice(0, 5).map((category) => (
            <a href="#latest" key={category}>
              {category}
            </a>
          ))}
        </nav>
      </footer>
    </>
  );
}
