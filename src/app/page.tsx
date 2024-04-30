'use client';
import { gql, useQuery } from '@apollo/client';
import clsx from 'clsx';
import { DateTime } from 'luxon';
import Image from 'next/image';

import styles from './page.module.css';
import DisneyPlus from '../../public/disney-plus.svg';
import Netflix from '../../public/netflix.svg';

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
  return (
    <>
      <h1 className={styles.listTitle}>{title}</h1>
      <p className={styles.listSubtitle}>
        Movies released recently or releasing soon that have been widely
        reviewed
      </p>
      <section>
        {movies.map((movie) => (
          <Movie key={movie.id} movie={movie} />
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
  releaseType: ReleaseType;
  reviewCount: number;
  score: number;
  title: string;
}

enum ReleaseType {
  DisneyPlus = 'disney-plus',
  Netflix = 'netflix',
  Theatrical = 'theatrical',
  Unknown = 'unknown',
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
        releaseType
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
    <div
      className={clsx({
        [styles.movie]: true,
      })}
    >
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
        {(movie.score * 100).toFixed(0)}
      </p>
      <ReleaseIcon
        className={styles.releaseType}
        releaseType={movie.releaseType}
      />
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
  mid: 0.55,
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
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
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
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
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
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

function ReleaseIcon({
  className,
  releaseType = ReleaseType.Unknown,
}: { className?: string; releaseType?: ReleaseType } = {}): React.ReactNode {
  switch (releaseType) {
    case ReleaseType.DisneyPlus:
      return <DisneyPlusIcon className={clsx(className, styles.releaseIcon)} />;
    case ReleaseType.Netflix:
      return <NetflixIcon className={className} />;
    case ReleaseType.Theatrical:
      return <TheaterIcon className={clsx(className, styles.releaseIcon)} />;
    case ReleaseType.Unknown:
    default:
      return null;
  }
}

function TheaterIcon({
  className,
}: { className?: string } = {}): React.ReactNode {
  return (
    <div className={clsx(styles.iconBackground, className)}>
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
        className={clsx('feather', styles.featherFilm)}
      >
        <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect>
        <line x1="7" y1="2" x2="7" y2="22"></line>
        <line x1="17" y1="2" x2="17" y2="22"></line>
        <line x1="2" y1="12" x2="22" y2="12"></line>
        <line x1="2" y1="7" x2="7" y2="7"></line>
        <line x1="2" y1="17" x2="7" y2="17"></line>
        <line x1="17" y1="17" x2="22" y2="17"></line>
        <line x1="17" y1="7" x2="22" y2="7"></line>
      </svg>
    </div>
  );
}

function DisneyPlusIcon({
  className,
}: { className?: string } = {}): React.ReactNode {
  return (
    <div className={clsx(styles.iconBackground, className)}>
      <Image alt="test" src={DisneyPlus} />
    </div>
  );
}

function NetflixIcon({
  className,
}: { className?: string } = {}): React.ReactNode {
  return (
    <div className={clsx(styles.iconBackground, className)}>
      <Image alt="test" src={Netflix} />
    </div>
  );
}

export default PeanutGallery;
