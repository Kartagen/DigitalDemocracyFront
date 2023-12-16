import Header from "@/components/header/Header";
import DropdownWithSearch from "@/components/propdownWithSearch/DropdownWithSearch";
import {useEffect, useState} from "react";
import ElectionInList from "@/components/electionInList/electionInList";
import {Election} from "@/components/interfaces/Election";
import axios from "axios";

export default function Elections() {
    const [types, setTypes] = useState<string[]>(["presidential","parliament","city"]);
    const [cities, setCities] = useState<string[]>(["Харків","Київ","Хмельницький"]);
    const [electionsResp, setElectionsResp]= useState<Election[]>([])
    const [electionsFilteredName, setElectionsFilteredName]= useState<Election[]>([])
    const [electionsFilteredTime, setElectionsFilteredTime]= useState<Election[]>([])
    const [electionsFilteredType, setElectionsFilteredType]= useState<Election[]>([])
    const [electionsFilteredCity, setElectionsFilteredCity]= useState<Election[]>([])
    const [electionsFiltered, setElectionsFiltered]= useState<Election[]>([])
    const [filter, setFilter]= useState<Election>({name:"",beginning:"",end:"",type:"",city:"",_id:""})
    const loadFilterOptions = () =>{
        const uniqueTypes = Array.from(new Set(electionsResp.map(election => election.type)));
        const allCitiesIncludingUndefined = electionsResp.map(election => election.city);
        const citiesWithoutUndefined = allCitiesIncludingUndefined.filter(city => city !== undefined);
        const uniqueCities = Array.from(new Set(citiesWithoutUndefined));
        setCities(uniqueCities)
        setTypes(uniqueTypes)
    }
    const loadElections = () =>{
        axios.get("http://localhost:5000/vote/all/").then(res =>{
            setElectionsResp(res.data.votes)
            setElectionsFiltered(res.data.votes)
        } )
    }
    const filterElections = () => {
        setElectionsFiltered([])
        if(filter.name!=""){
            setElectionsFilteredName(electionsResp.filter(election => election.name.toLowerCase().includes(filter.name.toLowerCase())))
        } else setElectionsFilteredName(electionsResp)
        if(filter.beginning!=""&&filter.end!=""){
            setElectionsFilteredTime(electionsResp.filter(election => {
                const isBeginningBefore = new Date(election.beginning) < new Date(filter.beginning);
                const isEndAfter = new Date(election.end) > new Date(filter.end);
                return isEndAfter && isBeginningBefore
            }))
        }else setElectionsFilteredTime(electionsResp)
        if(filter.city!=""){
            setElectionsFilteredCity(electionsResp.filter(election => election.city.includes(filter.city)))
        }else setElectionsFilteredCity(electionsResp)
        if(filter.type!=""){
            setElectionsFilteredType(electionsResp.filter(election => election.type.includes(filter.type)))
        }else setElectionsFilteredType(electionsResp)
        electionsResp.forEach(el=>{
            let cnt = 0;
            electionsFilteredCity.forEach(el1=>{if(el1._id==el._id)cnt++})
            electionsFilteredType.forEach(el1=>{if(el1._id==el._id)cnt++})
            electionsFilteredName.forEach(el1=>{if(el1._id==el._id)cnt++})
            electionsFilteredTime.forEach(el1=>{if(el1._id==el._id)cnt++})
            if(cnt==4)setElectionsFiltered(electionsFiltered=>[...electionsFiltered,el])
        })
    }
    useEffect(()=>{
        loadElections()
    },[])
    useEffect(()=>{
        loadFilterOptions()
    },[electionsResp])
    useEffect(()=>{
        console.log(filter)
    },[filter])
    return (
        <main className="flex min-h-screen flex-col bg-slate-800 items-center justify-start">
            <Header activeTab={"elections"}/>
            <div style={{minHeight:856}} className="flex  w-full justify-center">
                <div style={{height:656}} className="bg-slate-800 p-7 sticky top-0 text-xl space-y-10 text-slate-400 flex space-between flex-col w-1/3">
                    <div>
                        <div className="text-2xl mb-2">
                            Name
                        </div>
                        <input onChange={(e) => setFilter((filter) => ({ ...filter, name: e.target.value}))} value={filter.name} className={"px-4 py-2 rounded-md bg-slate-700"} type={"text"}/>
                    </div>
                    <div>
                        <div className="text-2xl mb-2">Active in date</div>
                        <div className="flex flex-row items-center w-full justify-center">
                            <div  className={"mr-6"}>from</div>
                            <input onChange={(e) => setFilter((filter) => ({ ...filter, beginning: e.target.value}))} value={filter.beginning} className={"mr-12 px-4 py-2 rounded-md bg-slate-700"} type={"date"}/>
                            <div className={"mr-6"} >to</div>
                            <input onChange={(e) => setFilter((filter) => ({ ...filter, end: e.target.value}))} value={filter.end} className={"px-4 py-2 rounded-md bg-slate-700"} type={"date"}/>
                        </div>
                    </div>
                    <div>
                        <div className="text-2xl mb-2">Type</div>
                        <DropdownWithSearch onSelect={(e) => setFilter((filter) => ({ ...filter, type: e}))} options={types}/>
                    </div>
                    <div>
                        <div className="text-2xl mb-2">City</div>
                        <DropdownWithSearch onSelect={(e) => setFilter((filter) => ({ ...filter, city: e}))} options={cities}/>
                    </div>
                    <button onClick={filterElections} className={"border-amber-800 h-16 rounded-2xl self-center w-56 border-2 bg-neutral-800"}>Search</button>
                </div>
                <div className="bg-slate-950 w-full">
                    {electionsFiltered.map((election)=>(
                        <ElectionInList key={election._id} _id={election._id} beginning={election.beginning} city={election.city} end={election.end} name={election.name} type={election.type}/>
                        ))}
                </div>
            </div>
        </main>
    )
}
