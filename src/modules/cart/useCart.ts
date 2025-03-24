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

    const removeFromCart = (productId: string) => {
        const existingItem = cart.value.find(item => item._id === productId)
        if (existingItem) {
            cart.value = cart.value.filter(item => item._id !== productId);
            localStorage.setItem('cart', JSON.stringify(cart.value));
        }
    }


    const updateQuantity = (productId: string, quantity: number) => {
        const item = cart.value.find(item => item._id === productId);
        localStorage.setItem('cart', JSON.stringify(cart.value));
        if (item) {
            item.quantity = quantity
            // if quantity is less than 0 remove from cart
            if (item.quantity <= 0) {
                removeFromCart(productId)
            }
            else {
                localStorage.setItem('cart', JSON.stringify(cart.value));
            }
        }
        console.log(`updated quantity: ${productId}, quantity ${quantity}`)
    }



    return {
        cart,
        addToCart,
        removeFromCart,
        updateQuantity
    }
}