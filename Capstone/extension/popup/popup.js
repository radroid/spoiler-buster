const enterMovie = document.getElementById('enterMovie')
const movieInp = document.getElementById('movieInp')


chrome.storage.local.get('blockedMovies', (result) => {
    console.log('onload')
    typeof(result) === 'object' ? chrome.storage.local.set({'blockedMovies': []}, ()=> {console.log('set variable')}) : null
});

enterMovie.addEventListener('click', (e) => {
    movie = movieInp.value
    if(movieInp.value !== '') {
        bm = [] 
        console.log(bm)
        chrome.storage.local.get('blockedMovies', (res) => {
            console.log('This is the storage '+res.blockedMovies)
            bm = res.blockedMovies
            bm.push(movie)
            console.log(bm)
            chrome.storage.local.set({'blockedMovies': [...bm]}, () => {
                console.log('Movie list updated')
            })
        })    
    }
     
    movieInp.value = ''
});