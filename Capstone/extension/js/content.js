// getting all the span and p tags
let textsEleSpan = document.getElementsByTagName('span')
let textsEleP = document.getElementsByTagName('p')

// The texts list will have all the texts in of the p and span elements and textsNode list will have the appropriate element 
let texts =[]
let textsNode = []

// Function to push into elements into texts and textsNode
const pushIntoList = (element_list) => {
    for (let t of element_list) {
        if(t.textContent.length > 15) {
            texts.push(t.textContent)
            textsNode.push(t)
        }
    }
}

// Pushing spans tag into texts and textsNode
pushIntoList(textsEleSpan)

// Pushing p tags into texts and textsNode
pushIntoList(textsEleP)
chrome.storage.local.get('isOn', (res) => {
    if(res.isOn) {
        try {
            let allText = texts.join(' ')

            // get the list of blocked movies 
            chrome.storage.local.get('blockedMovies', (res) => {
                let len = res.blockedMovies.length
                console.log(res.blockedMovies.length)
                console.log('here')
                if(res.blockedMovies.length > 0) {
                    res.blockedMovies.forEach((movie) => {
                        // Check if movie name exists in the article, statistically an article containing spoiler of the movie will have the name mentioned atleast once in the article
                        if(allText.toLowerCase().includes(movie.toLowerCase())) {
                            // if the movie name is present send the texts list to the ML model and that will determine if individual elements are spoiler text or not
                            Algorithmia.client("simp8MC5ZKi7uX9zOFPG4OPRt/L1")
                            .algo("radroid/spoiler_detection/0.2.1?timeout=300") // timeout is optional
                            .pipe(texts)
                            .then(function(output) {
                                // ALGORITHM OUTPUT
                                // 1 - spoiler 
                                // 0 - not spoiler 
                                hideSpoilers(output.result)
                            });
                        }
                    });
                }
            });
        } catch (e) {
            if (e !== BreakException) throw e;
        }
    }
});

const hideSpoilers = (spoiler_list) => {
    // Loop through the spoilers list and hide the content of the texts which are marked as spoilers
    spoiler_list.forEach((sp, i) => {
        if(sp === 1) {
            textsNode[i].textContent = 'Spoilers inside'
            textsNode[i].style.backgroundColor = 'red'
            textsNode[i].style.color = 'white'
            textsNode[i].style.fontWeight = 700
        }
    })
}