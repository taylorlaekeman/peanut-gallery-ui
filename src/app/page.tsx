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
  const movies = moviesData?.data?.movies?.results ?? [];
  return (
    <main className={styles.main}>
      <h1>Recent Releases</h1>
      <section>
        {movies.map((movie, index) => (
          <Movie
            isFirst={index === 0}
            isLast={index === movies.length - 1}
            key={movie.id}
            movie={movie}
          />
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
  posterUrl: string;
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
        posterUrl
        releaseDate
        reviewCount
        score
        title
      }
      totalPages
    }
  }
`;

function Movie({
  isFirst = false,
  isLast = false,
  movie,
}: {
  isFirst?: boolean;
  isLast?: boolean;
  movie: Movie;
}): React.ReactNode {
  return (
    <div
      className={clsx({
        [styles.movie]: true,
        [styles.firstMovie]: isFirst,
        [styles.lastMovie]: isLast,
      })}
    >
      <div
        className={clsx({
          [styles.scoreWrapper]: true,
          [styles.high]: movie.score >= SCORE_THRESHOLDS.high,
          [styles.mid]:
            movie.score >= SCORE_THRESHOLDS.mid &&
            movie.score < SCORE_THRESHOLDS.high,
          [styles.low]: movie.score < SCORE_THRESHOLDS.mid,
        })}
      >
        <div className={styles.scoreBackground}>
          <p className={styles.score}>{(movie.score * 100).toFixed(0)}</p>
        </div>
      </div>
      {movie.posterUrl && (
        <img
          alt={`movie poster for '${movie.title}'`}
          className={styles.moviePoster}
          src={movie.posterUrl}
        />
      )}
      {!movie.posterUrl && <span className={styles.missingMoviePoster} />}
      <div className={styles.movieDetails}>
        <p className={styles.title}>{movie.title}</p>
        <p className={styles.releaseDate}>
          {DateTime.fromISO(movie.releaseDate).toLocaleString(
            DateTime.DATE_MED
          )}
        </p>
      </div>
    </div>
  );
}

const SCORE_THRESHOLDS = {
  high: 0.7,
  mid: 0.6,
};

export default PeanutGallery;
