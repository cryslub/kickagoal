import React ,{useState} from 'react';

import {Box} from '@mui/material';


import prisma from '../lib/prisma';

import InfiniteScroll from 'react-infinite-scroll-component';

import Match  from "../components/match";
import Bottom  from "../components/bottom";




export const getServerSideProps = async ({ req, res }) => {
  
//  const clips = await prisma.clip.findMany();
  const matches = await prisma.match.findMany({
      skip:0,
      take:2,
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
              title:true,
              link:true,
              persons:true
            }
          }
      }
  });

  const matchCount = await prisma.match.count()

  return {
    props: { matches,matchCount },
  };
};


export default function Index(props) {


  if(props.matches == undefined) return null

  
  const [value, setValue] = React.useState(0);

  const [pageNumber,setPageNumber] = useState(1)
  const [matchList,setMatchList] = useState(props.matches);



    const fetchMoreData = async ()=>{

      console.log("fetch more")
      setPageNumber(prev=>prev +1) 
      const abortController = new AbortController()
      const res=  await fetch(`/api/kickagoal/match/page/${pageNumber}`,{
              method:"GET",
              signal:abortController.signal
          })
      const  data = await res.json()
      const matches = await data.matches

      console.log(matches)

      setMatchList(prev=>(
          [...prev,...matches]
      ))
    } 
 
    return <Box  sx={{background:'#eee'}}>
      <InfiniteScroll
        dataLength={matchList.length}
        next={fetchMoreData}
        hasMore={props.matchCount>matchList.length}
        loader={<h4>불러오는중...</h4>}

    >
      {
        matchList.map((match)=>(
          <Match data={match}/>
        ))
      }
      </InfiniteScroll>
    
      <Box sx={{height:55}}></Box>

      <Bottom value={value} setValue={setValue}/>


    <style jsx>{`
          html {
            height:100%;
          }

    `}</style>
  </Box>
}

