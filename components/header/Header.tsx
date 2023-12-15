import Link from 'next/link';
import styles from './Header.module.css';
import React from "react";

interface HeaderProps {
    activeTab: string;
}

const Header: React.FC<HeaderProps> = ({ activeTab }) => {

    return (
        <div className={styles.header}>
            <div className={styles.logo}>
                <Link href="/">
                    <label>DigitalDemocracy</label>
                </Link>
            </div>
            <div className={styles.tabs}>
                <Link href="/elections">
                    <label className={activeTab === 'elections' ? styles.active : ''}>Elections</label>
                </Link>
                <Link href="/results">
                    <label className={activeTab === 'results' ? styles.active : ''}>Results</label>
                </Link>
                <Link href="/candidates">
                    <label className={activeTab === 'candidates' ? styles.active : ''}>Candidates</label>
                </Link>{}
                <Link href="/administration">
                    <label className={activeTab === 'administration' ? styles.active : ''}>Administration</label>
                </Link>
                <Link href="/login">
                    <label className={activeTab === 'registration' ? styles.active : ''}>Authorization</label>
                </Link>
            </div>
        </div>
    );
};

export default Header;