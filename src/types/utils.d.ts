export type ResponseDTO<T> = {
  data: T | null;
  error: Error | null;
  status: number;
};

export type Error = {
    message: string;
    status: number;
}