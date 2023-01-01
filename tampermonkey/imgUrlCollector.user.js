// ==UserScript==
// @name         imgUrlCollector
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  used to collect the jpg urls of my manga.
// @author       weLoventr4ever
// @match        https://www.imagebam.com/view/*
// @icon         https://naturerealized.com/img/favicon.png
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    //下载函数
    const openDownloadDialog = (url, fileName) => {
        if (typeof url === 'object' && url instanceof Blob) {
            url = URL.createObjectURL(url); // 创建blob地址
        }
        const aLink = document.createElement('a');
        aLink.href = url;
        aLink.download = fileName;
        aLink.click();
    };
    function saveTXT(content, fileName){
       var blob = new Blob(['\ufeff' + content], {type: 'text/txt,charset=UTF-8'});
       openDownloadDialog(blob, fileName);
    }
    //url收集
    var imgUrls = localStorage.imgUrls
    if (!imgUrls) imgUrls = ''
    imgUrls = imgUrls + $(".view-image")[0].children[1].children[1].src + '\n'
    localStorage.setItem('imgUrls', imgUrls)
    window.location.href = $(".view-navigation")[1].children[1].href;
    //最后一页收集完成后下载并清除localStorage内容
    if ($(".view-navigation")[1].children[1].href == 'javascript:void(0);'){
        saveTXT(localStorage.imgUrls, 'imgUrls.txt')
        localStorage.removeItem('imgUrls')
    }
    // todo 
    // 1. 从相册全览界面开始执行脚本，同时收集thumbnail
    // 2. 下载时直接生成post template并自动填充thumbnail与imgurl
})();