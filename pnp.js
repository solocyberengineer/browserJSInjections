let input = null;
let searchBtn = null;
let products = null;
let nullTimeout = {
  times: 4,
  amt: []
}
let HOST = window.location.host;

let brand = ['Energade', 'toffo o luxe', 'beacon allsorts', 'expert kair', 'fattis ', 'aunt caroline', 'fizz pop', 'fizzer', 'beacon', 'benny', 'golden cloud', 'bio classic', 'halls', 'bio crystal', 'hugos', 'dolly varden', 'airoma', 'morvite', 'sunglish', 'ingrams', 'oros', 'jelly tots', 'peaceful sleep', 'jeyes', 'perfect touch', 'jungle', 'purity', 'king korn', 'koo', 'roses', 'smoothies', 'colmans', 'sparkeles', 'ace', 'cresta', 'maynards', 'spray and cook', 'crosses ', 'status', 'blackcat', 'albany', 'doom', 'no hair', 'tinkies', 'ice cap', 'all gold', 'mrs H.S.Balls', 'tastic', 'sunfoil', 'sunshine d', 'd lite', 'allsome', 'sona', 'crown', 'romi', 'woodenSpoon', 'Daily', 'sun gold', 'cordon blew', 'butterific', 'pastry king', 'kremolene', 'Greaso', 'Eve', 'Britelite', 'Waves', 'Crispa', 'Al Rajah', 'huggies', 'omo', 'domestos', 'five roses', 'bakers', 'simba', 'nescafe', 'nik naks', 'freshpak', 'Cremora', 'know', 'stork', 'nola', 'liqui fruit', 'kelloggs', 'McCain', 'bokomo', 'Snowflake', 'johnsons', 'white star', 'mortein', 'nestle', 'purity', 'ariel', 'dettol', 'cadbury', 'Hand Andy', 'Pampers', 'Robertsons', 'Spice Mecca', 'Mortein', 'Always', 'Black Cat', 'I&J', 'Hinds ', 'Parmalat', 'Countr Fresh', 'Rhodes', 'Dr Hahnz', 'House of Coffee', "Pieman's", 'Clover', 'Ace']
let data = {}


// <pnp-cms-facet _ngcontent-spartacus-app-c333="" tabindex="0" class="focus-lock ng-star-inserted">
// document.querySelector(`pnp-cms-facet` && `[tabindex='0']` && `[class='focus-lock ng-star-inserted']`)

function index(){
  let scraperInfo = localStorage.getItem('scraperInfo') ? JSON.parse( localStorage.getItem('scraperInfo') ) : {
    index: 0
  };
  localStorage.setItem('scraperInfo', JSON.stringify(scraperInfo));
  return scraperInfo.index;
}

function reload() {
  window.location.href = 'https://www.pnp.co.za';
}

function main(){
    let category = localStorage.getItem('category') ? JSON.parse(localStorage.getItem('category')) : {
      inCategory: false,
      categories: [],
      catIter: 0
    }
    localStorage.setItem('category', JSON.stringify(category) );
    
    if( category.inCategory ){
      console.log(category)
      console.log(`href: ${category.categories[category.catIter]}`);
      console.log(`chref: ${window.location.href}`)
      if( window.location.href != category.categories[category.catIter] ){
        window.location.href = category.categories[category.catIter];
      }
      getProducts(category);
      return;
    } else {
      getProducts()
    }
    
    function parseProducts(products){
      console.log(products);
    }
    function parseCategories(categories){
    }
    function getProducts(category=null){
      window.interval = setInterval(()=>{
        products = document.querySelector('[data-cnstrc-search]');
        if( products ){
          clearInterval( window.interval );
          parseProducts( products.children ); // some how collect the products
          if( category.catIter >= ( category.categories.length-1 ) ){
            category.catIter = 0;
            category.categories = [];
            category.inCategory = false;
            localStorage.setItem('category', JSON.stringify(category) );
            let scraperInfo = JSON.parse( localStorage.getItem('scraperInfo') );
            scraperInfo.index += 1;
            console.log(scraperInfo);
            localStorage.setItem("scraperInfo", JSON.stringify(scraperInfo));
            console.log('get products if true');
          } else {
            console.log('get products if false');
            category.catIter += 1;
            localStorage.setItem('category', JSON.stringify(category));
          }
          nullTimeout.amt = [];
          console.log('reload if products true');
          reload();
        } else {
          nullTimeout.amt.push(products);
          if( nullTimeout.amt.length == nullTimeout.times ) reload();
        }
      }, 1000)
    }
    function enumerateCategory(){
      // some searches will not have categories
      // lets assume for now that the category section will always be the first on in pnp-cms-facet
      window.interval = setInterval(()=>{
        let categories = document.querySelector(`pnp-cms-facet` && `[tabindex='0']` && `[class='focus-lock ng-star-inserted']`);
        
        if( categories ){
          clearInterval(window.interval);
          let c = [];
          for( let elem of categories.querySelectorAll('a') ){
            let categoryUrl = `https://${HOST}${elem.getAttribute('href')}`;
            c.push(categoryUrl);
          }
          category.inCategory = ( c.length > 0 );
          category.categories = c;
        }
        localStorage.setItem('category', JSON.stringify(category))
      }, 1000);
    }
    function enumerateProducts(){
      window.interval = setInterval(() => {
        products = document.querySelector('[data-cnstrc-search]');
        console.log( nullTimeout )
        if( products ){
          clearInterval(window.interval);
          nullTimeout.amt = []
          let productItems = products.children;
          console.log(productItems);
          enumerateCategory();
        } else {
          nullTimeout.amt.push(products)
          if( nullTimeout.amt.length == nullTimeout.times ) reload();
        }
      }, 1000);
    }
  
    window.interval = setInterval(() => {
        input = document.querySelector('[data-cnstrc-search-input]');
        searchBtn = document.querySelector('[data-cnstrc-search-submit-btn]');
        if( input && searchBtn ){
          clearInterval(window.interval)
          input.value = brand[ index() ];
          searchBtn.click()
          enumerateProducts();
        }
    }, 1000);
}

main()

