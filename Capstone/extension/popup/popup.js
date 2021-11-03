const enterMovie = document.getElementById('enterMovie')
const movieInp = document.getElementById('movieInp')
const blockedMovieList = document.getElementById('blockedMovieList')

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