let eventBus = new Vue();

Vue.component('product-tabs', {
    props: {
        reviews: {
            type: Array,
            required: false
        },
        shippingCost: {
            type: String,
            required: true
        },
        details: {
            type: Array,
            required: true
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
        <ul>
            <li v-for="review in reviews" :key="review.name">
                <p>{{ review.name }}</p>
                <p>Rating: {{ review.rating }}</p>
                <p>{{ review.review }}</p>
                <p>Recommended: {{ review.recommendation }}</p>
                <p>Date: {{ review.date }}</p>
            </li>
        </ul>
    </div>
    <div v-show="selectedTab === 'Make a Review'">
        <product-review></product-review>
    </div>
    <div v-show="selectedTab === 'Shipping'">
        <p>Shipping Cost: {{ shippingCost }}</p>
    </div>
    <div v-show="selectedTab === 'Details'">
        <h2>Details:</h2>
        <ul>
            <li v-for="detail in details" :key="detail">{{ detail }}</li>
        </ul>
    </div>
</div>
`,
    data() {
        return {
            tabs: ['Reviews', 'Make a Review', 'Shipping', 'Details'],
            selectedTab: 'Reviews',

        }
    }
});

Vue.component('product-review', {
    template: `
<form class="review-form" @submit.prevent="onSubmit">
    <p v-if="errors.length">
        <b>Please correct the following error(s):</b>
    <ul>
        <li v-for="error in errors" :key="error">{{ error }}</li>
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
            <option disabled value="">Please select one</option>
            <option>1</option>
            <option>2</option>
            <option>3</option>
            <option>4</option>
            <option>5</option>
        </select>
    </p>
    <p>
        <label>Would you recommend this product?</label>
        <label>
            <input type="radio" value="yes" v-model="recommendation"> Yes
        </label>
        <label>
            <input type="radio" value="no" v-model="recommendation"> No
        </label>
    </p>
    <p>
        <input type="submit" value="Submit">
    </p>
</form>
`,
    data() {
        return {
            name: '',
            review: '',
            rating: null,
            recommendation: '',
            errors: [],
            date: ''
        }
    },
    methods: {
        onSubmit() {
            this.errors = [];
            if (this.name && this.review && this.rating && this.recommendation) {
                const productReview = {
                    name: this.name,
                    review: this.review,
                    rating: this.rating,
                    recommendation: this.recommendation,
                    date: new Date().toLocaleDateString()
                };
                eventBus.$emit('review-submitted', productReview);
                this.resetForm();
            } else {
                this.errors.push(...[
                    !this.name && "Name required.",
                    !this.review && "Review required.",
                    !this.rating && "Rating required.",
                    !this.recommendation && "Recommendation required."
                    ].filter(Boolean));
            }
        },
        resetForm() {
            this.name = '';
            this.review = '';
            this.rating = null;
            this.recommendation = '';
        }
    }
});

Vue.component('product-details', {
    props: {
        details: {
            type: Array,
            required: true
        }
    },
    template: `
<div>
    <h2>Details:</h2>
    <ul>
        <li v-for="detail in details" :key="detail">{{ detail }}</li>
    </ul>
</div>
`
});

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
        <img :src="image" :alt="altText"/>
    </div>
    <div class="product-info">
        <h1>{{ title }}</h1>
        <p>{{ description }}</p>
        <a :href="link">More products like this</a>
        <p v-if="inStock">In stock</p>
        <p v-else style="text-decoration: line-through">Out of Stock</p>
        <span v-if="onSale"> On Sale </span>
        <br><br>
        <p>{{ sale }}</p>
        <div
                class="color-box"
                v-for="(variant, index) in variants"
                :key="variant.variantId"
                :style="{ backgroundColor: variant.variantColor }"
                @mouseover="updateProduct(index)"></div>
        <h2>Available Sizes:</h2>
        <ul>
            <li v-for="size in sizes" :key="size">{{ size }}</li>
        </ul>
        <button @click="addToCart" :disabled="!inStock" :class="{ disabledButton: !inStock }">Add to cart</button>
        <button @click="removeFromCart">Remove from cart</button>
        <div>
            <product-tabs :reviews="reviews" :shipping-cost="shipping" :details="details"></product-tabs>
        </div>
    </div>

</div>
`,
    data() {
        return {
            reviews: [],
            product: "Socks",
            brand: 'Vue Mastery',
            description: "A pair of warm, fuzzy socks",
            altText: "A pair of socks",
            inStock: true,
            inventory: 100,
            selectedVariant: 0,
            link: 'https://www.amazon.com/s/ref=nb_sb_noss?url=search-alias%3Daps&field-keywords=socks',
            onSale: true,
            details: ['80% cotton', '20% polyester', 'Gender-neutral'],
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
                    variantQuantity: 5
                }
            ],
            sizes: ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
            cart: []
        }
    },
    methods: {
        addToCart() {
            this.$emit('add-to-cart', this.variants[this.selectedVariant].variantId);
        },
        removeFromCart() {
            this.$emit('remove-from-cart');
        },
        updateProduct(index) {
            this.selectedVariant = index;
        },
        addReview(productReview) {
            this.reviews.push(productReview);
        }
    },
    mounted() {
        eventBus.$on('review-submitted', this.addReview);
    },
    beforeDestroy() {
        eventBus.$off('review-submitted', this.addReview);
    },
    computed: {
        title() {
            return this.brand + ' ' + this.product;
        },
        image() {
            return this.variants[this.selectedVariant].variantImage;
        },
        inStock() {
            return this.variants[this.selectedVariant].variantQuantity > 0;
        },
        sale() {
            return this.onSale ? `${this.brand} ${this.product} is on sale!` : `${this.brand} ${this.product} is not on sale.`;
        },
        shipping() {
            return this.premium ? "Free" : "2.99";
        }
    }
});

let app = new Vue({
    el: '#app',
    data: {
        premium: true,
        cart: []
    },
    methods: {
        updateCart(id) {
            this.cart.push(id);
        },
        updateRemoveFromCart() {
            if (this.cart.length > 0) {
                this.cart.pop();
            }
        }
    }
});