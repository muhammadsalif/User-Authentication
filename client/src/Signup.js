import React, { useState } from 'react'
import axios from "axios"
export default function Signup() {
    const [email, setEmail] = useState()
    const [userName, setUserName] = useState()
    const [password, setPassword] = useState()

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log("handle")
        // axios.post('http://localhost:5000/signup', {
        //     userName,
        //     email,
        //     password
        // })
        //     .then(function (response) {
        //         alert(response.request)
        //         console.log(response.request);
        //     })
        //     .catch(function (error) {
        //         alert(error)
        //         console.log(error);
        //     });

    }
    return (

        <form>
            <div className="mb-3">
                <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
                <input required onChange={(e) => {
                    setEmail(e.target.value)
                }} type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" />
            </div>

            <div className="mb-3">
                <label htmlFor="exampleInputEmail1" className="form-label">User Name</label>
                <input required onChange={(e) => {
                    setUserName(e.target.value)
                }} type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" />
            </div>

            <div className="mb-3">
                <label htmlFor="exampleInputEmail1" className="form-label">Password</label>
                <input required onChange={(e) => {
                    setPassword(e.target.value)
                }} type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" />
            </div>

            <button type="submit" onSubmit={(e) => {
                e.preventDefault();
                console.log("hello")

            }} className="btn btn-primary">Submit</button>
        </form>
    )
}
