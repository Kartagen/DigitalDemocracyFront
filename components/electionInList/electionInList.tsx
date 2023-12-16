import React from "react";
import Link from "next/link";
import {Election} from "@/components/interfaces/Election";
const ElectionInList = (election:Election) => {
    return (
        <div className={"flex bg-slate-700 m-10 rounded-2xl flex-row justify-between items-center p-10 text-xl"}>
            <div className={"flex flex-col "}>
                <div className="text-3xl">{election.name}</div>
                <div>Start: {election.beginning}</div>
                <div>End: {election.end}</div>
                <div>Type: {election.type}</div>
                {election.city!=undefined&&
                <div>City: {election.city}</div>}
            </div>
            <Link href={"/elections/"+election._id}>
                <button className={"bg-slate-800 rounded-xl w-32 h-12 text-2xl"}>Vote</button>
            </Link>
        </div>
    );
};

export default ElectionInList;