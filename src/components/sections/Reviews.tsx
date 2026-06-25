import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { reviews, type Review } from "@/content/reviews";
import { cn } from "@/lib/utils";
import styles from "./Reviews.module.css";

function ReviewCard({ review }: { review: Review }) {
  return (
    <figure className={styles.card}>
      <div className={styles.stars} aria-label="5 out of 5 stars">
        ★★★★★
      </div>
      <blockquote className={styles.quote}>
        &ldquo;{review.quote}&rdquo;
      </blockquote>
      <figcaption className={styles.who}>
        <span className={styles.av} style={{ background: review.color }} />
        <div>
          <b>{review.name}</b>
          <span>{review.role}</span>
        </div>
      </figcaption>
    </figure>
  );
}

function Marquee({
  items,
  reverse,
}: {
  items: Review[];
  reverse?: boolean;
}) {
  // Duplicate the list so the -50% translate loop is seamless.
  const loop = [...items, ...items];
  return (
    <div className={cn(styles.row, reverse && styles.reverse)}>
      {loop.map((review, i) => (
        <ReviewCard key={`${review.name}-${i}`} review={review} />
      ))}
    </div>
  );
}

export function Reviews() {
  const rowA = reviews.slice(0, 4);
  const rowB = reviews.slice(4);

  return (
    <section className={styles.reviews}>
      <Container>
        <SectionHeading
          eyebrow="Reviews"
          title="What the locked-in have to say."
          description="1,200+ students, freelancers and creatives focused every day."
        />
      </Container>
      <div className={styles.mask}>
        <Marquee items={rowA} />
        <Marquee items={rowB} reverse />
      </div>
    </section>
  );
}
