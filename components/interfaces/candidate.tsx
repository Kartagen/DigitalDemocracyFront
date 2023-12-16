export interface CandidateInVote {
    _id: string;
    candidateId: Candidate;
}
export interface Candidate{
    _id: string;
    name: string;
    surname: string;
    aboutCandidate: string;
}
