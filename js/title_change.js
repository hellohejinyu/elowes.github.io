if (document.title.indexOf('785616178') === -1) {
  sessionStorage.setItem('title', document.title);
}

setInterval(() => {
    if(document.title.indexOf('785616178') >= 0) {
      document.title = sessionStorage.title;
    } else {
      document.title = "抖音@785616178";
    }
}, 5000);