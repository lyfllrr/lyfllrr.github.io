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
        divElement.className = 'series-container';//这里，详细展开
      
        let ulElement = document.createElement('ul');
        values.forEach(value => {
            let liElement = document.createElement('li');
            liElement.textContent = value.textContent;//这里，详细展开
            ulElement.insertAdjacentElement('afterbegin', liElement); 
        });
        divElement.insertAdjacentElement('afterbegin', ulElement);
        targetNode.insertAdjacentElement('beforebegin', divElement);
    });

    let noSeriesPosts = seriesPostsMap.get('noSeries');
    if (noSeriesPosts) {
      let divElement = document.createElement('div');
      divElement.className = 'series-container';//这里，详细展开

      let ulElement = document.createElement('ul');

      noSeriesPosts.forEach(value => {
        let liElement = document.createElement('li');
        liElement.textContent = value.textContent;//这里，详细展开
        ulElement.appendChild(liElement);
      });

      divElement.appendChild(ulElement);
      targetNode.insertAdjacentElement('afterend', divElement);
    }
    
}