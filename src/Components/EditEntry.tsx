import React from "react";
import { useState } from "react";
import { Travel } from "../Types";

const EditEntry = ({ handleUpdate, initialEntryToEdit}: { handleUpdate: (editEntry: Travel) => void, initialEntryToEdit: Travel}) => {

    const [travel, setTravel] = useState(initialEntryToEdit)


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTravel({ ...travel, [e.target.name]: e.target.value });
    }


    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(travel);
        handleUpdate(travel)
    }

    return (
        <>
           <form onSubmit={handleSubmit}>
            <input onChange={handleChange} value={travel.entryDate.toDateString()} type="date" name="entryDate" /><br/>
            <input onChange={handleChange} type="text" name="diaryEntry" placeholder="Diary Entry"/><br/>
            <input value="Edit Entry" type="submit" />
        </form>
        </>
    )
}

export default EditEntry;