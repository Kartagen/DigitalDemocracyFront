interface CandidateRes {
    id: string;
    name: string;
    surname: string;
    aboutCandidate: string;
    votes: number;
}

interface ElectionRes {
    vote: {
        _id: string;
        name: string;
        beginning: string;
        end: string;
        type: string;
    };
    count: number;
    info: CandidateRes[];
}