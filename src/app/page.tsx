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
  const title = 'Current Movies';
  if (moviesData.loading)
    return (
      <>
        <h1 className={styles.listTitle}>{title}</h1>
        <p>loading</p>
      </>
    );
  if (moviesData.error)
    return (
      <>
        <h1 className={styles.listTitle}>{title}</h1>
        <p>error {moviesData.error.message}</p>
      </>
    );
  const movies = moviesData?.data?.movies?.results ?? [];
  console.log(movies);
  return (
    <>
      <h1 className={styles.listTitle}>{title}</h1>
      <p className={styles.listSubtitle}>
        Movies released recently or releasing soon that have been widely
        reviewed
      </p>
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
    </>
  );
}

interface PaginatedResult<Type> {
  page: number;
  results: Type[];
  totalPages: number;
}

interface Movie {
  credits?: {
    directedBy: string[];
    starring: string[];
    writtenBy: string[];
  };
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
        credits {
          directedBy
          starring
          writtenBy
        }
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
        {movie.credits && movie.credits.directedBy.length > 0 && (
          <div className={styles.credits}>
            <DirectorIcon />
            <p>{movie.credits.directedBy.join(', ')}</p>
          </div>
        )}
        {movie.credits && movie.credits.writtenBy.length > 0 && (
          <div className={styles.credits}>
            <WriterIcon />
            <p>{movie.credits.writtenBy.join(', ')}</p>
          </div>
        )}
        {movie.credits && movie.credits.starring.length > 0 && (
          <div className={styles.credits}>
            <ActorIcon />
            <p>{movie.credits.starring.join(', ')}</p>
          </div>
        )}
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

function DirectorIcon(): React.ReactNode {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <polygon points="23 7 16 12 23 17 23 7" />
      <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
    </svg>
  );
}

function WriterIcon(): React.ReactNode {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
    </svg>
  );
}

function ActorIcon(): React.ReactNode {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

export default PeanutGallery;
