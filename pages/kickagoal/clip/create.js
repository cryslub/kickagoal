import React from 'react';

import {TextField,Button,Autocomplete} from '@mui/material';


import { makeAutoObservable } from "mobx"

import Input from '../../../components/input.js'

class Clip {

    link = ""
    match = {}
    persons = []

    constructor() {
        makeAutoObservable(this)
    }
    
    setLink(link){
        this.link = link
    }


}

const clip = new Clip();

export const getServerSideProps = async ({ req, res }) => {
  
    const matches = await prisma.match.findMany({
        select:{
            id:true,
            name:true,
            teams:true
        }
    });
    const persons = await prisma.person.findMany();

//    console.log(matches)

    return {
      props: { matches,persons },
    };
  };


const Draft = (props) =>  {

    console.log(props )
    if(props.matches == undefined) return null

  const submitData = async (e ) => {
    e.preventDefault();

    try {
        const body = { 
            link:clip.link, 
            match : {id:clip.match.id},
            persons:clip.persons.map(person=>{return {id:person.id}})
        };

        

        console.log(body)

        await fetch('/api/kickagoal/clip', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });
    } catch (error) {
        console.error(error);
    }
  };

  const onTagsChange = (event, values) => {
    clip.persons = values
//    console.log(values)
  }


  return (
      <div>
        <Input model={clip} field="link" placeholder="Link" setfunction="setLink" />


        <Autocomplete
            disablePortal
            options={props.matches}
            getOptionLabel={(option) => option.name + " " + option.teams[0].name + " vs " + option.teams[1].name}
            onChange={(event, newValue) => {
                console.log(newValue)
                clip.match.id = newValue.id;

            }}
            renderInput={(params) => <TextField {...params} label="Match" />}
        />

        <Autocomplete
            multiple
            onChange={onTagsChange}
            options={props.persons}
            getOptionLabel={(option) => option.name}
            renderInput={(params) => (
            <TextField
                {...params}
                variant="standard"
                placeholder="Persons"
            />
            )}
        />

        <Button onClick={submitData}>Create</Button>
      </div>
  );
}

export default Draft;