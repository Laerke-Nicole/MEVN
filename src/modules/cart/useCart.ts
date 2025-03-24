import { ref } from 'vue'
import type { CartItem } from '../../interfaces/interfaces'

export const useCart = () => {
    // if we have data
    const cart = ref<CartItem[]>(JSON.parse(localStorage.getItem('cart') || '[]'));

    const addToCart = (product: Omit<CartItem, 'quantity'>) => {
        // if product exists grab it by its ID
        const existingItem = cart.value.find(item => item._id === product._id);
        if (existingItem) {
            existingItem.quantity += 1;
            console.log("Added existing item quantity", existingItem)
        }
        else {
            cart.value.push({...product, quantity: 1});
            console.log("Added item to cart", cart.value)
        }
        localStorage.setItem('cart', JSON.stringify(cart.value));
        console.log("Added item to cart: ", cart.value)
    }

    return {
        cart,
        addToCart
    }

    // return cart so we have acces to system
    return {

    }
}