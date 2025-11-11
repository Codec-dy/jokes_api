    window.onload = async function() {
        // Fetch available languages and categories from the server
        const api = "http://localhost:5000/api/v1/jokes/"
        const cat = {"any": "Any", "neutral": "Neutral","chuck": "Chuck Norris"}
        const langs = document.getElementById('selLang');
        const cats = document.getElementById('selCat');
        const nums = document.getElementById('selNum');
        const jokeID = document.getElementById('jokeId');
        const amuseBtn = document.getElementById('btnAmuse');
        const jokesContainer = document.getElementById('jokes');
        for (const [key, value] of Object.entries(cat)) {
            let option = document.createElement("option");
            option.value = key;
            option.text = value;
            cats.appendChild(option);
        }

        for (let i = 1; i <= 10; i++) {
            let option = document.createElement("option");
            option.value = i;
            option.text = i;
            nums.appendChild(option);
        }

        await fetch(api + "languages")
            .then(response => response.json())
            .then(data => {
                console.log(data);
                for (const [key, value] of Object.entries(data.LANGUAGES)) {
                    let option = document.createElement("option");
                    option.value = key;
                    option.text = value;
                    langs.appendChild(option);
                }
            })
        
        amuseBtn.onclick = function(e) {
            e.preventDefault();
            jokesContainer.innerHTML = '';
            const selectedLang = langs.value||'any';
            const selectedCat = cats.value||'any';
            const selectedNum = isNaN(parseInt(nums.value)) ? 'all' : parseInt(nums.value);
            const selectedJokeID = jokeID.value;
            
            if (selectedJokeID!=""){ 
                console.log(selectedJokeID);

                fetch(api + `${selectedJokeID}`).then(response => response.json())
                .then(data => {
                        const article = document.createElement('article');
                        article.className = 'bg-gray-200 p-4 rounded-md text-black shadow-lg';
                        if("error" in data){
                            article.textContent = `404 Not Found: Joke ${selectedJokeID} not found, try an id between 0 and 952`;
                            jokesContainer.appendChild(article);
                        }else{
                            article.textContent = data.joke.text;
                            jokesContainer.appendChild(article);
                        }
                    });
            }else{
                
            fetch(api + `${selectedLang}/${selectedCat}/${selectedNum}`)
                .then(response => response.json())
                .then(data => {
                    console.log(data.jokes.length);
                    if (data.jokes.length === 0) {
                        const article = document.createElement('article');
                        article.className = 'bg-red-200 p-4 rounded-md text-black shadow-lg';
                        article.textContent = 'There are no jokes in the chosen combination of languages and categories.';
                        jokesContainer.appendChild(article);
                        return;
                    }
                    for (let joke of data.jokes) {
                        const article = document.createElement('article');
                        article.className = 'bg-gray-200 p-4 rounded-md text-black shadow-lg';
                        article.textContent = joke;
                        jokesContainer.appendChild(article);
                    }
                })
            }
        }
    }