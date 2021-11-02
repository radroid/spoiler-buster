const movieSuggestion = document.getElementById('movieList')

// $('.basicAutoComplete').autoComplete({
//     minLength: 4,
//     resolverSettings: {
//         url: 'suggestion/suggestion.json'
//     }
// });

movieInp.addEventListener('input', (e)=> {
    let suggestionList = []
    text = e.target.value

    if(text.length >= 4) {
        fetch('http://www.omdbapi.com/?s='+text+'&apikey=56fa3a23')
            .then(data => {return data.json()})
            .then(res => {
                suggestionList = res['Search'].map((movie, i) => {
                    if(i < 4) {
                        // let temp = document.createElement('option')
                        // let tempText = document.createTextNode(movie['Title'])
                        // temp.appendChild(tempText)
                        // movieSuggestion.appendChild(temp)
                        return(movie['Title'])
                    }
                }); 
                // var json = JSON.stringify(suggestionList)
                // fs.writeFile('suggestion.json', json, 'utf8', () => {console.log('done')} )
            })
            .catch(err => {
                console.log(err)
            })

    } else {
        suggestionList = []
    }
});
