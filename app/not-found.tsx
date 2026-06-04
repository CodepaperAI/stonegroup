import Link from "next/link";

export default function NotFound() {
  return (
    <main className="not-found">
      <p className="section-kicker">Woodhouse Realty</p>
      <h1>Article not found</h1>
      <p>The blog post may have moved or is no longer published.</p>
      <Link href="/" className="button button-dark">
        Back to Blog
      </Link>
    </main>
  );
}
