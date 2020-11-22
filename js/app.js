class UI {
	constructor() {
		this.productsDOM = document.getElementById('products-center');
		this.searchForm = document.getElementById('search-course');
		this.cartBody = document.getElementById('cartBody');
		this.cartBtn = document.getElementById('img-cart');
		this.shoppingCart = document.getElementById('shopping-cart');
		this.clearCartBtn = document.getElementById('clear-cart')
		this.cart = SessionStorage.getCartCourses();
		this.init()
	}

	init() {
		this.getProducts()
		.then((courses) => {
			//add products to DOM
			this.addProductsToDOM(courses);

			//save products to sessionStorage
			SessionStorage.saveItem(courses)

			//check if Cart course in localStorage is not empty 
			this.loadCartFromStorage()
		})
		.then(() => {
			//search for courses
			this.searchForm.addEventListener('keyup', (e) => {
			let value = this.searchForm.value.toLowerCase()
			let products = document.querySelectorAll('#title')
			let productsArray = [...products]

			productsArray.forEach(product => {
				let productText = product.textContent.toLowerCase()
				let parentElement = product.parentElement.parentElement.parentElement
				if (productText.indexOf(value) !== -1) {
					parentElement.style.display = 'block'
				}
				else {
					parentElement.style.display = 'none'
				}

			})

		})

		})


		//eventListeners
		//Trigger Events once the course is clicked
		this.productsDOM.addEventListener('click', (e) => {
			e.preventDefault()
			if(e.target.classList.contains('add-to-cart')) {
				this.cartLogic(e.target)
			}
		})

		//show Cart
		this.cartBtn.addEventListener('click', () => {
			this.shoppingCart.classList.toggle('showCart')
			this.shoppingCart.classList.toggle('hideCart')
		})

		//Clear Carts
		this.clearCartBtn.addEventListener('click', () =>  {
			let courses = this.cartBody.children
			let courseArr = [...courses]

			courseArr.forEach(course => {
				course.remove()
			})
			this.cart = []
			SessionStorage.saveCartCourses(this.cart)

		let allButtons = document.querySelectorAll('.add-to-cart')
		let allBtnArr = [...allButtons]

		allBtnArr.forEach(button=> {
				button.disabled = false;
				button.style.backgroundColor = 'blue'
				button.innerHTML = 'ADD TO CART'
		})

		})

		//remove A course 
		this.cartBody.addEventListener('click', (e) => {
			if (e.target.classList.contains('remove')) {
				this.removeCourse(e.target)
			}
		})

	}

	async getProducts() {
		let request = await fetch('data.json');
		let data  = await request.json()
		let products = data.items

		return products
	}

	addProductsToDOM(products) {
		let output = ''
		products.map((product, index) => {

		if (index === 0 || index === 3 || index === 6 || index === 9) {
			output += `<div class="row">`
		}

			output += `
 						<div class="four columns">
                    <div class="card">
                        <img src="img/${product.Image}" class="course-image u-full-width">
                        <div class="info-card">
                            <h4 id='title'>${product.Title}</h4>
                            <p>${product.Author}</p>
                            <img src="img/stars.png">
                            <p class="price">${product.Price}  <span class="u-pull-right ">$15</span></p>
                            <button href="#" class="u-full-width button-primary button input add-to-cart" data-id=${product.id}>Add to Cart</button>
                        </div>
                    </div> <!--.card--> 
           			 </div>
					 `

		if (index === 2 || index === 5 || index === 8 || index === 11) {
			output += '</div>'
		}
		})

		return this.productsDOM.innerHTML = output
	}

	addToCart(course) {
		let tr = document.createElement('tr');
		
		tr.innerHTML = `
					<tr>
                    <td>
                         <img src="img/${course.Image}" width=100>
                    </td>
                    <td>${course.Title}</td>
                    <td>${course.Price}</td>
                    <td>
                         <a href="#" class="remove" data-id="${course.id}">X</a>
                    </td>
              		 </tr>
						`
		this.cartBody.appendChild(tr)
	}
		cartLogic(course) {
		course.disabled = true
		course.style.backgroundColor = 'black';
		course.innerHTML = 'IN CART'
		let id = course.dataset.id
		let courses = SessionStorage.getCourses()
		let courseS = courses.find(c => c.id === id )
		this.cart = [...this.cart, courseS];
		SessionStorage.saveCartCourses(this.cart)

		this.addToCart(courseS)
		}


	removeCourse(button) {
		let id = button.dataset.id;
		let tempList = this.cart.filter(c => c.id !== id)
		this.cart = tempList
		SessionStorage.saveCartCourses(this.cart)
		let parentElement = button.parentElement.parentElement
		parentElement.remove()

		let allButtons = document.querySelectorAll('.add-to-cart')
		let allBtnArr = [...allButtons]

		allBtnArr.forEach(button=> {
			if (button.dataset.id === id) {
				button.disabled = false;
				button.style.backgroundColor = 'blue'
				button.innerHTML = 'ADD TO CART'
			}
		})

	}


	loadCartFromStorage() {
		if (this.cart.length !== 0) {
		let allButtons = document.querySelectorAll('.add-to-cart')
		let allBtnArr = [...allButtons]
		this.cart.forEach(c => {
			this.addToCart(c)

			let Btn = allBtnArr.find(btn => btn.dataset.id === c.id)
			Btn.disabled = true;
			Btn.style.backgroundColor = 'black';
			Btn.innerHTML = 'IN CART'
		})
		}
	}


//end of classes
}



class SessionStorage {
	static saveItem(course) {
		sessionStorage.setItem('course', JSON.stringify(course))
	}

	static getCourses() {
		return JSON.parse(sessionStorage.getItem('course'))
	}

	static saveCartCourses(cartCourse) {
		localStorage.setItem('cartCourse', JSON.stringify(cartCourse))
	}

	static getCartCourses() {
		if (!localStorage.getItem('cartCourse')) {
			return []
		}
		else {
		return JSON.parse(localStorage.getItem('cartCourse'))
	}
}
}

const ui = new UI()