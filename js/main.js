
let app = new Vue({
    el: '#app',
    data: {
        product: "Socks",
        brand: "Vue Mastery",
        description: "A pair of warm, fuzzy socks.",
        onSale:"onSale",
        selectedVariant: 0,
        altText: "A pair of socks",
        link: "https://www.amazon.com/s/ref=nb_sb_noss?url=search-alias%3Daps&field-keywords=socks",
        inStock: true,
        inventory: 100,
        details: ['80% cotton', '20% polyester', 'Gender-neutral'],
        sizes: ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
        cart: 0,
        variants: [
            {
                variantId: 2234,
                variantColor: 'green',
                variantImage: "./assets/vmSocks-green-onWhite.jpg",
                variantQuantity: 10
            },
            {
                variantId: 2235,
                variantColor: 'blue',
                variantImage: "./assets/vmSocks-blue-onWhite.jpg",
                variantQuantity: 0
            }
        ],


    },
    methods: {
        addToCart() {
            this.cart += 1
        },
        removeFromCart() {
            if (this.cart > 0) {
                this.cart -= 1
            }
        },
        updateProduct(index) {
            this.selectedVariant = index;
            console.log(index);
        },
        image() {
            return this.variants[this.selectedVariant].variantImage;
        },
        inStock(){
            return this.variants[this.selectedVariant].variantQuantity
        }

    },
        computed: {
            title() {
                return this.brand + ' ' + this.product;
            },
    Sale() {
        return this.brand + ' ' + this.product + ' ' + this.onSale;
    }
    },

    Vue.component('product', {
        template: `
   <div class="product">
    // Здесь будет весь HTML-код, который раньше был в элементе с классом product
   </div>
 `
    })



})
