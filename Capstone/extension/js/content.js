let texts = document.getElementsByTagName('span')
const keywords = ['hulk', 'ironman', 'thor']

for (t of texts) {
    try {
        keywords.forEach((key) => {
            if(t.textContent.toLowerCase().includes(key)) {
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
        })
    } catch (e) {
        if (e !== BreakException) throw e;
    }
}