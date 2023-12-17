import Header from "@/components/header/Header";
import {useEffect, useState} from "react";
import {UserData} from "@/components/interfaces/userData";
import axios from "axios";
import {useRouter} from "next/navigation";
import DropdownWithSearch from "@/components/dropdownWithSearch/DropdownWithSearch";
import {Election} from "@/components/interfaces/Election";
import {Candidate} from "@/components/interfaces/candidate";
import {toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Administration() {
    const router = useRouter();
    const [userData, setUserData] = useState<UserData | undefined>(undefined);
    const [passportQr, setPassportQr] = useState("");
    const [responseQr, setResponseQr] = useState("");
    const [jwt, setJwt] = useState("");
    const [isOpenQr, setIsOpenQr] = useState(false);
    const [isCandidate, setIsCandidate] = useState(false);
    const [isVote, setIsVote] = useState(false);
    const [isOther, setIsOther] = useState(false);
    const [isAdd, setIsAdd] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [isDelete, setIsDelete] = useState(false);
    const [voteOptions, setVoteOptions] = useState<Election[]>([]);
    const [voteEdit, setVoteEdit] = useState<Election>({_id: "", beginning: "", city: "", end: "", name: "", type: ""});
    const [voteEditCandidates, setVoteEditCandidates] = useState<Candidate[]>([]);
    const [candidateOptions, setCandidateOptions] = useState<Candidate[]>([]);
    const [candidateEdit, setCandidateEdit] = useState<Candidate>({_id: "", name: "", surname: "", aboutCandidate: ""});

    const handleOpenTab = (type: string) => {
        switch (type) {
            case "Vote":
                setIsVote(!isVote)
                setIsOther(false)
                setIsCandidate(false)
                break
            case "Candidate":
                setIsVote(false)
                setIsOther(false)
                setIsCandidate(!isCandidate)
                break
            case "Other":
                setIsVote(false)
                setIsOther(!isOther)
                setIsCandidate(false)
                break
            case "Add":
                setIsEdit(false)
                setIsAdd(!isAdd)
                setIsDelete(false)
                break
            case "Edit":
                setIsAdd(false)
                setIsEdit(!isEdit)
                setIsDelete(false)
                break
            case "Delete":
                setIsAdd(false)
                setIsDelete(!isDelete)
                setIsEdit(false)
                break
        }
        setVoteEditCandidates([])
        setVoteEdit({_id: "", beginning: "", city: "", end: "", name: "", type: ""})
        setCandidateEdit({_id: "", name: "", surname: "", aboutCandidate: ""})
    }
    const handleSelectEditVote = (vote: string) => {
        setVoteEdit(voteOptions.find((option) => option.name === vote) || {
            _id: "",
            beginning: "",
            city: "",
            end: "",
            name: "",
            type: ""
        })
    }
    const handleSelectEditCandidate = (candidate: string) => {
        setCandidateEdit(candidateOptions.find((can) => can.surname + " " + can.name === candidate) || {
            _id: "",
            name: "",
            surname: "",
            aboutCandidate: ""
        })
    }
    const handleAddCandidateToVote = () => {
        if (voteEditCandidates.indexOf(candidateEdit) == -1)
            setVoteEditCandidates(voteEditCandidates => voteEditCandidates.concat(candidateEdit))
    }
    const handleAddVote = () => {
        let req;
        if (voteEdit.city != "") {
            req = {
                beginning: voteEdit.beginning,
                end: voteEdit.end,
                name: voteEdit.name,
                type: voteEdit.type,
                city: voteEdit.city,
                candidates: voteEditCandidates.map(can => (can._id))
            }
        } else req = {
            beginning: voteEdit.beginning,
            end: voteEdit.end,
            name: voteEdit.name,
            type: voteEdit.type,
            candidates: voteEditCandidates.map(can => (can._id))
        }
        axios.post("http://localhost:5000/vote/create/",
            req,
            {headers: {Authorization: "Bearer " + jwt}},
        ).then(res => {
            toast.success(res.data.message, {
                position: toast.POSITION.TOP_RIGHT,
            });
        }).catch(err => {
            toast.error(err.response.data.message)
        })
        loadInfo()
    }
    const handleEditVote = () => {
        let req;
        if (voteEditCandidates.length == 0) {
            if (voteEdit.city != "") {
                req = {
                    beginning: voteEdit.beginning,
                    end: voteEdit.end,
                    name: voteEdit.name,
                    type: voteEdit.type,
                    city: voteEdit.city,
                }
            } else req = {
                beginning: voteEdit.beginning,
                end: voteEdit.end,
                name: voteEdit.name,
                type: voteEdit.type,
            }
        } else {
            if (voteEdit.city != "") {
                req = {
                    beginning: voteEdit.beginning,
                    end: voteEdit.end,
                    name: voteEdit.name,
                    type: voteEdit.type,
                    city: voteEdit.city,
                    candidates: voteEditCandidates.map(can => (can._id))
                }
            } else req = {
                beginning: voteEdit.beginning,
                end: voteEdit.end,
                name: voteEdit.name,
                type: voteEdit.type,
                candidates: voteEditCandidates.map(can => (can._id))
            }
        }
        axios.patch(`http://localhost:5000/vote/${voteEdit._id}/update/`,
            req,
            {headers: {Authorization: "Bearer " + jwt}},
        ).then(res => {
            toast.success(res.data.message, {
                position: toast.POSITION.TOP_RIGHT,
            });
        }).catch(err => {
            toast.error(err.response.data.message)
        })
        loadInfo()
    }
    const handleDeleteVote = () => {
        axios.delete(`http://localhost:5000/vote/${voteEdit._id}/delete`,
            {headers: {Authorization: "Bearer " + jwt}},
        ).then(res => {
            toast.success(res.data.message, {
                position: toast.POSITION.TOP_RIGHT,
            });
        }).catch(err => {
            toast.error(err.response.data.message)
        })
        loadInfo()
    }
    const handleAddCandidate = () => {
        axios.post("http://localhost:5000/candidate/create/",
            {
                name: candidateEdit.name,
                surname: candidateEdit.surname,
                aboutCandidate: candidateEdit.aboutCandidate
            },
            {headers: {Authorization: "Bearer " + jwt}},
        ).then(res => {
            toast.success(res.data.message, {
                position: toast.POSITION.TOP_RIGHT,
            });
        }).catch(err => {
            toast.error(err.response.data.message)
        })
        loadInfo()
    }
    const handleEditCandidate = () => {
        axios.patch(`http://localhost:5000/candidate/${candidateEdit._id}/update/`,
            {
                name: candidateEdit.name,
                surname: candidateEdit.surname,
                aboutCandidate: candidateEdit.aboutCandidate
            },
            {headers: {Authorization: "Bearer " + jwt}},
        ).then(res => {
            toast.success(res.data.message, {
                position: toast.POSITION.TOP_RIGHT,
            });
        }).catch(err => {
            toast.error(err.response.data.message)
        })
        loadInfo()
    }
    const handleDeleteCandidate = () => {
        axios.delete(`http://localhost:5000/candidate/${candidateEdit._id}/delete/`,
            {headers: {Authorization: "Bearer " + jwt}},
        ).then(res => {
            toast.success(res.data.message, {
                position: toast.POSITION.TOP_RIGHT,
            });
        }).catch(err => {
            toast.error(err.response.data.message)
        })
        loadInfo()
    }
    const handleExportDB=()=>{
        axios.get("http://localhost:5000/staff/export",
            {headers: {Authorization: "Bearer " + jwt}},
            ).then(res=>{
            toast.success(res.data.message, {
                position: toast.POSITION.TOP_RIGHT,
            });
        }).catch(err => {
            toast.error(err.response.data.message)
        })
    }
    const handleImportDB=()=>{
        axios.get("http://localhost:5000/staff/import",
            {headers: {Authorization: "Bearer " + jwt}},
        ).then(res=>{
            toast.success(res.data.message, {
                position: toast.POSITION.TOP_RIGHT,
            });
        }).catch(err => {
            toast.error(err.response.data.message)
        })
    }
    const handleGenerateQr = () => {
        axios.post("http://localhost:5000/staff/generateQr",
            {passportNumber: passportQr},
            {headers: {Authorization: "Bearer " + jwt}},
        ).then(res => {
            setResponseQr(res.data)
        })
    }
    const getUserData = () => {
        let jwt = localStorage["jwt"];
        if (!jwt) return undefined
        setJwt(jwt);
        axios.get("http://localhost:5000/vote_process/verify",
            {headers: {Authorization: "Bearer " + jwt}}
        ).then((res) => {
            setUserData(res.data)
            if (res.data.role != "admin" && res.data.role != "staff") {
                router.push("/")
            }
        })
    }
    const loadInfo = () => {
        axios.get("http://localhost:5000/vote/all/").then(
            (res) => {
                setVoteOptions(res.data.votes)
            }
        )
        axios.get("http://localhost:5000/candidate/").then(
            (res) => {
                setCandidateOptions(res.data)
            }
        )
    }
    useEffect(() => {
        getUserData();
        loadInfo();
    }, [])
    return (
        <main className="flex min-h-screen flex-col items-center justify-start ">
            <Header activeTab={"administration"}/>
            <ToastContainer/>
            <div className={"text-5xl p-20"}>Admin Panel</div>
            <div className={"flex rounded-xl text-2xl border-2 border-amber-800 px-10 py-4 flex-col"}>
                <div className={"cursor-pointer"} onClick={() => {
                    setIsOpenQr(!isOpenQr)
                }}>Qr-Code Generator
                </div>
                {isOpenQr &&
                    <div className={"flex space-y-4 mt-4 flex-col"}>
                        <input placeholder={"passport number"} className={"px-4 py-2 rounded-md bg-slate-700"}
                               value={passportQr} onChange={e => {
                            setPassportQr(e.target.value)
                        }}/>
                        <button className={"border-amber-800 rounded-2xl self-center px-4 py-2 border-2 bg-neutral-800"}
                                onClick={handleGenerateQr}>Generate Qr
                        </button>
                        <div dangerouslySetInnerHTML={{__html: responseQr}}/>
                    </div>}
            </div>
            {userData?.role == "admin" &&
                <div style={{width: 1100}}
                     className={"flex text-2xl mt-5 rounded-xl border-2 border-amber-800 px-10 py-4 items-center flex-col"}>
                    <div className={"flex space-x-4 text-4xl flex-row"}>
                        <div onClick={e => {
                            handleOpenTab((e.target as HTMLDivElement).innerText)
                        }} style={{border: isVote ? "3px solid darkcyan" : "3px solid transparent"}}
                             className={"bg-slate-700 px-5 cursor-pointer py-2 rounded-xl"}>Vote
                        </div>
                        <div onClick={e => {
                            handleOpenTab((e.target as HTMLDivElement).innerText)
                        }} style={{border: isCandidate ? "3px solid darkcyan" : "3px solid transparent"}}
                             className={"bg-slate-700 cursor-pointer px-5 py-2 rounded-xl"}>Candidate
                        </div>
                        <div onClick={e => {
                            handleOpenTab((e.target as HTMLDivElement).innerText)
                        }} style={{border: isOther ? "3px solid darkcyan" : "3px solid transparent"}}
                             className={"bg-slate-700 cursor-pointer px-5 py-2 rounded-xl"}>Other
                        </div>
                    </div>
                    {isVote &&
                        <div>
                            <div style={{width: 1030}}
                                 className={"flex text-2xl mt-5 rounded-xl border-2 text-center border-amber-800 px-10 py-4 flex-col"}>
                                <div onClick={e => {
                                    handleOpenTab((e.target as HTMLDivElement).innerText)
                                }} className={"cursor-pointer text-3xl"}>Add
                                </div>
                                {isAdd &&
                                    <div className={"flex space-y-4 mt-4 flex-col"}>
                                        <input value={voteEdit.name} onChange={(e) => {
                                            setVoteEdit((vote) => ({...vote, name: e.target.value}))
                                        }} className={"px-4 py-2 rounded-md bg-slate-700"} placeholder={"name"}/>
                                        <div className={"flex items-center justify-between"}>Start:
                                            <input value={voteEdit.beginning.toString().slice(0, 16)} onChange={(e) => {
                                                setVoteEdit((vote) => ({...vote, beginning: e.target.value}))
                                            }} className={"px-4 py-2 rounded-md bg-slate-700"} type={"datetime-local"}
                                                   placeholder={"beginning"}/>
                                        </div>
                                        <div className={"flex items-center justify-between"}>End:
                                            <input value={voteEdit.end.toString().slice(0, 16)} onChange={(e) => {
                                                setVoteEdit((vote) => ({...vote, end: e.target.value}))
                                            }} className={"px-4 py-2 rounded-md bg-slate-700"} type={"datetime-local"}
                                                   placeholder={"end"}/>
                                        </div>
                                        <input value={voteEdit.type} onChange={(e) => {
                                            setVoteEdit((vote) => ({...vote, type: e.target.value}))
                                        }} className={"px-4 py-2 rounded-md bg-slate-700"} placeholder={"type"}/>
                                        <input value={voteEdit.city} onChange={(e) => {
                                            setVoteEdit((vote) => ({...vote, city: e.target.value}))
                                        }} className={"px-4 py-2 rounded-md bg-slate-700"} placeholder={"city"}/>
                                        <div>Choose candidates</div>
                                        <div className={"flex flex-row"}>
                                            <DropdownWithSearch onSelect={handleSelectEditCandidate}
                                                                options={candidateOptions.map(can => (can.surname + " " + can.name))}/>
                                            <button onClick={handleAddCandidateToVote}
                                                    className={"border-amber-800 rounded-2xl self-center px-4 py-2 border-2 bg-neutral-800"}>Add
                                                Candidate
                                            </button>
                                        </div>
                                        <div>Chosen candidates:</div>
                                        <div className={"flex flex-wrap"}>

                                            {voteEditCandidates.map((can, index) => (
                                                <div
                                                    className={"border-slate-800 flex-1 whitespace-nowrap m-2 rounded-2xl px-4 py-2 border-2 bg-neutral-800"}
                                                    key={index}>{can.surname + " " + can.name}</div>
                                            ))}
                                        </div>
                                        <button
                                            className={"border-amber-800 w-60 rounded-2xl self-center px-4 py-2 border-2 bg-neutral-800"}
                                            onClick={() => {
                                                setVoteEditCandidates([])
                                            }}>Clear
                                        </button>
                                        <button onClick={handleAddVote}
                                                className={"border-amber-800 w-60 rounded-2xl self-center px-4 py-2 border-2 bg-neutral-800"}>Add
                                        </button>
                                    </div>}
                            </div>
                            <div
                                className={"flex text-2xl mt-5 rounded-xl border-2 text-center border-amber-800 px-10 py-4 flex-col"}>
                                <div onClick={e => {
                                    handleOpenTab((e.target as HTMLDivElement).innerText)
                                }} className={"cursor-pointer text-3xl"}>Edit
                                </div>
                                {isEdit &&
                                    <div className={"flex space-y-4 mt-4 flex-col"}>
                                        <DropdownWithSearch onSelect={handleSelectEditVote}
                                                            options={voteOptions.map(election => (election.name))}/>
                                        <input value={voteEdit.name} onChange={(e) => {
                                            setVoteEdit((vote) => ({...vote, name: e.target.value}))
                                        }} className={"px-4 py-2 rounded-md bg-slate-700"} placeholder={"name"}/>
                                        <div className={"flex items-center justify-between"}>Start:
                                            <input value={voteEdit.beginning.toString().slice(0, 16)} onChange={(e) => {
                                                setVoteEdit((vote) => ({...vote, beginning: e.target.value}))
                                            }} className={"px-4 py-2 rounded-md bg-slate-700"} type={"datetime-local"}
                                                   placeholder={"beginning"}/>
                                        </div>
                                        <div className={"flex items-center justify-between"}>End:
                                            <input value={voteEdit.end.toString().slice(0, 16)} onChange={(e) => {
                                                setVoteEdit((vote) => ({...vote, end: e.target.value}))
                                            }} className={"px-4 py-2 rounded-md bg-slate-700"} type={"datetime-local"}
                                                   placeholder={"end"}/>
                                        </div>
                                        <input value={voteEdit.type} onChange={(e) => {
                                            setVoteEdit((vote) => ({...vote, type: e.target.value}))
                                        }} className={"px-4 py-2 rounded-md bg-slate-700"} placeholder={"type"}/>
                                        <input value={voteEdit.city} onChange={(e) => {
                                            setVoteEdit((vote) => ({...vote, city: e.target.value}))
                                        }} className={"px-4 py-2 rounded-md bg-slate-700"} placeholder={"city"}/>
                                        <div>Choose candidates</div>
                                        <div className={"flex flex-row"}>
                                            <DropdownWithSearch onSelect={handleSelectEditCandidate}
                                                                options={candidateOptions.map(can => (can.surname + " " + can.name))}/>
                                            <button onClick={handleAddCandidateToVote}
                                                    className={"border-amber-800 rounded-2xl self-center px-4 py-2 border-2 bg-neutral-800"}>Add Candidate
                                            </button>
                                        </div>
                                        <div>Chosen candidates:</div>
                                        <div className={"flex flex-wrap"}>

                                            {voteEditCandidates.map((can, index) => (
                                                <div
                                                    className={"border-slate-800 flex-1 whitespace-nowrap m-2 rounded-2xl px-4 py-2 border-2 bg-neutral-800"}
                                                    key={index}>{can.surname + " " + can.name}</div>
                                            ))}
                                        </div>
                                        <button
                                            className={"border-amber-800 w-60 rounded-2xl self-center px-4 py-2 border-2 bg-neutral-800"}
                                            onClick={() => {
                                                setVoteEditCandidates([])
                                            }}>Clear
                                        </button>
                                        <button onClick={handleEditVote}
                                            className={"border-amber-800  w-60 rounded-2xl self-center px-4 py-2 border-2 bg-neutral-800"}>Edit
                                        </button>
                                    </div>}
                            </div>
                            <div
                                className={"flex text-2xl mt-5 rounded-xl border-2 text-center border-amber-800 px-10 py-4 flex-col"}>
                                <div onClick={e => {
                                    handleOpenTab((e.target as HTMLDivElement).innerText)
                                }} className={"cursor-pointer text-3xl"}>Delete
                                </div>
                                {isDelete &&
                                    <div className={"flex space-y-4 mt-4 flex-col"}>
                                        <DropdownWithSearch onSelect={handleSelectEditVote}
                                                            options={voteOptions.map(election => (election.name))}/>
                                        <button onClick={handleDeleteVote}
                                            className={"border-amber-800 w-60 rounded-2xl self-center px-4 py-2 border-2 bg-neutral-800"}>Delete
                                        </button>
                                    </div>}
                            </div>
                        </div>
                    }
                    {isCandidate &&
                        <div>
                            <div style={{width: 1030}}
                                 className={"flex text-2xl mt-5 rounded-xl border-2 text-center border-amber-800 px-10 py-4 flex-col"}>
                                <div onClick={e => {
                                    handleOpenTab((e.target as HTMLDivElement).innerText)
                                }} className={"cursor-pointer text-3xl"}>Add
                                </div>
                                {isAdd &&
                                    <div className={"flex space-y-4 mt-4 flex-col"}>
                                        <input value={candidateEdit.name} onChange={(e) => {
                                            setCandidateEdit((can) => ({...can, name: e.target.value}))
                                        }} className={"px-4 py-2 rounded-md bg-slate-700"} placeholder={"name"}/>
                                        <input value={candidateEdit.surname} onChange={(e) => {
                                            setCandidateEdit((can) => ({...can, surname: e.target.value}))
                                        }} className={"px-4 py-2 rounded-md bg-slate-700"} placeholder={"surname"}/>
                                        <textarea value={candidateEdit.aboutCandidate} onChange={(e) => {
                                            setCandidateEdit((can) => ({...can, aboutCandidate: e.target.value}))
                                        }} className={"px-4 py-2 rounded-md bg-slate-700"} placeholder={"about"}/>
                                        <button onClick={handleAddCandidate}
                                                className={"border-amber-800 rounded-2xl self-center px-4 py-2 border-2 bg-neutral-800"}>Add
                                        </button>
                                    </div>}
                            </div>
                            <div
                                className={"flex text-2xl mt-5 rounded-xl border-2 text-center border-amber-800 px-10 py-4 flex-col"}>
                                <div onClick={e => {
                                    handleOpenTab((e.target as HTMLDivElement).innerText)
                                }} className={"cursor-pointer text-3xl"}>Edit
                                </div>
                                {isEdit &&
                                    <div className={"flex space-y-4 mt-4 flex-col"}>
                                        <DropdownWithSearch onSelect={handleSelectEditCandidate}
                                                            options={candidateOptions.map(can => (can.surname + " " + can.name))}/>
                                        <input value={candidateEdit.name} onChange={(e) => {
                                            setCandidateEdit((can) => ({...can, name: e.target.value}))
                                        }} className={"px-4 py-2 rounded-md bg-slate-700"} placeholder={"name"}/>
                                        <input value={candidateEdit.surname} onChange={(e) => {
                                            setCandidateEdit((can) => ({...can, surname: e.target.value}))
                                        }} className={"px-4 py-2 rounded-md bg-slate-700"} placeholder={"surname"}/>
                                        <textarea value={candidateEdit.aboutCandidate} onChange={(e) => {
                                            setCandidateEdit((can) => ({...can, aboutCandidate: e.target.value}))
                                        }} className={"px-4 py-2 rounded-md bg-slate-700"} placeholder={"about"}/>
                                        <button onClick={handleEditCandidate}
                                                className={"border-amber-800 rounded-2xl self-center px-4 py-2 border-2 bg-neutral-800"}>Edit
                                        </button>
                                    </div>}
                            </div>
                            <div
                                className={"flex text-2xl mt-5 rounded-xl border-2 text-center border-amber-800 px-10 py-4 flex-col"}>
                                <div onClick={e => {
                                    handleOpenTab((e.target as HTMLDivElement).innerText)
                                }} className={"cursor-pointer text-3xl"}>Delete
                                </div>
                                {isDelete &&
                                    <div className={"flex space-y-4 mt-4 flex-col"}>
                                        <DropdownWithSearch onSelect={handleSelectEditCandidate}
                                                            options={candidateOptions.map(can => (can.surname + " " + can.name))}/>
                                        <button onClick={handleDeleteCandidate}
                                                className={"border-amber-800 rounded-2xl self-center px-4 py-2 border-2 bg-neutral-800"}>Delete
                                        </button>
                                    </div>}
                            </div>
                        </div>
                    }
                    {isOther&&
                        <div className={"flex text-3xl mt-5 space-y-4 px-10 py-4 flex-col"}>
                            <button onClick={handleExportDB} className={"rounded-xl border-2 text-center px-4 py-2 border-amber-800"}>Export database</button>
                            <button onClick={handleImportDB} className={"rounded-xl border-2 text-center px-4 py-2 border-amber-800"}>Import database from last backup</button>
                        </div>
                    }
                </div>
            }
        </main>
    )
}
