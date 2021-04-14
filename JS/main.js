// Variables

const cartBtn = document.querySelector('.cart-info');
const continueShoppingBtn = document.querySelector('.continueShopping-btn'); 
const checkOutBtn = document.querySelector(".checkOut-btn");

const cartDOM = document.querySelector('.cart-modal'); 
const cartOverlay = document.querySelector('.modal-overlay');

const summaryDOM = document.querySelector('.summary-modal'); 
const summaryOverlay = document.querySelector('.summary-modal-overlay');
const summaryOkBtn = document.querySelector('.summary-ok-btn');
const cartContenSummary = document.querySelector('.summary-content'); 
const customerName = document.querySelector('.costumer-name');

const cartItems = document.querySelector('.cart-number'); 
const cartTotal = document.querySelector('.total-amount'); 

const cartContent = document.querySelector('.cart-content'); 
const productsDOM = document.querySelector('.product-container'); 

const cartRow = document.querySelector('.cart-item'); 


// const formDiv = document.querySelector('.cart-form');

//  cart
let cart = [];
// let updatedCart = [];

//  buttons
let buttonsDOM = [];



// getting the products
class Products {
  async getProducts() {
    try {
      let result = await fetch('products.json');
      let data = await result.json();
      
      let products = data.productsList;
      products = products.map(item =>{
        const {id, name, price, image} = item;
        return {id, name, price,image};
      })
      return products; 
    } catch (error) {
      console.log(error);
    }
  }
}

// display products
class UI {
  displayProducts(products){
    // console.log(products);
    let result = '';
    products.forEach(product => {
      result += `
      <div class="product-list" data-id=${product.id}>
      <div class="product-detail" >
        <img src=${product.image} alt="" class="product-img" >
        <div class="price-container" >
          <div class="centered" id="centerd">
            <h3 class="price-heading">Price </h3>
            <h2 class="product-price">&#8358;${product.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</h2>
          </div>
        </div>
      </div>
      <h2 class="product-name">${product.name}</h2>
      <button class="product-btn"  data-id=${product.id}>Add to Cart</button>
    </div>
      ` ;
    });
    productsDOM.innerHTML = result;
    // console.log(result)
  }

  //Add to cart btns
  getAddToCartButtons() {
    
    const buttons = [...document.querySelectorAll('.product-btn')];
    buttonsDOM = buttons;
    buttons.forEach(button => {
      let id = button.dataset.id;
      let inCart = cart.find(item => item.id === id);
      //set button text if in cart
      if (inCart) {
        button.innerText = "Remove from cart";
        button.style.color = "#fff";
        button.style.backgroundColor = "#ff9a3d";
        
        // button.disabled = true;
      }

      //if in cart remove item
      button.addEventListener('click', (event) => {
        if (event.target.innerText == "REMOVE FROM CART") {
          let removeFromCartBtn = event.target;
          let elements = cartContent.children;
          for (let i = 0; i < elements.length; i++) {
            let element = elements[i];
            if (element.dataset.id === removeFromCartBtn.dataset.id) {
              element.remove()
              break;
            }
          }
          this.removeItem(id);
        }else{
          event.target.innerText = "Remove from cart";
          event.target.style.color = "#fff";
          event.target.style.backgroundColor = "#ff9a3d";
  
          // event.target.disabled = true;
  
          // get product from product
          let cartItem = {...Storage.getProduct(id), amount: 1, serialNumber: 0};
          // add product to the cart
          cart = [...cart, cartItem];
          // save cart to local storage
          Storage.saveCart(cart)
          // set cart values
          this.setCartValues(cart)
          // display cart item 
          this.addCartItem(cartItem);

          // show cart 
          // this.showCart();
        }
      })
    })
  }
  

  setCartValues(cart) {
    let finalTotal = 0;
    let itemsTotal = 0;

    cart.map((item, index) => {
      finalTotal += item.price; 
      itemsTotal = cart.length;
      item.serialNumber = index + 1;
      // item.index = cart.indexOf(item) + 1;
    })
    cartTotal.innerText = finalTotal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    cartItems.innerText = itemsTotal;
  }

  addCartItem(item) {
    const div = document.createElement('div');
    div.classList.add('cart-item');
    div.dataset.id = item.id
    div.innerHTML = `
    <span class="item-number item-detail" >${item.serialNumber}</span>
    <span class="item-name item-detail" >${item.name}</span>
    <span class="item-price item-detail" >&#8358;${item.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</span>
    <div class="input-detail item-detail">
      <button class="minus-btn" type="button" name="button" data-id=${item.id}>-</button>
        <span class="item-input" >${item.amount}</span>
      <button class="plus-btn" type="button" name="button" data-id=${item.id}>+</button>
    </div>
    <button class="remove-btn item-detail" data-id=${item.id}>Remove</button>
    `;
    cartContent.appendChild(div);
  }

  showCart(){
    cartOverlay.classList.add('show-cart');
    cartDOM.classList.add('show-cart');
  }
  
  hideCart(){
    cartOverlay.classList.remove('show-cart');
    cartDOM.classList.remove('show-cart');
  }
  
  showCartSummary(){
    summaryOverlay.classList.add('show-summary');
    summaryDOM.classList.add('show-summary');
  }

  hideCartSummary(){
    summaryOverlay.classList.remove('show-summary');
    summaryDOM.classList.remove('show-summary');
  }

  getSingleButton(id) {
    return buttonsDOM.find(button => button.dataset.id === id);
  }

  removeItem(id) {
    cart = cart.filter((item) => item.id !== id); 
    this.setCartValues(cart);
    Storage.saveCart(cart);
    let button = this.getSingleButton(id);
    button.disabled = false;
    button.innerText = "Add to Cart";
    button.style.color = "#000";
    button.style.backgroundColor = "#ff7a00";
  }

  clearCart() {
    let cartItems = cart.map(item => item.id);
    cartItems.forEach(id => this.removeItem(id));
    while (cartContent.children.length > 0) {
      cartContent.removeChild(cartContent.children[0])
    } 
  }



  poppulateCart(cart) {
    cart.forEach((item) => {
      this.addCartItem(item);
    });
  }

  setupAPP() {
    cart = Storage.getCart();
    this.setCartValues(cart);
    this.poppulateCart(cart);
    cartBtn.addEventListener('click', this.showCart);
    continueShoppingBtn.addEventListener('click', this.hideCart);
    summaryOkBtn.addEventListener('click', ()=>{
      this.clearCart();
      this.hideCartSummary();
    });
    window.addEventListener('click', (event) => {
      if (event.target === cartOverlay) {
        this.hideCart();
      }else if (event.target === summaryOverlay) {
        this.clearCart();
        this.hideCartSummary();
      }
    });
  }

  CartLogic() {

    // cart functionality
    cartContent.addEventListener('click', event => {
      if (event.target.classList.contains('remove-btn')) {
        let removeBtn = event.target;
        let id = removeBtn.dataset.id;
        cartContent.removeChild(removeBtn.parentElement);
        this.removeItem(id);
      }else if (event.target.classList.contains('plus-btn')){
        let addAmount = event.target;
        let id = addAmount.dataset.id;
        let tempItem  = cart.find(item => item.id === id);
        tempItem.amount = tempItem.amount + 1;
        let prodItem = {...Storage.getProduct(id)};
        let tempPrice = prodItem.price * tempItem.amount;
        tempItem.price = tempPrice;
        Storage.saveCart(cart);
        this.setCartValues(cart);
        addAmount.previousElementSibling.innerText = tempItem.amount;
        addAmount.parentElement.previousElementSibling.innerText = tempPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      }else if (event.target.classList.contains('minus-btn')){
        let minusAmount = event.target;
        let id = minusAmount.dataset.id;
        let tempItem  = cart.find(item => item.id === id);
        tempItem.amount = tempItem.amount - 1;
        let prodItem = {...Storage.getProduct(id), amount: 1};
        let tempPrice = prodItem.price * tempItem.amount;
        tempItem.price = tempPrice;
        if (tempItem.amount > 0) {
          Storage.saveCart(cart);
          this.setCartValues(cart);
          minusAmount.nextElementSibling.innerText = tempItem.amount;
          minusAmount.parentElement.previousElementSibling.innerText = tempPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        }else{
          // cartContent.removeChild(minusAmount.parentElement.parentElement);
          // this.removeItem(id);
          alert("You can't have less than 1 quantity of an item, if you wish to remove the item click remove button")
        }
      }
    })
    // form validation
    const name = document.getElementById("name");
    const email = document.getElementById("email");
    const phone = document.getElementById("phone");

    const nameError = document.getElementById("name-error");
    const emailError = document.getElementById("email-error");
    const phoneError = document.getElementById("phone-error");

    // const thankYouMsg = document.getElementById('thankyou-msg');

    




    name.addEventListener("focusout", nameValidation);
    email.addEventListener("focusout", emailValidation);
    phone.addEventListener("focusout", phoneValidation);

    //Check for name input
    function nameValidation() {
      let nameInput = name.value.trim();
      var numbers = /[0-9]+/;

      if (nameInput == "") {
        nameError.innerHTML = "Please input your name";
        nameError.style.display = "block";
        name.style.borderColor = "red";
      } else if (nameInput.match(numbers)) {
        nameError.innerHTML = "Name must be Alphabet";
        nameError.style.display = "block";
        name.style.borderColor = "red";
      } else if (nameInput.length < 3) {
        nameError.innerHTML = "Name cannot be less than three Alphabet";
        nameError.style.visibility = "visible";
        name.style.borderColor = "red";
      } else {
        name.style.borderColor = "green";
        nameError.style.display = "none";
      }
    }

    // Check for email input
    function emailValidation() {
      let emailInput = email.value.trim();
      let emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

      if (emailInput == "") {
        emailError.innerHTML = "Please input your email";
        emailError.style.display = "block";
        email.style.borderColor = "red";
      } else if (emailRegex.test(emailInput) === false) {
        emailError.innerHTML = "Please input a valid email address";
        email.style.borderColor = "red";
        emailError.style.display = "block";
      } else {
        emailError.style.display = "none";
        email.style.borderColor = "green";
      }
    }

    // Check for phone input
    function phoneValidation() {
      let phoneNumber = phone.value.trim();
      let letter = /[A-Za-z]+/;
      if (phoneNumber == "") {
        phoneError.innerHTML =  "Please input your phone number";
        phoneError.style.display = "block";
        phone.style.borderColor = "red";
      } else if (phoneNumber.match(letter)) {
        phoneError.innerHTML =  "phone number must be in digit not Alphabet or Alphanumeric";
        phoneError.style.display = "block";
        phone.style.borderColor = "red";
      } else if (phoneNumber.length < 11) {
        phoneError.innerHTML = "Phone Number cannot be less than 11";
        phoneError.style.display = "block";
        phone.style.borderColor = "red";
      } else {
        phoneError.style.display = "none";
        phone.style.borderColor = "green";
      }
    }

    // Checkout Cart
    checkOutBtn.addEventListener("click", (event) => {
      let nameInput = name.value.trim();
      let emailInput = email.value.trim();
      let phoneNumber = phone.value.trim();
    
      
      if (cart.length === 0) {
        alert("Please Add Product to Cart");
      }else if (nameInput == "") {
        nameError.innerHTML = "Please input your phone number";
        nameError.style.display = "block";
        name.style.borderColor = "red";
      } else if (emailInput == "") {
        emailError.innerHTML = "Please input your email ";
        emailError.style.display = "block";
        email.style.borderColor = "red";
      } else if (phoneNumber == "") {
        phoneError.innerHTML =  "Please input your phone number";
        phoneError.style.display = "block";
        phone.style.borderColor = "red";
      } else {
        name.style.borderColor = "green";
        email.style.borderColor = "green";
        phone.style.borderColor = "green";

        this.addCartItemSummary();
        customerName.innerHTML = nameInput;
      
        this.hideCart();
        this.payWithPaystack();
      }
      
    });
    
  }

  payWithPaystack(e) {
    let handler = PaystackPop.setup({
      key: 'pk_test_730740b593a483a70d4b52fb27ec009020e2e044', // Replace with your public key
      email: email.value,
      amount: cartTotal.innerHTML.replace(/\,/g,'') * 100,
      ref: ''+Math.floor((Math.random() * 1000000000) + 1), // generates a pseudo-unique reference. Please replace with a reference you generated. Or remove the line entirely so our API will generate one for you
      // label: "Optional string that replaces customer email"
      onClose: function(){
        alert('Window closed.');
      },
      callback: function(response){
        
        // this.showCartSummary();
        // showCart()
        summaryOverlay.classList.add('show-summary');
        summaryDOM.classList.add('show-summary');
      }
    });
    handler.openIframe();
  }

  addCartItemSummary() {
    cart.map(item => {
    
      const div = document.createElement('div');
      div.classList.add('summary-item');
      div.innerHTML = `
      <span class="summary-item-number summary-item-detail" id="summary-item-number">${item.serialNumber}</span>
      <span class="summary-item-name summary-item-detail" id="summary-item-name">${item.name}</span>
      <span class="summary-input-detail summary-item-detail">${item.amount}</span>
      `;
      cartContenSummary.appendChild(div);
      
    })
  }

  
}

//local storage
class Storage {
  static saveProducts(products){
    localStorage.setItem("products", JSON.stringify(products));
  }
  static getProduct(id) {
    let products = JSON.parse(localStorage.getItem('products'));
    return products.find(product => product.id === id);
  }
  static saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
  }
  static getCart() {
    return localStorage.getItem('cart')?JSON.parse(localStorage.getItem('cart')):[];
  }
}

document.addEventListener("DOMContentLoaded", ()=> {
  const ui = new UI();
  const products = new Products();

  // setup app
  ui.setupAPP();

  // get all products
  products.getProducts().then(products => {
    ui.displayProducts(products)
    Storage.saveProducts(products);
  }).then(()=>{
    ui.getAddToCartButtons();
    ui.CartLogic();
  });

  
})


