const enterMovie = document.getElementById('enterMovie')
const movieInp = document.getElementById('movieInp')

window.onload = () => {
    chrome.storage.local.get('blockedMovies', (result) => {
        console.log(result)
        result === null ? chrome.storage.local.set({'blockedMovies': []}) : null
    });
    console.log('updated')
};

enterMovie.addEventListener('click', (e) => {
    console.log('event started')
    movie = movieInp.value
    blockedMovies = chrome.storage.get('blockedMovies', (res) => {
        console.log(res)
    })
    blockedMovies.push(movie)
    chrome.storage.local.set({'blockedMovies': blockedMovies}, () => {
        console.log('Movie list updated')
    })    
});