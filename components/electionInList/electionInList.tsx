import React from "react";
import Link from "next/link";
import {Election} from "@/components/interfaces/Election";
const ElectionInList = (election:Election) => {
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
    return (
        <div className={"flex bg-slate-700 m-10 rounded-2xl flex-row justify-between items-center p-10 text-xl"}>
            <div className={"flex flex-col "}>
                <div className="text-3xl">{election.name}</div>
                <div>Start: {formatDate(election.beginning)}</div>
                <div>End: {formatDate(election.end)}</div>
                <div>Type: {election.type}</div>
                {election.city!=undefined&&
                <div>City: {election.city}</div>}
            </div>
            <Link href={"/elections/"+election._id}>
                <button className={"bg-slate-800 rounded-xl w-36 h-12 text-2xl"}>View more</button>
            </Link>
        </div>
    );
};

export default ElectionInList;