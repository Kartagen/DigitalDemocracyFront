import React, {useEffect, useState} from "react";
import axios from "axios";
import {Election} from "@/components/interfaces/Election";
import {useParams, useRouter} from "next/navigation";
import Header from "@/components/header/Header";
import {CandidateInVote} from "@/components/interfaces/candidate";
import {UserData} from "@/components/interfaces/userData";

interface VoteAndCandidates {
    vote: Election,
    candidates: CandidateInVote[]
}

const ElectionPage = () => {
    const params = useParams()
    const router = useRouter()
    const [userData, setUserData] = useState<UserData | undefined>(undefined)
    const [selectedCandidate, setSelectedCandidate] = useState<string>("")
    const [error, setError] = useState<string>("")
    const [election, setElection] = useState<VoteAndCandidates>()
    const [jwt, setJwt] = useState<string>("")
    const [candidateStates, setCandidateStates] = useState<{ [key: string]: boolean }>({});
    const loadElectionData = () => {
        if (params != null)
            axios.get("http://localhost:5000/vote/" + params.id
            ).then((res) => {
                setElection(res.data)
            })
    }
    const handleVote = () => {
        if (selectedCandidate != "")
            axios.post("http://localhost:5000/vote_process/vote", {
                voteId: election?.vote._id,
                candidateId: selectedCandidate
            }, {headers: {Authorization: "Bearer " + jwt}}).then(()=>{
                router.push("/")
            }).catch(err=>{
                switch (err.response.status){
                    case 405: setError("You already vote in this election")
                        setInactive()
                        break
                }
            })
    }
    const GetUserData = () => {
        let jwt = localStorage["jwt"];
        if (!jwt) return undefined
        axios.get("http://localhost:5000/vote_process/verify",
            {headers: {Authorization: "Bearer " + jwt}}
        ).then((res) => {
            setUserData(res.data)
            setJwt(jwt)
        })
    }
    const toggleShowAbout = (candidateId: string) => {
        setCandidateStates((prevStates: { [key: string]: boolean }) => ({
            ...prevStates,
            [candidateId]: !prevStates[candidateId]
        }));
    }
    const isAllowedToVote = () => {
        let isAll = true
        let jwt = localStorage["jwt"];
        if (jwt == "") {
            setError("Authorize first")
            isAll=false
        }
        if (election?.vote.city != userData?.city && election?.vote.city != undefined) {
            setError("You are not allowed to vote in this city")
            isAll=false
        }
        const now = new Date();
        const beginningDate = election?.vote.end && new Date(election.vote.beginning);
        const endDate = election?.vote.end && new Date(election.vote.end);
        if (beginningDate && endDate && (beginningDate > now || endDate < now)) {
            setError("Vote inactive now")
            isAll=false
        }
        console.log(userData)
        if(!isAll){
            setInactive()
        }
    }
    const setInactive = () =>{
        const radioButtons = document.querySelectorAll<HTMLInputElement>('input[type="radio"]');
        radioButtons.forEach((radioButton) => {
            radioButton.disabled = true;
        });
        const buttonVote = document.getElementById("buttonHandleVote")
        if (buttonVote instanceof HTMLButtonElement) {
            buttonVote.disabled = true;
        }
    }
    useEffect(() => {
        loadElectionData();
        GetUserData();
    }, [params]);
    useEffect(()=>{
        isAllowedToVote();
    },[userData, election, isAllowedToVote])
    return (
        <main className="flex min-h-screen flex-col bg-slate-800 items-center justify-start">
            <Header activeTab={"elections"}/>
            <div className={"flex flex-col space-y-4 w-1/2 p-16 text-2xl"}>
                <div className={"flex flex-col space-y-4 px-16 text-2xl"}>
                    <div className={"text-5xl"}>{election?.vote.name}</div>
                    <div>Start: {election?.vote.beginning}</div>
                    <div>End: {election?.vote.end}</div>
                    <div>Type: {election?.vote.type}</div>
                    {election?.vote.city != undefined &&
                        <div>City: {election?.vote.city}</div>}
                </div>
                <div className={"border-solid border-4 border-slate-900 px-16 py-4"}>
                    {election?.candidates.map((candidate) => (
                        <div className={"flex flex-col"} key={candidate.candidateId._id}>
                            <div><input className="w-5 h-5 mr-2"
                                        value={candidate.candidateId._id}
                                        onClick={() => setSelectedCandidate(candidate.candidateId._id)}
                                        name={election?.vote._id} type={"radio"}/>
                                <label
                                    htmlFor={candidate.candidateId._id}>{candidate.candidateId.name + " " + candidate.candidateId.surname}</label>
                                <button onClick={() => toggleShowAbout(candidate.candidateId._id)}
                                        className={"m-3 bg-black p-2 rounded-xl text-base"}>Read about
                                </button>
                            </div>
                            {candidateStates[candidate.candidateId._id] &&
                                <div className={"text-base"}>
                                    {candidate.candidateId.aboutCandidate}
                                </div>}
                        </div>
                    ))}
                </div>
                <div className={"self-center text-red-700"}>{error}</div>
                <button onClick={handleVote} id={"buttonHandleVote"}
                        className={"p-3 bg-black m-2 text-3xl w-1/3 self-center rounded-3xl hover:bg-gray-300 disabled:bg-gray-600 disabled:hover:bg-red-700"}>Vote
                </button>
            </div>
        </main>
    );
};

export default ElectionPage;