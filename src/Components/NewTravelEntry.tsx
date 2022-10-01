import React, { useEffect } from "react";
import { useState } from "react";
import { Travel } from "../Types";
import GooglePlacesAutocomplete, { geocodeByPlaceId, getLatLng } from "react-google-places-autocomplete";
import { LatLng, } from "react-google-places-autocomplete/build/GooglePlacesAutocomplete.types";

const NewTravelEntry = ({ handlePost, isShowing, onClickAdd }: { handlePost: (newEntry: Travel) => void, isShowing: boolean, onClickAdd: () => void }) => {

    // variable declaration
    let emptyTrip: Travel = {
        entryDate: new Date(),
        location: '',
        picture: '',
        latitude: 0,
        longitude: 0,
        address: '',
        diaryEntry: ''
    }
    // State Declaration

    const [travel, setTravel] = useState(emptyTrip)
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


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTravel({ ...travel, [e.target.name]: e.target.value });
    }


    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(travel);
        handlePost(travel);

    }


    return (
        <>
            {isShowing ? <>
                <h3 className="addFormHeader">Add Diary Entry</h3>
                <form onSubmit={handleSubmit} className="addForm">
                    <input onChange={handleChange} type="date" name="entryDate" placeholder="Example: Thu Oct 20 2022" /><br />
                    <GooglePlacesAutocomplete
                        selectProps={{
                            value,
                            onChange: setValue,
                        }} />
                    <input onChange={handleChange} type="text" name="picture" placeholder="Example: https://assets.vogue.com/photos/5beb5d0a7509832ced4424f1/master/pass/00-promo-image-kansas-city-missouri-travel-guide.jpg" /><br />
                    <input onChange={handleChange} type="text" name="diaryEntry" placeholder="Example: Dear Diary, ..." /><br />
                    <input value='Add Entry' type="submit" />
                </form>
            </>
                : <button className="addButton" onClick={onClickAdd}><svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12ZM12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4Z"
                        fill="currentColor"
                    />
                    <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M13 7C13 6.44772 12.5523 6 12 6C11.4477 6 11 6.44772 11 7V11H7C6.44772 11 6 11.4477 6 12C6 12.5523 6.44772 13 7 13H11V17C11 17.5523 11.4477 18 12 18C12.5523 18 13 17.5523 13 17V13H17C17.5523 13 18 12.5523 18 12C18 11.4477 17.5523 11 17 11H13V7Z"
                        fill="currentColor"
                    />
                </svg></button>}
        </>

    )
}
export default NewTravelEntry;