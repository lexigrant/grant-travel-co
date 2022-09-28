import { Travel } from "../Types";

const TravelEntry = ({travelEntry, handleDelete}: {travelEntry: Travel, handleDelete: () => void}) => {

    return(
        <>
        <p>{travelEntry.location}</p>
        <p>{travelEntry.entryDate.toDateString()}</p>
        <p>{travelEntry.diaryEntry}</p>
        <button onClick={handleDelete}>X</button>
        </>
    )

}

export default TravelEntry;