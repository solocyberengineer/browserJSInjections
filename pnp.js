let nullTimeout = { times: 3, timeouts: 0 }
let category = localStorage.getItem('category') ? JSON.parse(localStorage.getItem('category')) : { inCat: false, catIndex: 0, categories: [] };
window._category = true;

function waitRun(func){ window.interval = setInterval(()=>{func()}, 1000); }
function timeout(url=null){ nullTimeout.timeouts += 1; if( nullTimeout.timeouts >= nullTimeout.times ) window.location.href = (url) ? url : 'https://www.pnp.co.za'; }
function loadCategories(cat){
  // console.log('loadCategories')
  // console.log( category )
  if( category.categories.length == 0 ){
    // console.log('empty')
    for( let _category of cat ) {
      // console.log(_category.href);
      category.categories.push(_category.href);
    }
    category.inCat = true
    localStorage.setItem('category', JSON.stringify(category))
  }
}
function getCategories(){
  waitRun(()=>{
    let categories = document.querySelector(`pnp-cms-facet` && `[tabindex='0']` && `[class='focus-lock ng-star-inserted']`);
    if( categories ){
      clearInterval( window.interval );
      loadCategories( categories.querySelectorAll('a') );
      if(category.categories.length > 0 && category.catIndex < category.categories.length){
        let cat = document.querySelector(`[href="${category.categories[category.catIndex].split('https://www.pnp.co.za').at(-1)}"]`);
        category.catIndex += 1;
        window._category = false;
        localStorage.setItem('category', JSON.stringify(category) );
        cat.click();
        console.log('clicked')
        getProducts();
        // window.location.href = 'http://www.pnp.co.za';
      } else {
        // perhaps iterate through the list here
        localStorage.removeItem('category');
        window.location.href = 'http://www.pnp.co.za';
      }
    }
  })
}
function getProducts(timeoutUrl=null){
  waitRun(()=>{
    let products = document.querySelector('[data-cnstrc-search]');
    if( products ){
      clearInterval(window.interval);
      // console.log('cat getProducts')
      // console.log(_category)
      if( window._category ){
        getCategories();
      } else {// else put it in a dict object 
        console.log(products);
        // window.location.href = 'https://www.pnp.co.za';
      }
    } else {
      timeout(url=timeoutUrl);
    }
  });
}
function search(product_name){
  waitRun(()=>{
    let input = document.querySelector('[data-cnstrc-search-input]');
    let searchBtn = document.querySelector('[data-cnstrc-search-submit-btn]');
    if( input && searchBtn ){
      clearInterval(window.interval);
      input.value = product_name;
      searchBtn.click();
      // console.log('cat search')
      // console.log(_category)
      getProducts();
    }
  })
}

function main(){
  search('ultra mel');
}
main()

