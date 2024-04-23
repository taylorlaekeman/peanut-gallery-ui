'use client';
import { gql, useQuery } from '@apollo/client';
import clsx from 'clsx';
import { DateTime } from 'luxon';

import styles from './page.module.css';

function PeanutGallery() {
  return (
    <main className={styles.main}>
      <RecentReleases />
    </main>
  );
}

function RecentReleases() {
  const moviesData = useQuery<{ movies: PaginatedResult<Movie> }>(MOVIES_QUERY);
  if (moviesData.loading)
    return (
      <main className={styles.main}>
        <h1>Recent Releases</h1>
        <p>loading</p>
      </main>
    );
  if (moviesData.error)
    return (
      <main className={styles.main}>
        <h1>Recent Releases</h1>
        <p>error {moviesData.error.message}</p>
      </main>
    );
  return (
    <main className={styles.main}>
      <h1>Recent Releases</h1>
      <section className={styles.movies}>
        {moviesData?.data?.movies?.results.map((movie) => (
          <Movie key={movie.id} movie={movie} />
        ))}
      </section>
    </main>
  );
}

interface PaginatedResult<Type> {
  page: number;
  results: Type[];
  totalPages: number;
}

interface Movie {
  id: string;
  popularity: number;
  releaseDate: string;
  reviewCount: number;
  score: number;
  title: string;
}

const MOVIES_QUERY = gql`
  #graphql
  query GetMovies {
    movies {
      page
      results {
        id
        releaseDate
        reviewCount
        score
        title
      }
      totalPages
    }
  }
`;

function Movie({ movie }: { movie: Movie }): React.ReactNode {
  return (
    <>
      <p
        className={clsx({
          [styles.score]: true,
          [styles.high]: movie.score >= SCORE_THRESHOLDS.high,
          [styles.mid]:
            movie.score >= SCORE_THRESHOLDS.mid &&
            movie.score < SCORE_THRESHOLDS.high,
          [styles.low]: movie.score < SCORE_THRESHOLDS.mid,
        })}
      >
        {(movie.score * 10).toFixed(1)}
      </p>
      <div>
        <a
          className={styles.title}
          href={`https://www.themoviedb.org/movie/${movie.id}`}
        >
          {movie.title}
        </a>
        <p>
          {DateTime.fromISO(movie.releaseDate).toLocaleString(
            DateTime.DATE_MED,
          )}
        </p>
      </div>
    </>
  );
}

const SCORE_THRESHOLDS = {
  high: 0.7,
  mid: 0.6,
};

export default PeanutGallery;
