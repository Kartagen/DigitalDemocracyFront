import React, {useEffect,useRef, useState} from "react";
import { useReactToPrint } from 'react-to-print';
import {Election} from "@/components/interfaces/Election";
import axios from "axios";
import {toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ElectionResult = (election: Election) => {
    const componentRef = useRef(null);
    const [electionResult, setElectionResult] = useState<ElectionRes>()
    const [isAvailable, setIsAvailable] = useState(false)
    //функція для переведення дати з бд у дату, зрозумілу користувачу
    const formatDate=(date:string)=>{
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            timeZoneName: 'short',
        };
        const userFriendlyDate = new Date(date).toLocaleDateString('en-US', options);
        return userFriendlyDate;
    }
    const loadElections = () => {
        axios.get("http://localhost:5000/vote/result/" + election._id).then(res => {
            setElectionResult(res.data)
            setIsAvailable(true)
        }).catch((err) => {
        })
    }
    //функція збереження результату виборів чи його роздруковування
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });
    //функція для знаходження переможця виборів
    const candidateWithMaxVotes = electionResult?.info.reduce((prevCandidate, currentCandidate) => {
        if (prevCandidate.votes == currentCandidate.votes && electionResult?.info.length!=1) {
            let res:CandidateRes = {surname:"", name: "Перевибори", votes: prevCandidate.votes, aboutCandidate:"", id:"-1"}
            return res;
        }
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
                    <ToastContainer/>
                    <div className={"flex flex-col space-y-1"}>
                        <div className="text-5xl">{election.name}</div>
                        <div>Start: {formatDate(election.beginning)}</div>
                        <div>End: {formatDate(election.end)}</div>
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
                                        }}>{(cand.votes / electionResult?.count * 100).toFixed(2)}%
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