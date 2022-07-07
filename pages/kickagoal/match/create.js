import React from 'react';

import {TextField,Button,Autocomplete} from '@mui/material';


import { makeAutoObservable } from "mobx"
import { observer } from "mobx-react"

class Match {

    name = ""
    date = ""
    result = ""
    teams = []

    constructor() {
        makeAutoObservable(this)
    }
    
    setName(name){
        this.name = name
    }

    setDate(date){
        this.date = date
    }
    setResult(result){
        this.result = result
    }

}

const match = new Match();

export const getServerSideProps = async ({ req, res }) => {
  
    const teams = await prisma.team.findMany();
    return {
      props: { teams },
    };
  };


const Draft = (props) =>  {

//    console.log(props )
    if(props.teams == undefined) return null

  const submitData = async (e ) => {
    e.preventDefault();

    try {
        const body = { 
            name:match.name, 
            date:match.date,
            result:match.result,
            teams:match.teams.map(team=>{return {id:team.id}})
        };

        

        console.log(body)

        await fetch('/api/kickagoal/match', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });
    } catch (error) {
        console.error(error);
    }
  };

  const onTagsChange = (event, values) => {
    match.teams = values
//    console.log(values)
  }


  return (
      <div>
        <Input model={match} field="name" placeholder="Name" setfunction="setName" />
        <Input model={match} field="date" placeholder="Date" setfunction="setDate"/>
        <Input model={match} field="result" placeholder="Result" setfunction="setResult"/>

        <Autocomplete
            multiple
            limitTags={2}
            onChange={onTagsChange}
            options={props.teams}
            getOptionLabel={(option) => option.name}
            renderInput={(params) => (
            <TextField
                {...params}
                variant="standard"
                placeholder="Teams"
            />
            )}
        />

        <Button onClick={submitData}>Create</Button>
      </div>
  );
}

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

export default Draft;