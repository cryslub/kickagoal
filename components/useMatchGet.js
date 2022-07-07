import { useEffect, useState } from "react"

const useMatchGet =(pageNumber)=>{
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const [matchList,setMatchList] = useState([])
    const [hasMore,setHasMore] = useState(false)
   
    useEffect(()=>{
        const abortController = new AbortController()
        setLoading(true)
        setError(false)
        try{ 
            const fetchData = async()=>{
               
           
              const res=  await fetch(`/api/kickagoal/match/${pageNumber}`,{
                    method:"GET",
                    signal:abortController.signal
                })
            const  data = await res.json()
            const matches = await data.matches
            
            
           
            setMatchList(prev=>(
                [...prev,...matches]
            ))
            setHasMore(matches.length > 0)
            setLoading(false)
            
            }
           
               
                fetchData()
        
               
        }catch(err){
            setError(true)
            setLoading(false)
            setHasMore(false)
        }   
       return ()=>{
           abortController.abort()
       }
        
    },[pageNumber])
    return {loading,error,matchList,hasMore}
}
export default useMatchGet;