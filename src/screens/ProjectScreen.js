import React, { Component } from 'react';

import {
    ScrollView,
    Text,
    TextInput,
    View,
    Button,
    Image,
    ActivityIndicator
} from 'react-native';

import { connect } from 'react-redux';

import {projectActions} from '../actions';

import {setToken} from "../prefs";


class ProjectScreen extends Component {
    static navigationOptions = {
        title: "Project"
    };

    render() {

        console.log("-- ProjectScreen render() :: username: " + this.props.username );
        console.log("-- ProjectScreen render() :: token: " + this.props.token );

        setToken(this.props.token);

        return (
            <View style={{padding: 20}}>
                <Button
                    title="Add Issue"
                    onPress={
                         () => {
                            this.props.getAllProjects(this.props.token);
                            this.props.navigation.navigate("ProjectList");
                        }
                     }
                    >
                    <Image source={require('../images/project.png')} style={{width: 40, height: 40}} />
                </Button>
                <View style={{ height: 10 }} />

            </View>
        );
    }
}//ProjectScreen

const mapStateToProps = (state, ownProps) => {
    return {
        username: state.auth.username,
        token: state.auth.token
    };
}
 
const mapDispatchToProps = (dispatch) => {
    return {
        onLogout: () => { dispatch(logout()); },
        getAllProjects: (token) => { dispatch(projectActions.getAll(token)); }
    }
}
 
export default connect(mapStateToProps, mapDispatchToProps)(ProjectScreen);