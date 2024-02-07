document.addEventListener('DOMContentLoaded', function() {
    organizePostsIntoSeriesCards();
})

function organizePostsIntoSeriesCards(){
    let posts = document.querySelectorAll('.listing-item');
    let seriesPostsMap = transformPostsIntoSeriesMap(posts);
    createSeriesDiv(seriesPostsMap);

    let rawPosts = document.getElementById('rawPosts');
    rawPosts.parentNode.removeChild(rawPosts);
}

function transformPostsIntoSeriesMap(posts){
    let seriesPostsMap = new Map();
    posts.forEach(post => {
        let series = post.dataset.series;
        if(!series){
            if(seriesPostsMap.has('noSeries')){
                seriesPostsMap.get('noSeries').push(post);
            }else{
                seriesPostsMap.set('noSeries',[post]);
            }
        }else{
            if(seriesPostsMap.has(series)){
                seriesPostsMap.get(series).push(post);
            }else{
                seriesPostsMap.set(series,[post]);
            }
        }
        
    })
    return seriesPostsMap;
}

function createSeriesDiv(seriesPostsMap){
    let targetNode = document.getElementById('rawPosts');

    seriesPostsMap.forEach((values, key) => {
        if (key === 'noSeries') {
            return;
        }
        let divElement = document.createElement('div');
        divElement.className = 'series-container' + ' ' + key;
        let backgroundImage = document.createElement('div');
        backgroundImage.className = 'backgroundImage';
        divElement.appendChild(backgroundImage);
      
        let ulElement = document.createElement('ul');
        values.forEach(value => {
            //这里，详细展开
            let url = document.createElement('a');
            value.textContent = '';
            url.href = value.dataset.url;
            url.textContent = value.dataset.subtitle;
            value.appendChild(url);
            ulElement.insertAdjacentElement('afterbegin', value); 
        });
        divElement.insertAdjacentElement('afterbegin', ulElement);
        let seriesDiv = document.createElement('div');
        seriesDiv.className = 'series-name';
        seriesDiv.textContent = values[0].dataset.title;
        divElement.insertAdjacentElement('afterbegin', seriesDiv);
        targetNode.insertAdjacentElement('beforebegin', divElement);
    });

    let noSeriesPosts = seriesPostsMap.get('noSeries');
    if (noSeriesPosts) {
        let divElement = document.createElement('div');
        divElement.className = 'sfwArticle-container';
        let ulElement = document.createElement('ul');

        noSeriesPosts.forEach(value => {
            let url = document.createElement('a');
            value.textContent = '';
            url.href = value.dataset.url;
            url.textContent = value.dataset.title;
            value.appendChild(url);
            ulElement.insertAdjacentElement('afterbegin', value); 
        });

        divElement.appendChild(ulElement);
        targetNode.insertAdjacentElement('afterend', divElement);
    }
    
}