Vue.component('product', {
    props: {
        premium: {
            type: Boolean,
            required: true
        }

    },
    template: `
   <div class="product">


            <div class="product-image">
                <img v-bind:src="image  " v-bind:alt="altText" />

            </div>

            <div class="product-info">
                <h1>{{ title }}</h1>
                <p>{{description}}</p>
                <a v-bind:href="link">More products like this.</a>
                <p v-if="inStock">In stock</p>
                <p v-else-if="inventory <= 10 && inventory > 0">Almost sold out!</p>
                <p v-else :class="{outOfStock: !inStock}">Out of stock</p>
                <span>{{Sale}}</span>
             <p>Shipping: {{ shipping }}</p>
                <ul>
                    <li v-for="detail in details">{{ detail }}</li>
                </ul>


                <ul>
                    <li v-for="size in sizes">{{ size }}</li>
                </ul>

                <div
                        class="color-box"
                        v-for="(variant, index) in variants"
                        :key="variant.variantId"
                        :style="{ backgroundColor:variant.variantColor }"
                        @mouseover="updateProduct(index)">

            </div>



            <div class="cart">
                    <p>Cart({{ cart }})</p>
                </div>

                <button
                        v-on:click="addToCart"
                        :disabled="!inStock"
                        :class="{ disabledButton: !inStock }"
                >
                    Add to cart
                </button>
                <button v-on:click="removeFromCart">Remove from cart</button>

            </div>

           </div>
 `,
    data() {
        return {
            premium: true,
            product: "Socks",
            brand: "Vue Mastery",
            description: "A pair of warm, fuzzy socks.",
            onSale: "onSale",
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
        }
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
        inStock() {
            return this.variants[this.selectedVariant].variantQuantity
        },

    },
    computed: {
        title() {
            return this.brand + ' ' + this.product;
        },
        Sale() {
            return this.brand + ' ' + this.product + ' ' + this.onSale;
        },
        image() {
            return this.variants[this.selectedVariant].variantImage;
        },
        shipping() {
            if (this.premium) {
                return "Free";
            } else {
                return 2.99;
            }


        }
    }
})

let app = new Vue({
    el: '#app',
    data: {
        premium: true,
    }
})


