const enterMovie = document.getElementById('enterMovie')
const movieInp = document.getElementById('movieInp')
const blockedMovieList = document.getElementById('blockedMovieList')
const extnPower = document.getElementById('extnToggle')

chrome.storage.local.get('blockedMovies', (result) => {
    if(typeof(result) === 'object') { 
        if(result.blockedMovies === undefined) {
            chrome.storage.local.set({'blockedMovies': []}, ()=> {
                console.log('set variable')
            });
        }
    }

    result.blockedMovies.forEach(movie => {
        addMovieNode(movie)
    });
});

chrome.storage.local.get('isOn', (res) => {
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

enterMovie.addEventListener('click', (e) => {
    let movie = movieInp.value
    if(movie !== '' && movie !== ' ') {
        let bm = [] 
        chrome.storage.local.get('blockedMovies', (res) => {
            bm = res.blockedMovies
            bm.push(movie)
            chrome.storage.local.set({'blockedMovies': [...bm]}, () => {
                console.log('Movie list updated')
            });

            addMovieNode(movie)
        });    
    } else {
        alert('Enter valid movie Name !')
    }
     
    movieInp.value = ''
});

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

const setExtensionState = (state) => {
    if(state) {
        extnPower.setAttribute('checked', state)
    } else {
        extnPower.removeAttribute('checked')
    }
    
}

const toggleFilter = () => {
    chrome.storage.local.get('isOn', (res) => {
        console.log('here')
        console.log(!res.isOn)
        let tempState = res.isOn
        chrome.storage.local.set({'isOn': !tempState}, () => {
            setExtensionState(!tempState)
        });
    });
}

extnPower.addEventListener('click', (e) => {
    toggleFilter()
});

