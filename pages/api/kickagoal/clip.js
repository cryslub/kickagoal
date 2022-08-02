import prisma from '../../../lib/prisma';

export default async function handler(req, res) {
    
    if (req.method === 'POST') {
        // Process a POST request
        const { link, title,match,persons } = req.body;
        const result = await prisma.clip.create({
            data: {
              link: link,
              title:title,
              match:{
                connect:match
              },
              persons:{connect:persons}
            },
          });
          res.json(result);
    } else {
    // Handle any other HTTP method
    }

}