/*
 * Copyright (c) 2017, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import React, {Component} from 'react';
import Checkbox from 'material-ui/Checkbox';
import TextField from 'material-ui/TextField';
import {Redirect, Switch} from 'react-router-dom';
import AuthHandler from '../../../api/authHandler';
import RaisedButton from 'material-ui/RaisedButton';
import {Card, CardActions, CardTitle} from 'material-ui/Card';

/**
 * The Login Component.
 *
 * This component contains the Login form and methods to handle field change events.
 * The user name and password will be set to the state and sent to the api.
 *
 * If the user is already logged in, it will redirect to the last point where the user was.
 * */
class Login extends Component {
    constructor() {
        super();
        this.state = {
            isLoggedIn: false,
            referrer: "/",
            userName: "",
            password: "",
            rememberMe: true,
            errors: {}
        }
    }

    componentWillMount() {
        console.log("IN Login")
    }

    componentDidMount() {
        console.log("in Login")
    }

    handleLogin(event) {
        event.preventDefault();
        this.validateForm();
    }

    /**
     * Handles the username field change event.
     * */
    onUserNameChange(event, value) {
        this.setState(
            {
                userName: value
            }
        );
    }

    /**
     * Handles the password field change event.
     * */
    onPasswordChange(event, value) {
        this.setState(
            {
                password: value
            }
        );
    }

    /**
     * Handles the remember me check.
     * */
    handleRememberMe() {
        this.setState(
            {
                rememberMe: !this.state.rememberMe
            }
        );
    }

    /**
     * Validate the login form.
     * */
    validateForm() {
        let errors = {};
        let validationFailed = true;
        if (!this.state.password) {
            errors["passwordError"] = "Password is Required";
            validationFailed = true;
        } else {
            validationFailed = false;
        }

        if (!this.state.userName) {
            errors["userNameError"] = "User Name is Required";
            validationFailed = true;
        } else {
            validationFailed = false;
        }

        if (validationFailed) {
            this.setState({errors: errors}, console.log(errors));
        } else {
            let loginPromis = AuthHandler.login(this.state.userName, this.state.password);
            loginPromis.then(response => {
                console.log(AuthHandler.getUser());
                this.setState({isLoggedIn: AuthHandler.getUser()});
            })
        }
    }

    render() {

        if (!this.state.isLoggedIn) {
            return (
                <div>
                    {/*TODO: Style the components.*/}

                    <Card>
                        <CardTitle title="WSO2 IoT App Publisher"/>
                        <CardActions>
                            <form onSubmit={this.handleLogin.bind(this)}>
                                <TextField
                                    hintText="Enter the User Name."
                                    id="username"
                                    errorText={this.state.errors["userNameError"]}
                                    floatingLabelText="User Name*"
                                    floatingLabelFixed={true}
                                    value={this.state.userName}
                                    onChange={this.onUserNameChange.bind(this)}
                                />
                                <br/>
                                <TextField
                                    hintText="Enter the Password."
                                    id="password"
                                    type="password"
                                    errorText={this.state.errors["passwordError"]}
                                    floatingLabelText="Password*"
                                    floatingLabelFixed={true}
                                    value={this.state.password}
                                    onChange={this.onPasswordChange.bind(this)}
                                />
                                <br/>
                                <Checkbox
                                    label="Remember me."
                                    onCheck={this.handleRememberMe.bind(this)}
                                    checked={this.state.rememberMe}
                                />
                                <br/>
                                <RaisedButton type="submit" label="Login"/>
                            </form>
                        </CardActions>
                    </Card>
                </div>);
        } else {
            return (
                <Switch>
                    <Redirect to={this.state.referrer}/>
                </Switch>
            );
        }
    }
}

export default Login;
