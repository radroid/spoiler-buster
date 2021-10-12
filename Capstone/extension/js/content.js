let texts = document.getElementsByTagName('span')
const keywords = ['hulk', 'ironman', 'thor']

for (t of texts) {
    let res = keywords.filter(kw => t.textContent.toLowerCase().includes(kw))
    if(res.length !== 0) {
        document.getElementsByTagName('body')[0].setAttribute('style', 'filter: blur(10px)')
        setTimeout(()=> {
            if(confirm('There might be a spoiler here. Are you sure you want to continue ?')) {
                document.getElementsByTagName('body')[0].setAttribute('style', 'filter: none')         
            } else {
                window.history.back()
            }
        },100)
        break
    }
}