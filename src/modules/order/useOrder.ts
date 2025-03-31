import { ref } from 'vue'
import type { Order } from '../../interfaces/interfaces'

export const useOrder = () => {
    // add items in cart as an order
    const order = ref<Order[]>(JSON.parse(localStorage.getItem('order') || '[]'));

    const buyNow = (order: Omit<Order, 'quantity'>) => {
        
    }

    return {
        order,
        buyNow
    }
}