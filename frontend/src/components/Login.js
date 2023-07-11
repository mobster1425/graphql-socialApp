import React from "react";
import { useMutation } from "@apollo/client";
import { useContext } from "react";
import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { Button, Form } from "semantic-ui-react";
import { AuthContext } from "../context/auth";
import { LOGIN_USER } from "../utils/graphqlQueries";
import { useForm } from "../utils/hooks";


function Login () {
    const [error, setError] = useState({});
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const {formData, onChange, onSubmit } = useForm({
        email: '',
        password: ''
    }, loginCallBack);

    const [loginUser, { loading }] = useMutation(LOGIN_USER, {
        update(proxy, { data: { login: userData } }) {
            login(userData);
            navigate('/');
        },
        onError(err) {
            setError(err?.graphQLErrors[0]?.extensions?.errors);
        },
        variables: formData
    });

    function loginCallBack() {
        console.log('form data is', JSON.stringify(formData));
        return loginUser();
        
    }


    return (<div>
        <Form onSubmit={onSubmit} noValidate loading={loading}>
            <h1>Login</h1>
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
            <Button type="submit" primary>Login</Button>
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

export default Login;