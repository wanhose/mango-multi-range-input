import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(_req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json([1.99, 5.99, 10.99, 30.99, 50.99, 70.99]);
}
