let eventBus = new Vue()

Vue.component('product', {
    props: {
        premium: {
            type: Boolean,
            required: true,


        },
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
             <product-details></product-details>     

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
                <button
                        v-on:click="addToCart"
                        :disabled="!inStock"
                        :class="{ disabledButton: !inStock }"
                >
                    Add to cart
                </button>
                <button v-on:click="removeFromCart">Remove from cart</button>
            </div>
             <product-tabs :reviews="reviews"></product-tabs>
            
           </div>
 `,
    data() {
        return {
            product: "Socks",
            brand: "Vue Mastery",
            description: "A pair of warm, fuzzy socks.",
            onSale: "onSale",
            selectedVariant: 0,
            altText: "A pair of socks",
            link: "https://www.amazon.com/s/ref=nb_sb_noss?url=search-alias%3Daps&field-keywords=socks",
            inStock: true,
            inventory: 100,
            // details: ['80% cotton', '20% polyester', 'Gender-neutral'],
            sizes: ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
            cart: [],
            reviews: [],
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
        updateCart(id) {
            this.cart.push(id);
        },
        addToCart() {
            this.$emit('add-to-cart', this.variants[this.selectedVariant].variantId);
        },
        removeFromCart() {
            this.$emit('remove-from-cart', this.variants[this.selectedVariant].variantId);
        },
        updateProduct(index) {
            this.selectedVariant = index;
            console.log(index);
        },
        inStock() {
            return this.variants[this.selectedVariant].variantQuantity
        },
        addReview(productReview) {
            this.reviews.push(productReview)
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
        },
        }
})

Vue.component('product-details', {
    template: ` <ul>
                    <li v-for="detail in details">{{ detail }}</li>
                </ul>`,
    data() {
        return {
            details: ['80% cotton', '20% polyester', 'Gender-neutral'],

        }
    },
    methods: {
        addToCart(id) {
            this.$emit('add-to-cart',
                this.variants[this.selectedVariant].variantId);
        },
    }
})

Vue.component('product-review', {
    template: `
<form class="review-form" @submit.prevent="onSubmit">

<p v-if="errors.length">
 <b>Please correct the following error(s):</b>

 <ul>
   <li v-for="error in errors">{{ error }}</li>
 </ul>
</p>
 <p>
   <label for="name">Name:</label>
   <input id="name" v-model="name" placeholder="name">
 </p>
 <p>
   <label for="review">Review:</label>
   <textarea id="review" v-model="review"></textarea>
 </p>
 <p>
   <label for="rating">Rating:</label>
   <select id="rating" v-model.number="rating">
     <option>5</option>
     <option>4</option>
     <option>3</option>
     <option>2</option>
     <option>1</option>
   </select>
 </p>
 <p>
   <input type="submit" value="Submit"> 
 </p>
</form>
 `,
    data() {
        return {
            name: null,
            review: null,
            rating: null,
            errors: [],

        }
    },
    methods:{
        onSubmit() {
            if (this.name && this.review && this.rating) {
                let productReview = {
                    name: this.name,
                    review: this.review,
                    rating: this.rating
                }
                eventBus.$emit('review-submitted', productReview)
                this.name = null
                this.review = null
                this.rating = null
            } else {
                if (!this.name) this.errors.push("Name required.")
                if (!this.review) this.errors.push("Review required.")
                if (!this.rating) this.errors.push("Rating required.")
            }
        },

        mounted() {
            eventBus.$on('review-submitted', productReview => {
                this.reviews.push(productReview)
            })
        }
    }
})

Vue.component('product-tabs', {
    props: {
        reviews: {
            type: Array,
            required: false
        }
    },
    template: `
 <div>   
       <ul>
         <span class="tab"
               :class="{ activeTab: selectedTab === tab }"
               v-for="(tab, index) in tabs"
               @click="selectedTab = tab"
         >{{ tab }}</span>
       </ul>
       <div v-show="selectedTab === 'Reviews'">
         <p v-if="!reviews.length">There are no reviews yet.</p>
         <ul v-else>
           <li v-for="review in reviews" :key="review.name">
             <p><strong>{{ review.name }}</strong></p>
             <p>Rating: {{ review.rating }}</p>
             <p>{{ review.review }}</p>
           </li>
         </ul>
       </div>
       <div v-show="selectedTab === 'Make a Review'">
         <product-review @review-submitted="addReview"></product-review>
       </div>
     </div>
 `,
    data() {
        return {
            tabs: ['Reviews', 'Make a Review'],
            selectedTab: 'Reviews', // устанавливается с помощью @click
        }
    },
    methods: {
        addReview(productReview) {
            this.reviews.push(productReview);
        }
    },
    mounted() {
        eventBus.$on('review-submitted', productReview => {
            this.addReview(productReview);
        });
    }
});


let app = new Vue({
    el: '#app',
    data: {
        premium: true,
        cart: [],
        activeTab: 'Reviews',
        reviews: [],
    },
    methods: {
        addToCart(id) {
            this.cart.push(id);
            console.log('Added to cart:', id);
        },
        addReview(productReview) {
            this.reviews.push(productReview)
        },
        removeFromCart(id) {
            this.cart = this.cart.filter(item => item !== id);
            console.log('Removed from cart:', id);
        },
    }
})
