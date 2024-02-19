let nullTimeout = { times: 3, timeouts: 0 };
let category = localStorage.getItem('category') ? JSON.parse(localStorage.getItem('category')) : { inCat: false, catIndex: 0, categories: [] };
let scraperInfo = localStorage.getItem('scraperInfo') ? JSON.parse(localStorage.getItem('scraperInfo')) : {index: 0, brands: []};
window.data = localStorage.getItem('data') ? JSON.parse(localStorage.getItem('data')) : {}; // { <brand>: {<categories>: [{<product-name>: <name>, <price>: <price>}]} }
window._category = true;
window.isProducts = false;
 
function waitRun(func){ window.interval = setInterval(()=>{func()}, 1000); }
function timeout(url=null){ nullTimeout.timeouts += 1; if( nullTimeout.timeouts >= nullTimeout.times ) window.location.href = (url) ? url : 'https://www.pnp.co.za'; }
function setProducts(products){
  let _category = window.location.href.split('http://www.pnp.co.za').at(-1).split(':').at(-1);
  for(let product of products.children){
    let productName = product.querySelector('[data-cnstrc-item-name]').getAttribute('data-cnstrc-item-name');
    let productPrice = product.querySelector('[data-cnstrc-item-price]').getAttribute('data-cnstrc-item-price');
    let productImage = product.querySelector('img').getAttribute('src');
    let brandName = document.querySelector('[data-cnstrc-search-input]').value;
    // data.push({brand: brandName});
    if( !window.data[brandName] ) window.data[brandName] = {};
    if( _category instanceof Array ){
      if( !window.data[brandName]['no category'] ) window.data[brandName]['no category'] = [];
      window.data[brandName]['no category'].push({productName, productPrice, productImage})
    } else {
      if( !window.data[brandName]['categories'] ) window.data[brandName]['categories'] = [];
      if( !window.data[brandName]['categories'][_category] ) window.data[brandName]['categories'][_category] = [];
      window.data[brandName]['categories'][_category].push({productName, productPrice, productImage});
      console.log('categories')
      console.log(_category)
    }
    localStorage.setItem('data', JSON.stringify(window.data));
  }
}
function loadCategories(cat){
  if( category.categories.length == 0 ){
    for( let _category of cat ) {
      category.categories.push(_category.href);
    }
    category.inCat = true
    localStorage.setItem('category', JSON.stringify(category) );
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
        cat.click();
        getProducts();
        localStorage.setItem('category', JSON.stringify(category) );
      } else {
        // perhaps iterate through the brand list here and also set window._category to true
        localStorage.removeItem('category');
        scraperInfo.index += 1;
        localStorage.setItem('scraperInfo', JSON.stringify(scraperInfo) );
        window.location.href = 'http://www.pnp.co.za';
      }
    } else {
      window._category = false;
      if( window.isProducts ){
        clearInterval(window.interval);
        scraperInfo.index += 1;
        localStorage.setItem('scraperInfo', JSON.stringify(scraperInfo) );
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
      window.isProducts = true;
      
      if( window._category ){
        getCategories();
      } else {
        setProducts(products);
        setTimeout(()=>{
          // window.location.href = 'https://www.pnp.co.za';
        }, 1000)
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
      getProducts();
    }
  })
}

function main(){
  if( scraperInfo.index < scraperInfo.brands.length ){
    search(scraperInfo.brands[scraperInfo.index]);
  }
}
main()
