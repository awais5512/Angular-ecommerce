import { map, Observable, startWith } from 'rxjs';

export type ApiResponse<T> = {
  isLoading: boolean;
  results: T | null;
  error: string | null;
};

export function wrapApiResponse<T>(request: Observable<T>) {
  return request.pipe(
    map((response: T) => ({
      isLoading: false,
      results: response,
      error: null,
    })),
    startWith({ isLoading: true, results: null, error: null })
  );
}
