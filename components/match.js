import {Typography,Stack,Avatar,Box  } from '@mui/material';
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";

import { Navigation ,Lazy} from "swiper";

import Clip  from "./clip";


const Match = (props)=>{
    const match = props.data
    return  <Box key={match.id} pt={1} mb={1} pb={1} sx={{background:'white'}}>
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
        <SwiperSlide style={{width:332}} key={clip.id}>
            <Clip data={clip}/>
            </SwiperSlide>
        ))}
        </Swiper>
    </Box>
}

export default Match