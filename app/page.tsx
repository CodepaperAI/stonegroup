import Link from "next/link";
import { getBlogs, formatDate, readingTime, type BlogSummary } from "../lib/blogs";

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

function BlogCard({ blog, featured = false }: { blog: BlogSummary; featured?: boolean }) {
  const image = blog.featuredImage || heroImage;

  return (
    <article className={featured ? "blog-card blog-card-featured" : "blog-card"}>
      <Link className="blog-image-link" href={`/blog/${blog.slug}`} aria-label={blog.title}>
        <img src={image} alt="" className="blog-image" loading={featured ? "eager" : "lazy"} />
      </Link>
      <div className="blog-card-body">
        <div className="eyebrow-row">
          <span>{blog.categories?.[0] || "Real Estate Insight"}</span>
          <span>{readingTime(blog)}</span>
        </div>
        <h3>
          <Link href={`/blog/${blog.slug}`}>{blog.title}</Link>
        </h3>
        <p>{blog.excerpt || "Fresh guidance for buying, selling, and planning your next real estate move."}</p>
        <div className="card-meta">
          <span>{formatDate(blog.publishDate)}</span>
          {blog.authorName ? <span>{blog.authorName}</span> : null}
        </div>
      </div>
    </article>
  );
}

export default async function Home({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = getPageNumber(params?.page);
  const { blogs, pagination } = await getBlogs(page, 9);
  const [leadBlog, ...otherBlogs] = blogs;
  const categories = categoryList(blogs);

  return (
    <>
      <header className="site-header">
        <a href="https://www.stonegroup.ca/" className="brand" aria-label="Woodhouse Realty home">
          <img src={logoUrl} alt="Woodhouse Realty" />
        </a>
        <nav className="primary-nav" aria-label="Primary navigation">
          <a href="https://www.stonegroup.ca/">Home</a>
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
        <section className="hero" aria-label="Woodhouse Realty blog landing">
          <img src={heroImage} alt="" className="hero-image" fetchPriority="high" />
          <div className="hero-overlay" />
          <div className="hero-content">
            <p className="section-kicker">Woodhouse Realty Insights</p>
            <h1>Local guidance for confident buying and selling.</h1>
            <p>
              Market notes, property search strategy, and practical Surrey real estate advice from the team behind
              Woodhouse Realty.
            </p>
            <div className="hero-actions">
              <a href="#latest" className="button button-primary">
                Read Latest
              </a>
              <a href="https://www.stonegroup.ca/node/add/contactSite" className="button button-secondary">
                Ask a Realtor
              </a>
            </div>
          </div>
        </section>

        <section className="intro-band" aria-label="Blog highlights">
          <div>
            <span className="stat-value">{pagination.total}</span>
            <span className="stat-label">published insights</span>
          </div>
          <div>
            <span className="stat-value">Surrey</span>
            <span className="stat-label">local brokerage perspective</span>
          </div>
          <div>
            <span className="stat-value">5 min</span>
            <span className="stat-label">API refresh window</span>
          </div>
        </section>

        <section className="content-section" id="latest">
          <div className="section-heading">
            <p className="section-kicker">Latest Articles</p>
            <h2>Clear next steps for the market you are in.</h2>
            <p>
              Browse buying guides, seller playbooks, valuation notes, and neighborhood-focused articles pulled directly
              from Uplift.
            </p>
          </div>

          {categories.length ? (
            <div className="category-row" aria-label="Article categories">
              {categories.map((category) => (
                <span key={category}>{category}</span>
              ))}
            </div>
          ) : null}

          {leadBlog ? (
            <div className="featured-grid">
              <BlogCard blog={leadBlog} featured />
              <aside className="advisor-panel" aria-label="Woodhouse Realty contact">
                <p className="section-kicker">Need a Local Read?</p>
                <h2>Talk through timing before you make the next move.</h2>
                <p>
                  Get a quick consult on search alerts, home value, or sale prep from the Woodhouse Realty office in
                  Surrey.
                </p>
                <a href="https://www.stonegroup.ca/node/add/contactSite" className="button button-dark">
                  Contact Us
                </a>
              </aside>
            </div>
          ) : (
            <div className="empty-state">
              <h2>No published blogs found.</h2>
              <p>When Uplift returns published articles, they will appear here automatically.</p>
            </div>
          )}

          {otherBlogs.length ? (
            <div className="blog-grid">
              {otherBlogs.map((blog) => (
                <BlogCard key={blog.id} blog={blog} />
              ))}
            </div>
          ) : null}

          {pagination.totalPages > 1 ? (
            <div className="pagination" aria-label="Blog pagination">
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

        <section className="cta-band">
          <div>
            <p className="section-kicker">Woodhouse Realty</p>
            <h2>Your ideal home is just a click away.</h2>
          </div>
          <div className="cta-actions">
            <a href="https://www.stonegroup.ca/property-search" className="button button-primary">
              Property Search
            </a>
            <a href="https://www.stonegroup.ca/free-home-evaluation" className="button button-light">
              Home Evaluation
            </a>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div>
          <img src={logoUrl} alt="Woodhouse Realty" />
          <p>102-6638 152 A Street, Surrey, British Columbia, V3S 7J1</p>
        </div>
        <nav aria-label="Footer navigation">
          <a href="https://www.stonegroup.ca/listings">Listings</a>
          <a href="https://www.stonegroup.ca/buying">Buying</a>
          <a href="https://www.stonegroup.ca/selling">Selling</a>
          <a href="https://www.stonegroup.ca/node/add/contactSite">Contact Us</a>
        </nav>
        <p className="disclaimer">Woodhouse Realty independently owned and operated.</p>
      </footer>
    </>
  );
}
