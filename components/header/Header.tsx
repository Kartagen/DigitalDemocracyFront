import Link from 'next/link';
import styles from './Header.module.css';
import React, {useEffect, useState} from "react";
import axios from "axios";
import "./../../pages/globals.css"
import {UserData} from "@/components/interfaces/userData";

interface HeaderProps {
    activeTab: string;
}

const Header: React.FC<HeaderProps> = ({ activeTab }) => {
    const[userData,setUserData] = useState<UserData|undefined>(undefined)
    const[userGreetings,setUserGreetings] = useState<string>("")
    const getUserData = () =>{
        let jwt = localStorage["jwt"];
        if(!jwt) return undefined
        axios.get("http://localhost:5000/vote_process/verify",
            {headers: {Authorization: "Bearer " + jwt}}
        ).then((res)=>{
            //console.log(res.data)
            setUserData(res.data)
            setUserGreetings(`Hello ${res.data.name+" "+res.data.surname}`)
        })
    }
    const handleExitAccount=()=>{
        localStorage.clear();
        setUserData(undefined)
    }
    const handleDragOverExit = () =>{
        setUserGreetings("Do you want to exit?")
    }
    const handleDragEndExit = () =>{
        setUserGreetings(`Hello ${userData?.name+" "+userData?.surname}`)
    }
    useEffect(() => {
        getUserData();
    },[])
    return (
        <div className={styles.header}>
            <div className={styles.logo}>
                <Link href="/">
                    <label>DigitalDemocracy</label>
                </Link>
            </div>
            <div className={styles.tabs}>
                <Link href="/active">
                    <label className={activeTab === 'active' ? styles.active : ''}>Active Elections</label>
                </Link>
                <Link href="/elections">
                    <label className={activeTab === 'elections' ? styles.active : ''}>Elections</label>
                </Link>
                <Link href="/results">
                    <label className={activeTab === 'results' ? styles.active : ''}>Results</label>
                </Link>
                {(userData?.role=="admin"||userData?.role=="staff")&&
                <Link href="/administration">
                    <label className={activeTab === 'administration' ? styles.active : ''}>Administration</label>
                </Link>}
                {userData==undefined&&
                <Link href="/login">
                    <label className={activeTab === 'registration' ? styles.active : ''}>Authorization</label>
                </Link>}
                {userData!=undefined&&
                    <label onMouseLeave={handleDragEndExit} onMouseOver={handleDragOverExit} onClick={handleExitAccount}>{userGreetings}</label>}
            </div>
        </div>
    );
};

export default Header;