import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { FirebaseAppProvider } from 'reactfire';
import 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyDT7IMCqKAwLyLGgXaCrp_DxXdvW-6tZG8",
    authDomain: "genesis-17b06.firebaseapp.com",
    databaseURL: 'https://genesis-17b06.firebaseio.com',
    projectId: "genesis-17b06",
    storageBucket: "genesis-17b06.appspot.com",
    messagingSenderId: "457234132629",
    appId: "1:457234132629:web:1c6a717139b742de14759c"
};

ReactDOM.render(
    <FirebaseAppProvider firebaseConfig={firebaseConfig}>
        <App />
    </FirebaseAppProvider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
