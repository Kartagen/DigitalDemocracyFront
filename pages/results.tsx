import Header from "@/components/header/Header";
import {useEffect, useState} from "react";
import {Election} from "@/components/interfaces/Election";
import axios from "axios";
import ElectionResult from "@/components/electionResult/electionResult";

export default function Results() {
    const [elections, setElections]= useState<Election[]>([])
    const loadElections = () =>{
        axios.get("http://localhost:5000/vote/all/").then(res =>{
            setElections(res.data.votes)
        } )
    }

    useEffect(()=>{
        loadElections()
    },[])
    return (
        <main className={"flex min-h-screen flex-col bg-slate-950 items-center justify-start"}>
            <Header activeTab={"results"}/>
            <div className="bg-slate-950 w-1/2">
                {elections.map((election)=>(
                    <ElectionResult key={election._id} _id={election._id} beginning={election.beginning} city={election.city} end={election.end} name={election.name} type={election.type}/>
                ))}
            </div>
        </main>
    )
}
