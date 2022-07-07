import { observer } from "mobx-react"
import {TextField} from '@mui/material';


const Input = observer((props)=>{
    const model = props.model
    const field = props.field
    const setfunction = props.setfunction

    
    if(model == undefined) return null;

    const onChange = (e)=>{
        model[setfunction](e.target.value)
    }

    return  <TextField
        onChange={onChange}
        {...props} 
        value={model[field]}
    />

})

export default Input