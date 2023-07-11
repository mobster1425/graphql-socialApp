import React from "react";
import {  useMutation } from "@apollo/client";
import { useContext, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { Button, Form } from "semantic-ui-react";
import { AuthContext } from "../context/auth";
import { REGISTER_USER } from "../utils/graphqlQueries";
import { useForm } from "../utils/hooks";


function Register () {
    const [error, setError] = useState({});
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const {formData, onChange, onSubmit } = useForm({
        name: '',
        email: '',
        password: '',
       
    }, registerCallBack);

    const [registerUser, { loading }] = useMutation(REGISTER_USER, {
        update(proxy, { data: { register } }) {
           // console.log(`register in the frontend is ${register}`)
            login(register);
            navigate('/');
        },
        onError(err) {
            setError(err.graphQLErrors[0]?.extensions.errors);
        },
        variables: formData
    });

    function registerCallBack() {
       // console.log(`form data is ${formData}`);
       console.log('form data is', JSON.stringify(formData));

        return registerUser();
      
      
    }


    return (
    <div>
        <Form onSubmit={onSubmit} noValidate loading={loading}>
            <h1>Register</h1>
            <Form.Input 
                label="name"
                placeholder="name"
                name="name"
                type="text"
                error={!!error?.name}
                value={formData?.name}
                onChange={onChange}
            />
            <Form.Input 
                label="Email"
                placeholder="Email"
                name="email"
                type="email"
                error={!!error?.email}
                value={formData?.email}
                onChange={onChange}
            />
            <Form.Input 
                label="Password"
                placeholder="Password"
                name="password"
                type="password"
                error={!!error?.password}
                value={formData?.password}
                onChange={onChange}
            />
           
            <Button type="submit" primary>Register</Button>
        </Form>
        {error && !!Object.keys(error)?.length && 
            <div className="ui error message">
                <ul className="list">
                    {Object.values(error)?.map((value, index) => <li key={index}>{value}</li>)}
                </ul>
            </div>
        }
    </div>);
};

export default Register;