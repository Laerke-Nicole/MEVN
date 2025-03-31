import { ref, watch } from 'vue'
import type { CartItem, OrderItems } from '../../interfaces/interfaces'

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


    const cartTotal = ():number => {
        return Number(cart.value.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2));
    }

    // grab individual price
    const cartTotalIndividualProduct = (productId: string) => {
        const item = cart.value.find(item => item._id === productId);
        return item ? item.price * item.quantity : 0;
    }

    // calculate sales tax
    const salesTax = ():number => {
        const taxRates = 0.25
        return Math.round(cartTotal() * taxRates * 100) / 100;
    }

    // discount code
    const code = ref<string>('')

    const couponCodeDiscount = (codes: string) => {
        const couponCodeAccepted = codes === 'DISCOUNT'
        return couponCodeAccepted ? 0.9 : 1;
    }

    // total
    const grandTotal = ():number => {
        return Number(((cartTotal() + salesTax()) * couponCodeDiscount(code.value)).toFixed(2));
    }

    const orders = ref<OrderItems[]>(JSON.parse(localStorage.getItem('orders') || '[]'))
    
    // update if theres a chance to the orders
    watch(orders, (newOrders) => {
        // make sure its in right order
        localStorage.setItem('orders', JSON.stringify(newOrders));
    }, { deep: true}) // add to update the inner layer which is order array

    const checkOutBy = () => {
        const newOrder: OrderItems = {
            _id: `order${orders.value.length + 1}`,
            orderDate: new Date().toISOString(),
            total: cartTotal(),
            orderStatus: 'Processing',
            orderNumber: orders.value.length + 1,
            userName: 'John Doe',
            orderLine: cart.value.map(item => ({
                product: {
                    _id: item._id,
                    name: item.name,
                    description: '',
                    price: item.price,
                    imageURL: item.imageURL,
                    stock: 0,
                    discount: false,
                    discountPct: 0,
                    isHidden: false,
                    _createdBy: ''
                },
                quantity: item.quantity
            }))
        }
        // take info and push it
        orders.value.push(newOrder)
        cart.value = []
        localStorage.setItem('cart', JSON.stringify(cart.value));
        console.log("Order created: ", orders.value);
        localStorage.setItem('orders', JSON.stringify(orders.value));
    }
    

    return {
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,

        cartTotal,
        cartTotalIndividualProduct,
        salesTax,
        code,
        grandTotal,

        orders,
        checkOutBy
    }
}