const URL = "https://resign.byiconic.at";
const API_URL = URL + "/api";

const LOCALSTORAGE_KEY = "userId";

//Functions from here
function readFromLocalStorage(keyword) {
  try{
    let result = localStorage.getItem(keyword);
    return result;
  }catch(error) {
    console.error(error);
    return undefined;
  }
}

function writeToLocalStorage(keyword, value) {
    if(keyword == undefined || value == undefined) {
        console.error(`(Func: ${arguments.callee.toString()}) Keyword or value cannot be undefined!`);
        //throw `(Func: ${arguments.callee.toString()}) Keyword or value cannot be undefined!`;
    }

    localStorage.setItem(keyword, value);
}

function isLoggedIn() {
  let user = readFromLocalStorage(LOCALSTORAGE_KEY);

  if(user == undefined)
    return false;

  return true;
}

//[Async] function that returns a Promise of the response
function getResponse(httpverb, urlext, body){
    //check parameters
    const httpMethod = httpverb.toUpperCase();
    if(httpMethod !== 'GET'
      && httpMethod !== 'POST'
      && httpMethod !== 'PUT'
      && httpMethod !== 'DELETE')
        console.error(`HTTP Verb "${httpMethod}" not supported!`);


    //Build the request 🔥
    const reqUrl = API_URL + urlext;
    const request = {
        method: httpMethod, // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
          'Content-Type': 'application/json'

        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        //body: JSON.stringify(body) // body data type must match "Content-Type" header
    };

    //if body is set, add it to the request (as JSON)
    if(body !== undefined)
        request.body = JSON.stringify(body);

    return fetch(reqUrl, request);
}

async function login(username, password) {
  const res = await getLoginResponse(username, password);

  if (res.ok){
    //Save userId to localstorage
    
    writeToLocalStorage(LOCALSTORAGE_KEY, user.guid);
    return true;
  }
  else {
    //Show "failed to login" message
    console.error("Failed to login, username or password wrong?");
    return false;
  }  
}

async function getRegisterResponse(username, firstname, lastname, password){
  const reqUrl = API_URL + "/user";
  const reqBody = {
    "username" : username,
    "firstname" : firstname,
    "lastname" : lastname,
    "organisationId" : 1
  }
    const response = await fetch(reqUrl, {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        //'Content-Type': 'application/json',
        'password': password
      },
      redirect: 'follow', // manual, *follow, error
      referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: JSON.stringify(reqBody) // body data type must match "Content-Type" header
    });

    user = await response.json();
    return response;
}
//function that checks if the given user and password represent an existing user in our system
async function getLoginResponse(username, password) {
    const reqUrl = API_URL + "/user/check";

    const response = await fetch(reqUrl, {
      method: 'GET', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        //'Content-Type': 'application/json',
        'username': username,
        'password': password
      },
      redirect: 'follow', // manual, *follow, error
      referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      //body: JSON.stringify(reqBody) // body data type must match "Content-Type" header
    });

    user = await response.json();
    return response;
}

//Gets the current status of the user, if he is checked in or checked out currently (or undefined if not logged in)
async function getCurrentStatus() {
  if(userId == undefined)
    return undefined;

  const response = await (await getResponse("GET", `/user/status/${userId}`, undefined)).json();
  
}