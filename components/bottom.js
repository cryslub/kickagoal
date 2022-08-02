import {BottomNavigation, BottomNavigationAction,Paper } from '@mui/material';
import LinkIcon from '@mui/icons-material/Link';


const Bottom = (props)=>{


    const value = props.value;
    const setValue = props.setValue;

    return <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0,zIndex:1 }} elevation={3}>
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
}

export default Bottom