// submit btn to add the movie to the blocked list
const enterMovie = document.getElementById('enterMovie')
// input to enter the movie
const movieInp = document.getElementById('movieInp')
// list of blocked movies 
const blockedMovieList = document.getElementById('blockedMovieList')
// extension on or off toggle
const extnPower = document.getElementById('extnToggle')

// initialize blockedmovie list everytime the pop is loaded
chrome.storage.local.get('blockedMovies', (result) => {
    // if the blockedmovie list from the local storage is still undefined ie its 
    // the first time we are opening the extension define it as an empty list
    if(typeof(result) === 'object') { 
        if(result.blockedMovies === undefined) {
            chrome.storage.local.set({'blockedMovies': []}, ()=> {
                console.log('set variable')
            });
        }
    }

    // get the list of movies and display them in the popup
    result.blockedMovies.forEach(movie => {
        addMovieNode(movie)
    });
});

// initialize the extension power state everytime the pop opens up
chrome.storage.local.get('isOn', (res) => {
    // if the popup is opened for the first time the extension powerstate wont be defined so initialize it to off ie false
    // else initialize whatever is the powerstate of the extension
    if(res.isOn === undefined) {
        chrome.storage.local.set({'isOn': false}, () => {
            console.log('extension power button initialized !!')
            setExtensionState(false)
        })
    } else { 
        console.log('Intiialize'+ res.isOn)
        setExtensionState(res.isOn)
    }
});

// when a movie is entered check if the movie is empty append it to the blocked movie list and clear the input value
enterMovie.addEventListener('click', (e) => {
    let movie = movieInp.value
    if(movie !== '' && movie !== ' ') {
        let bm = [] 
        chrome.storage.local.get('blockedMovies', (res) => {
            bm = res.blockedMovies
            bm.push(movie)
            chrome.storage.local.set({'blockedMovies': [...bm]}, () => {
                console.log('Blocklist updated')
            });

            addMovieNode(movie)
        });    
    } else {
        alert('Enter valid movie, series or book name!')
    }
     
    movieInp.value = ''
});

// function to remove the selected movie from the blocked movie list
const removeSelectedMovie = (e, movieName) => {
    chrome.storage.local.get('blockedMovies', (res) => {
        let temp = res.blockedMovies;
        let index = temp.indexOf(movieName)
        if(index !== -1) {
            temp.splice(index, 1)
        }

        chrome.storage.local.set({'blockedMovies': [...temp]}, () => {
            blockedMovieList.removeChild(blockedMovieList.childNodes[index])
        });
    });
}

// function to display the movie in the popup 
const addMovieNode = (movieName) => {
    let closeTag = document.createElement('a')
    let closeText = document.createTextNode('X')
    closeTag.appendChild(closeText)
    closeTag.setAttribute('class', 'removeMovie')
    let temp = document.createElement('div')
    let movieText = document.createTextNode(movieName)
    let movieSpan =document.createElement('span')
    movieSpan.appendChild(movieText)
    movieSpan.setAttribute('name', movieName)
    closeTag.addEventListener('click', (e) =>{removeSelectedMovie(e, movieName)})
    temp.appendChild(movieSpan)
    temp.appendChild(closeTag)
    blockedMovieList.appendChild(temp)
}

// function to toggle the extension on or off
const setExtensionState = (state) => {
    if(state) {
        extnPower.setAttribute('checked', state)
    } else {
        extnPower.removeAttribute('checked')
    }  
}

// function to toggle the isOn state when the user toggles the state in the popup
const toggleFilter = () => {
    chrome.storage.local.get('isOn', (res) => {
        console.log('here')
        console.log(!res.isOn)
        let tempState = res.isOn
        chrome.storage.local.set({'isOn': !tempState}, () => {
            setExtensionState(!tempState)
            chrome.tabs.reload()
        });
    });
}

// add an eventlistener to check for toggle of extension power
extnPower.addEventListener('click', (e) => {
    toggleFilter()
});

