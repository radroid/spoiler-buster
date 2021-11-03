let textsEle = document.getElementsByTagName('span')
// textsEle = textsEle + document.getElementsByTagName('p')

let texts =[]
for (let t of textsEle) {
    texts.push(t.textContent)
}

try {
    let allText = texts.join(' ')

    chrome.storage.local.get('blockedMovies', (res) => {
        res.blockedMovies.forEach((movie) => {
            if(allText.toLowerCase().includes(movie.toLowerCase())) {
                Algorithmia.client("simp8MC5ZKi7uX9zOFPG4OPRt/L1")
                .algo("radroid/spoiler_detection/0.1.0?timeout=300") // timeout is optional
                .pipe(allText)
                .then(function(output) {
                    console.log(output.result)
                    if(output.result === "contains spoiler") {
                        document.getElementsByTagName('body')[0].setAttribute('style', 'filter: blur(10px)')
                        setTimeout(()=> {
                            if(confirm('There might be a spoiler here. Are you sure you want to continue ?')) {
                                document.getElementsByTagName('body')[0].setAttribute('style', 'filter: none')         
                            } else {
                                window.history.back()
                            }
                        },100)
                        throw BreakException;
                    }
                    });
            }

        });
    });
} catch (e) {
    if (e !== BreakException) throw e;
}
