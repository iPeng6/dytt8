// ==UserScript==
// @name         dytt8
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  grap movie score
// @author       ipeng6
// @match        https://www.dytt8.net/*
// @match        http://www.ygdy8.net/*
// @grant        none
// ==/UserScript==

(function() {
  'use strict';

  // Your code here...
  function GetScore(url) {
      return new Promise((resolve, reject)=>{
          fetch(url).then(res=>res.blob()).then(res=>{
              let reader = new FileReader();
              reader.addEventListener('loadend',()=>{
                  let s,t,a,b,m,n;
                  try{
                      [s,a,m] = reader.result.match(/豆瓣评分\s([0-9.]*?)\/10 from ([0-9,]*?) users/);
                  }catch(err){
                      a = 0; m = '';
                  };
                  try{
                      [t,b,n] = reader.result.match(/IMDb评分\s([0-9.]*?)\/10 from ([0-9,]*?) users/);
                  }catch(err){
                      b = 0; n = '';
                  }
                  a = +(a||0)
                  b = +(b||0)
                  m = +(m.replace(/,/g,'')||0)
                  n = +(n.replace(/,/g,'')||0)
                  m = 3*m
                  resolve([a,b,m,n]);
              });
              reader.readAsText(res,'gb2312');
          })
      })
  }
  Array.from(document.querySelector('.co_content8').querySelectorAll('.inddline a')).filter(v=>/\d+.html$/.test(v.href)).forEach(A=>{
      GetScore(A.href).then(([a,b,m,n])=>{
          const r = m/(m+n)*a + n/(m+n)*b;
          const p = 256 * (10-r)/10;
          let ht = '';
          if(r>8) {
              ht = '<span style="color:purple;font-weight: bold;">'+r.toFixed(2)+'</span>'
          }else if(r>=7){
              ht = '<span style="color:rgba(256,'+p+','+p+','+r/10+')">'+r.toFixed(2)+'</span>'
              A.style.opacity = r/10;
          }else{
              ht = '<span style="color:rgba('+p+','+p+','+p+','+r/20+')">'+r.toFixed(2)+'</span>'
              A.style.opacity = r/20;
          }
          A.previousSibling.previousSibling.innerHTML = ht;
      })
  })

})();
