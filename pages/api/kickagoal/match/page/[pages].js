import prisma from '../../../../../lib/prisma'

const pages=async(req, res)=>{
    const {pages} = req.query
    const pageNumber = parseInt(pages.toString())
    try{
        const matches = await prisma.match.findMany({
            skip:3*pageNumber,
            take:3,
            orderBy:{
              date:'desc'
            },
            select:{
                id:true,
                result:true,
                name:true,
                teams:true,
                clips:{
                  select:{
                    id:true,
                    link:true,
                    persons:true
                  }
                }
            }

        })
        return res.status(200).json({matches:matches })
    }catch(err){
        console.log(err)
        return res.status(400).json({message:"Bad Request"})
    }
}
export default pages;