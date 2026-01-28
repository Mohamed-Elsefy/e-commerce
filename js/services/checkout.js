import { getCurrentUserMail } from '../services/auth_services.js';
//set order default
export async function setOrderDefault() {
    const order = [
        {
            id: 1,
            name: 'Osama Elgendy',
            email: 'elgendy@gmail.com',
            phone: '123456789',
            address: '123 Main St',
            city: 'Anytown',
            state: 'CA',
            zip: '12345',
            country: 'USA',
            paymentMethod: 'creditCard',
            cardNumber: '1234567890123456',
            cardExpiry: '12/25',
            cardCvv: '123',
            orderDate: new Date(),
            orderStatus: 'pending',
            orderTotal: 1000,
            orderItems: [
                {
                    productId: 1,
                    name: 'Product 1',
                    price: 100,
                    discount: 10,
                    qty: 2,
                    color: 'Red',
                    size: 'M'
                }
            ]
        }, {
            id: 2,
            name: 'Osama Elgendy',
            email: 'elgendy@gmail.com',
            phone: '123456789',
            address: '123 Main St',
            city: 'Anytown',
            state: 'CA',
            zip: '12345',
            country: 'USA',
            paymentMethod: 'creditCard',
            cardNumber: '1234567890123456',
            cardExpiry: '12/25',
            cardCvv: '123',
            orderDate: new Date(),
            orderStatus: 'pending',
            orderTotal: 1000,
            orderItems: [
                {
                    productId: 1,
                    name: 'Product 1',
                    price: 100,
                    discount: 10,
                    qty: 2,
                    color: 'Red',
                    size: 'M'
                }
            ]
        }
    ];
    localStorage.setItem('order', JSON.stringify(order));
}
// get user orders
export async function getUserOrder() {
    const order = localStorage.getItem('order');
    const userMail = getCurrentUserMail();
    const userOrder = JSON.parse(order).filter(o => o.email === userMail);
    if (!userOrder) {
        return [];
    }
    return userOrder;
}