import styles from "./Hero.module.css";

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.tag}>// Market Intelligence</div>
      <h1>Insights for the modern investor</h1>
      <p>
        Deep technical analysis, market commentary, and portfolio strategy &mdash;
        built for those who treat investing as a craft.
      </p>
      <div className={styles.cta}>
        <a href="#posts" className="btn btn-primary">
          Read latest
        </a>
        <a href="#newsletter" className="btn btn-outline">
          Subscribe
        </a>
      </div>
    </section>
  );
}
