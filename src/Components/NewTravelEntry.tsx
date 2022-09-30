import React, { useEffect } from "react";
import { useState } from "react";
import { Travel } from "../Types";
import GooglePlacesAutocomplete, { geocodeByPlaceId, getLatLng } from "react-google-places-autocomplete";
import { LatLng,  } from "react-google-places-autocomplete/build/GooglePlacesAutocomplete.types";

const NewTravelEntry = ({ handlePost }: { handlePost: (newEntry: Travel) => void }) => {

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
    const [value, setValue] = useState({value: {place_id: "", structured_formatting: {main_text: ""}}, label: ""})

    useEffect(() => {
        if(value.value.place_id != "") {
            geocodeByPlaceId(value.value.place_id)
            .then(results => getLatLng(results[0]))
            .then(({lat, lng}: LatLng) => {
                setTravel({...travel, location: value.value.structured_formatting.main_text, address: value.label, latitude: lat, longitude: lng})
                console.log("Got latitude and longitude", {lat, lng})
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
            <h3>Add Diary Entry</h3>
            <form onSubmit={handleSubmit}>
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
    )
}
export default NewTravelEntry;