import React from 'react';
import { Text, View, StyleSheet, Linking, Image } from 'react-native';
import Button from '../components/Button';


export default function AppPublished({appPublishedUrl} : {appPublishedUrl: string}) {

    function goToStore() {
        Linking.openURL(appPublishedUrl ?  appPublishedUrl : 'https://play.google.com/store/apps/')
    }

    return (
        <View style={styles.container}>
            <Image source={require('../assets/icon.png')} style={styles.image} />
            <Text style={styles.header}>Get the Full Experience!</Text>
            <Text style={styles.paragraph}>Good news! Our app is now live on the App Store. Please switch from the demo version to enjoy all the new and exclusive features waiting for you. Update today!</Text>
            <Button
                text="Download it now!"
                onPress={goToStore}
                textColor='black'
                stylesProp={styles.buttonStyle}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        backgroundColor: "#E1FCFF"
    },
    header: {
        fontSize: 30,
        color: 'black',
        fontWeight: 'bold',
        fontFamily: 'sans-serif-light',
        textAlign: 'center',
        position: 'relative',
        top: -40,
        textTransform: 'uppercase',
        paddingBottom: 20,
    },
    image : {
        width: 200,
        height: 200,
        position: 'relative',
        top: -40,
    },
    paragraph: {
        fontSize: 20,
        color: 'black',
        fontFamily: 'sans-serif-light',
        textAlign: 'justify',
        position: 'relative',
        top: -40,
    },
    buttonStyle: {
        position: 'relative',
        padding: 10,
        paddingHorizontal: 20,
        borderRadius: 40,
        borderWidth: 1,
        borderColor: 'black',
        backgroundColor: '#99f5ff',
        // subtle shadow
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 2,
        elevation: 5,
    }
});

