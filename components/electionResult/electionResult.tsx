import React, {useEffect,useRef, useState} from "react";
import { useReactToPrint } from 'react-to-print';
import {Election} from "@/components/interfaces/Election";
import axios from "axios";

const ElectionResult = (election: Election) => {
    const componentRef = useRef(null);
    const [electionResult, setElectionResult] = useState<ElectionRes>()
    const [isAvailable, setIsAvailable] = useState(false)
    const loadElections = () => {
        axios.get("http://localhost:5000/vote/result/" + election._id).then(res => {
            setElectionResult(res.data)
            setIsAvailable(true)
        }).catch((err) => {
        })
    }
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });
    const candidateWithMaxVotes = electionResult?.info.reduce((prevCandidate, currentCandidate) => {
        return prevCandidate.votes > currentCandidate.votes ? prevCandidate : currentCandidate;
    }, electionResult.info[0]);
    useEffect(() => {
        loadElections()
    }, [])
    return (
        <>
            {isAvailable &&
                <div ref={componentRef}
                    className={"flex bg-slate-700 m-10 rounded-2xl flex-col space-y-2 items-start p-10 text-xl"}>
                    <div className={"flex flex-col space-y-1"}>
                        <div className="text-5xl">{election.name}</div>
                        <div>Start: {election.beginning}</div>
                        <div>End: {election.end}</div>
                        <div>Type: {election.type}</div>
                        {election.city != undefined &&
                            <div>City: {election.city}</div>}
                    </div>
                    <div className={"w-full space-y-1"}>
                        <div className={"text-4xl"}>Results:</div>
                        <div>Total voters: {electionResult?.count}</div>
                        <div className={"flex flex-col space-y-2"}>
                            <div className={"text-3xl"}>Candidates:</div>
                            {electionResult?.info.map((cand, index) => (
                                <div key={index}>
                                        <div className={"w-1/2"}>{cand.surname} {cand.name}</div>

                                    <div className={"w-1/5"}>Votes: {cand.votes}</div>
                                    <div className={"w-full flex space-x-2 flex-row"}>
                                        <div>Percent:</div>
                                        <div style={{
                                            width: `${cand.votes / electionResult?.count * 100}%`,
                                            backgroundColor: '#4CAF50',
                                            borderRadius: '4px',
                                            padding: 1
                                        }}>{cand.votes / electionResult?.count * 100}%
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <div className={"text-2xl"}>The winner of the election: {candidateWithMaxVotes?.surname+" "+candidateWithMaxVotes?.name}</div>
                        </div>
                    </div>
                    <button onClick={handlePrint} style={{transform:"translateX(300px)"}} className={"absolute border-amber-800 rounded-2xl self-center px-8 py-2 text-xl border-2 bg-neutral-800"}>Print</button>
                </div>}
        </>
    );
};

export default ElectionResult;