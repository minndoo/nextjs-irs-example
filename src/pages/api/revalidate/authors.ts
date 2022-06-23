
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler (req: NextApiRequest, res: NextApiResponse) {
  if(req.query.secret !== process.env.SECRET_REVALIDATE) {
    return res.status(401).json({message: 'Invalid token'})
  }
  try {
    await res.unstable_revalidate('/authors')
    return res.json({revalidaded: true})
  } catch {
    return res.status(500).send('Error revalidating')
  }
}