import {
    ScrollView,
    Text,
    TextInput,
    View,
    Image,
    Button,
    Dimensions,
    ImageBackground,
    ActivityIndicator
} from 'react-native';


import React, { Component } from 'react';

import { connect } from 'react-redux';

import {login} from '../actions/user.actions';

import CustomButton from '../components/CustomButton';


class LoginScreen extends Component {


    static navigationOptions = {
        title: "TM Login"
    };

    //------------------
    // constructor
    //------------------

    constructor(props) {
        super(props);

        //-------------------
        // state
        //-------------------
        
        this.state = {
            username: '',
            password: '',
            isLoggingIn: false,
            message: ''
        }


    }


    //-----------------------------------------------
    // function to login user
    //-----------------------------------------------
    _userLogin = () => { 

        console.log("-- _userLogin  --");


        this.setState({isLoggingIn: true, message:''});

        var params = {
            email: this.state.username,
            password: this.state.password 

        };
        

        //----------------------------------------
        // composing form body
        //----------------------------------------
        var formBody = [];
        for (var property in params) {
          var encodedKey = encodeURIComponent(property);
          var encodedValue = encodeURIComponent(params[property]);
          formBody.push(encodedKey + "=" + encodedValue);
        }
        formBody = formBody.join("&");

        console.log("[LoginScreen] :: formBody: " + formBody);

        //----------------------------------------
        // sending login request to server
        // ---------------------------------------
        var proceed = false;
        var token = '';
        fetch("https://teammanager9.herokuapp.com/users/login", {
            method: "POST", 
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: formBody
          })
          .then((response) => response.json())
          .then((response) => {

            console.log("[LoginScreen] :: _userLogin :: server resp: " + JSON.stringify(response) );

            if (response.success===false) {
                this.setState({message: response.message});
                this.setState({isLoggingIn:false});
            }
            else {
             proceed = true;
             token = response.token;
             console.log("[LoginScreen] :: token="+response.token);
             this.props.onLogin(response.email,response.token);
             this.props.navigation.navigate("Main");
             this.exit; 
            }
        })

    }//_userLogin



    render() {
        console.log("-- LoginScreen render()  --");

        return (
            <ImageBackground  style={{  padding: 10, width: Dimensions.get('window').width, height: Dimensions.get('window').height }} source={require('../images/bg1.png')}>

                <Image source={require('../images/tmtitle.png') } style={{ marginTop: 20, width: Dimensions.get('window').width, height: 60}}/>   

                <View style={{height:50}} />

                <Text 
                    style={{fontSize: 27, color: 'white' }}>
                    Login
                </Text>

                <TextInput
                    style= {{ fontSize: 18, color: 'white' }} 
                    ref={component => this._username = component}
                    placeholder='Email'
                    placeholderTextColor= 'white' 
                    onChangeText={(username) => this.setState({username})}
                    autoFocus={true}
                />
                <TextInput 
                    style= {{ fontSize: 18, color: 'white' }} 
                    ref={component => this._password = component}
                    placeholder='Password' 
                    placeholderTextColor= 'white' 
                    onChangeText={(password) => this.setState({password})}
                    secureTextEntry={true}
                    onSubmitEditing={this._userLogin}
                />


                {!!this.state.message && (
                    <Text
                        style={{fontSize: 14, color: 'red', padding: 5}}>
                    {this.state.message}
                    </Text>
                )}

                {this.state.isLoggingIn && <ActivityIndicator />}
                
                <View style={{margin:7}} />

                <View style={{flex: 1, flexDirection: 'row', margin: 10, justifyContent: 'center', alignItems: 'center'}}>
                <CustomButton 
                    color='#1a9187'
                    disabled={this.state.isLoggingIn||!this.state.username||!this.state.password}
                    onPress={this._userLogin}
                    title="Login"
                />
                <View style={{width:7}} />
                <CustomButton
                    title="Register"
                    color='#1a9187'
                    onPress={ () => this.props.navigation.navigate("Register")}
                />
                </View>

                </ImageBackground>

            )//return
    }//render
}//LoginScreen


const mapStateToProps = (state, ownProps) => {
    return {
        isLoggedIn: state.auth.isLoggedIn
    };
}
 
const mapDispatchToProps = (dispatch) => {
    return {
        onLogin: (email, token) => { dispatch(login(email, token)); }
        //onSignUp: (username, password) => { dispatch(signup(username, password)); }
    }
}
 
export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen);