import prisma from '../../../lib/prisma';

export default async function handler(req, res) {
    
    if (req.method === 'POST') {
        // Process a POST request
        const { name, date,result,teams } = req.body;
        const rslt = await prisma.match.create({
            data: {
              name: name,
              date: date,
              result: result,
              teams:{connect:teams}
            },
          });
          res.json(rslt);
    } else {
    // Handle any other HTTP method
    }

}