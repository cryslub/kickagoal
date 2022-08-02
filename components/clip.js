
import {Paper,Typography,Stack,Avatar,AvatarGroup ,Box  } from '@mui/material';
import TikTok  from "./tiktok";


const Clip = (props)=>{

    const clip = props.data

    return  <Paper  variant="outlined"  style={{marginBottom:5,borderRadius:10}}>
    <Box className="player-wrapper" elevation={2} style={{ height:615,width:316}} >
      <TikTok link={clip.link}  className="react-player swiper-lazy"
        style={{maxWidth: 316,minWidth: 316,maxHeight:550,minHeight:550,top:-20,margin:0}}
      />

      <Stack direction="row" style={{position:'relative',margin:10,justifyContent:'space-between',alignItems:'center'}}>
          <Typography variant="body2" >{clip.title}</Typography> 
          <AvatarGroup>
          {
            clip.persons.map((person)=>(
              <Avatar key={person.id} alt={person.name} src={"/images/kickagoal/photo/"+person.photo+".png"} />
            ))
          }
          </AvatarGroup>
      </Stack>
      </Box>
    </Paper>
}

export default Clip
