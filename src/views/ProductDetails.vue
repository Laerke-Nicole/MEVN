<template>
    <div v-if="product && product.length > 0" class="flex flex-wrap">
        <div class="w-1/2 p-4">
            <img :src="product[0].imageURL" alt="product image" class="w-full rounded-lg object-cover h-full" />
        </div>
        <div class="w-1/2 p-4">
            <h2 class="text-slate-200 text-2xl font-bold mb-4">{{ product[0].name }}</h2>
            <p class="mb-4">{{ product[0].description }}</p>
            <p class="text-green-500 font-bold">$ {{ product[0].price }}</p>
        </div>
    </div>
    <div v-else>
        Loading product details...
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useProducts } from '../modules/useProducts';
import type { Product } from '../interfaces/interfaces';

const route = useRoute();
const product = ref<Product[] | null>(null);

const { fetchProductById } = useProducts();

// when the html is being rendered, then collect the data
onMounted(async() => {
    const productId = route.params.id as string;
    const fetchProduct = await fetchProductById(productId);
    console.log("Fetched product", fetchProduct);
    product.value = fetchProduct;
    console.log("Product: ", product.value);
})


</script>

<style>

</style>