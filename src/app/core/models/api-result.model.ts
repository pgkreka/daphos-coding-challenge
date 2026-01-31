import { ApiError } from './api-error.model';

export type ApiResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: ApiError };
