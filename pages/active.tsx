import Header from "@/components/header/Header";
import ElectionInList from "@/components/electionInList/electionInList";
import {useEffect, useState} from "react";
import {Election} from "@/components/interfaces/Election";
import axios from "axios";

export default function Active() {
    const [electionsFiltered, setElectionsFiltered]= useState<Election[]>([])
    const loadElections = () =>{
        axios.get("http://localhost:5000/vote/all/?available=true").then(res =>{
            setElectionsFiltered(res.data.votes)
        } )
    }

    useEffect(()=>{
        loadElections()
    },[])
    return (
        <main className={"flex min-h-screen flex-col bg-slate-950 items-center justify-start"}>
            <Header activeTab={"active"}/>
            <div className="bg-slate-950 w-1/2">
                {electionsFiltered.map((election)=>(
                    <ElectionInList key={election._id} _id={election._id} beginning={election.beginning} city={election.city} end={election.end} name={election.name} type={election.type}/>
                ))}
            </div>
        </main>
    )
}