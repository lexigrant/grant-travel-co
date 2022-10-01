import React, { useEffect } from "react";
import { useState } from "react";
import { Travel } from "../Types";
import GooglePlacesAutocomplete, { geocodeByPlaceId, getLatLng } from "react-google-places-autocomplete";
import { LatLng, } from "react-google-places-autocomplete/build/GooglePlacesAutocomplete.types";

const EditEntry = ({ handleUpdate, initialEntryToEdit }: { handleUpdate: (editEntry: Travel) => void, initialEntryToEdit: Travel }) => {

    const [travel, setTravel] = useState(initialEntryToEdit)
    const [value, setValue] = useState({ value: { place_id: "", structured_formatting: { main_text: "" } }, label: "" })

    useEffect(() => {
        if (value.value.place_id != "") {
            geocodeByPlaceId(value.value.place_id)
                .then(results => getLatLng(results[0]))
                .then(({ lat, lng }: LatLng) => {
                    setTravel({ ...travel, location: value.value.structured_formatting.main_text, address: value.label, latitude: lat, longitude: lng })
                    console.log("Got latitude and longitude", { lat, lng })
                })
        }
    }, [value])

    useEffect(() => {
        setTravel(initialEntryToEdit)
    }, [initialEntryToEdit])

    const handleChange = (e: any) => {
        setTravel({ ...travel, [e.target.name]: e.target.value });
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        handleUpdate(travel);
    }

    return (
        <>
        <h3 className="addFormHeader">Edit Diary Entry</h3>
            <div className="editFormContainer">
                <form onSubmit={handleSubmit} className="editForm">
                    <div className="editFormGoogleContainer">
                        <div className="editFormGoogleInput">
                            <GooglePlacesAutocomplete
                                selectProps={{
                                    value,
                                    onChange: setValue,
                                }} />
                        </div>
                    </div>
                    <textarea onChange={handleChange} value={travel.diaryEntry} name="diaryEntry" placeholder="Diary Entry" /><br />
                    <input className="editFormSubmit" value="Edit Entry" type="submit" />
                </form>
            </div>
        </>
    )
}

export default EditEntry;