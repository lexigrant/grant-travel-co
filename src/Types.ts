export type User = {
    id: number;
    email: string;
    name: string;
    picture: string;
    googleSub: string;

}

export type Travel = {
    id?: number;
    entryDate: Date;
    location: string;
    picture: string;
    latitude: number;
    longitude: number;
    address: string;
    diaryEntry: string;
}