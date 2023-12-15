import Header from "@/components/header/Header";
import DropdownWithSearch from "@/components/propdownWithSearch/DropdownWithSearch";
import {useState} from "react";

export default function Elections() {
    const [types, setTypes] = useState<string[]>(["presidential","parliament","city"]);
    const [cities, setCities] = useState<string[]>(["Харків","Київ","Хмельницький"]);
    return (
        <main className="flex min-h-screen flex-col items-center justify-between">
            <Header activeTab={"elections"}/>
            <div style={{minHeight:856}} className="flex items-center w-full justify-center">
                <div className="bg-slate-800 p-7 text-xl space-y-10 text-slate-400 flex space-between flex-col w-1/3">
                    <div>
                        <div className="text-2xl mb-2">
                            Name
                        </div>
                        <input className={"px-4 py-2 rounded-md bg-slate-700"} type={"text"}/>
                    </div>
                    <div>
                        <div className="text-2xl mb-2">Time</div>
                        <div className="flex flex-row items-center w-full justify-center">
                            <div  className={"mr-6"}>from</div>
                            <input className={"mr-12 px-4 py-2 rounded-md bg-slate-700"} type={"date"}/>
                            <div className={"mr-6"} >to</div>
                            <input className={"px-4 py-2 rounded-md bg-slate-700"} type={"date"}/>
                        </div>
                    </div>
                    <div>
                        <div className="text-2xl mb-2">Type</div>
                        <DropdownWithSearch onSelect={()=>{}} options={types}/>
                    </div>
                    <div>
                        <div className="text-2xl mb-2">City</div>
                        <DropdownWithSearch onSelect={()=>{}} options={cities}/>
                    </div>
                    <button className={"border-amber-800 h-16 rounded-2xl self-center w-56 border-2 bg-neutral-800"}>Search</button>
                </div>
                <div className="bg-green-500 w-full">
                    hello
                </div>
            </div>
        </main>
    )
}
