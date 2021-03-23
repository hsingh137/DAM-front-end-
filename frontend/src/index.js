import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import MasterForm from './App';
import reportWebVitals from './reportWebVitals';

// the setTimeout simulates the time it takes react to load, and is not part of the solutio
const loader = document.querySelector('.loader');

// if you want to show the loader when React loads data again
const showLoader = () => loader.classList.remove('loader--hide');

const hideLoader = () => loader.classList.add('loader--hide');

setTimeout(() => 
  // the show/hide functions are passed as props
  ReactDOM.render(
    <MasterForm
      hideLoader={hideLoader}
      showLoader={showLoader} 
      />,
    document.getElementById('app')
  )
, 1000);

// ReactDOM.render(
// <React.StrictMode>
//     <MasterForm />
//     </React.StrictMode>,
//    document.getElementById('root')
//    );



// ReactDOM.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
//   document.getElementById('root')
// );


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
