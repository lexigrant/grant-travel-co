import React from "react";
import { useState } from "react";
import { Travel } from "../Types";
import EditEntry from "./EditEntry";

const TravelEntry = ({ travelEntry, handleDelete, handleUpdate }: { travelEntry: Travel, handleDelete: () => void, handleUpdate: (editEntry: Travel) => void }) => {



    return (
        <>
            <p>{travelEntry.entryDate.toDateString()}</p>
            <p>{travelEntry.location}</p>
            <img style={
                {height: 50, width:50}
            } src={travelEntry.picture}/>
            <p>{travelEntry.diaryEntry}</p>
            <EditEntry handleUpdate={handleUpdate} initialEntryToEdit={travelEntry}/>
            <button onClick={handleDelete}>X</button>
        </>
    )

}

export default TravelEntry;