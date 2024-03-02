const environment: Environment = {
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
};

export default environment;

export interface Environment {
  readonly baseUrl?: string;
}
