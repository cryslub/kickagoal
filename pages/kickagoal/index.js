import React ,{useState,useCallback, useRef} from 'react';
import { findDOMNode } from 'react-dom'


import {useTheme} from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery';

import {BottomNavigation, BottomNavigationAction,Paper,Typography,Stack,Avatar,AvatarGroup ,Box  } from '@mui/material';
import LinkIcon from '@mui/icons-material/Link';
import ReactPlayer from 'react-player'

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";

import { Navigation ,Lazy} from "swiper";

import prisma from '../../lib/prisma';

import InfiniteScroll from 'react-infinite-scroll-component';

import useMatchGet from "../../components/useMatchGet"


const AllArticles=(props)=>{
   
    const [pageNumber,setPageNumber] = useState(1)
    const observer = useRef(null)
    const {loading,error,matchList,hasMore} = useMatchGet(pageNumber)

    const lastArticleElementRef = useCallback(node=>{ 
      if(loading) return
      if(observer.current) observer.current.disconnect()
      observer.current = new IntersectionObserver(entries=>{
          if(entries[0].isIntersecting && hasMore){
            setPageNumber(prev=>prev +1)
          }
      },{rootMargin:'50px'})
  
      if(node) observer.current.observe(node)
      
    },[loading,hasMore])
  

    return (
      <>
      <section className={styles.all_articles}>
          <div className={styles.btn}>Article Fetched <h1>{3 + articleList.length}</h1> </div>
          {articles.map((v,i)=>(
              <article key={i}>
                  <h1>{v.title}</h1>
              </article>
          ))}
          {articleList && articleList.length > 0 ? (
              articleList.map((v,i)=>(
                  articleList.length === i + 1 ? (
                      <article key={i} ref={lastArticleElementRef}><h1>{v.title}</h1></article>
                  ):(<article key={i}><h1>{v.title}</h1></article>)
              )) 
          ):('')}
           {loading ? (<h1>Loading....</h1>):('')}
          {error ? (<h1>Something went wrong</h1>):('')}
      </section>
      </>
  )

}

export const getServerSideProps = async ({ req, res }) => {
  
//  const clips = await prisma.clip.findMany();
  const matches = await prisma.match.findMany({
      skip:0,
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
  });

  const matchCount = await prisma.match.count()

  return {
    props: { matches,matchCount },
  };
};


function getBreakpoint(){
  const theme = useTheme()
  const smUp = useMediaQuery(theme.breakpoints.up('sm'))
  const mdUp = useMediaQuery(theme.breakpoints.up('md'))
  const lgUp = useMediaQuery(theme.breakpoints.up('lg'))
  return smUp?mdUp?lgUp?"xl":"lg":"md":"sm"
}

export default function Index(props) {

  if(props.matches == undefined) return null

  
  const [value, setValue] = React.useState(0);

  const [pageNumber,setPageNumber] = useState(1)
  const observer = useRef(null)
  const [matchList,setMatchList] = useState(props.matches);

  const colMap = {xl:8,lg:6,md:4,sm:2}

    const breakpoint  = getBreakpoint()

    const [fullscreenMode, setFullscreenMode] = useState(false)
    let players = {};
    const ref = (p,id) => {players[id] = p;}
    const onStart = (id) => {
//        if (fullscreenMode)
      console.log(id)
            findDOMNode(players[id]).requestFullscreen().catch(
              (err) => 
              {}
          );
    }
    const onEnded = () => {
      document.exitFullscreen().catch(
        (err) => 
        {}
      );
    }

    const onReady = (id)=>{
      var player = players[id].getInternalPlayer()
      var iframe = player.getIframe()
      console.log(iframe.contentWindow.document)
    }

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

//    console.log(breakpoint)
    return <Box  sx={{background:'#eee'}}>
      <InfiniteScroll
        dataLength={matchList.length}
        next={fetchMoreData}
        hasMore={props.matchCount>matchList.length}
        loader={<h4>Loading...</h4>}

    >
      {
        matchList.map((match)=>(

          <Box key={match.id} pt={1} mb={1} pb={1} sx={{background:'white'}}>
          <Stack  direction="row"  spacing={1} alignItems="center" ml={1} mb={1} >
            <Typography  variant="subtitle1" >{match.name}</Typography> 
            {match.teams.length>0?<Stack  direction="row">
              <Avatar alt={match.teams[0].name} src={"/images/kickagoal/logo/"+match.teams[0].logo+".png"} />  
              <Typography  variant="h6">vs</Typography> 
              <Avatar alt={match.teams[1].name} src={"/images/kickagoal/logo/"+match.teams[1].logo+".png"} />  
            </Stack>:null
            }
            <Typography >{match.result}</Typography> 
          </Stack>
          <Swiper
          style={{
            "--swiper-navigation-color": "#fff",
            "--swiper-pagination-color": "#fff",
          }}
            lazy={true}
            slidesPerView="auto"
            spaceBetween={0}
            navigation={true} 
            modules={[Lazy, Navigation]} 
          >

          {match.clips.map((clip) => (
            <SwiperSlide style={{width:172}} key={clip.id}>
              <Box className="player-wrapper" elevation={2} >
                <ReactPlayer url={clip.link} className="react-player swiper-lazy" width="162px" height="288px"
                  ref={(p)=>ref(p,clip.id)}
                  onStart={()=>onStart(clip.id)}
                  onPlay={()=>onStart(clip.id)}
                  onEnded={onEnded} 
                  onPause={onEnded}
                  config={{
                    youtube: {
                      playerVars: { 
                        showinfo: 0,
                        fs:0,
                        modestbranding : 1  }
                    }
                  }}/>
                <AvatarGroup style={{position:'relative',top:238,marginRight:5,marginBottom:-45}}>
                  {
                    clip.persons.map((person)=>(
                      <Avatar key={person.id} alt={person.name} src={"/images/kickagoal/photo/"+person.photo+".png"} />
                    ))
                  }
                </AvatarGroup>
                </Box>
              </SwiperSlide>
          ))}
          </Swiper>
          </Box>
        ))
      }
    </InfiniteScroll>
    <Box sx={{height:55}}></Box>

      <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0,zIndex:1 }} elevation={3}>
          <BottomNavigation
          showLabels
          value={value}
          onChange={(event, newValue) => {
            setValue(newValue);
          }}
        >
        <BottomNavigationAction label="클립" icon={<LinkIcon />} />
      </BottomNavigation>
    </Paper>
    <style jsx>{`
          html {
            height:100%;
          }

    `}</style>
  </Box>
}

