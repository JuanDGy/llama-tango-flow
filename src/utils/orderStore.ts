
// Store for orders data that persists between sessions
export interface OrderItem {
  productId: number;
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: number;
  clientName: string;
  clientEmail: string;
  products: OrderItem[];
  total: number;
  date: string;
  status: 'Pendiente' | 'En proceso' | 'Entregado';
  locationId: number;
  address: string;
}

// Get orders from localStorage
export const getOrders = (): Order[] => {
  const orders = localStorage.getItem('cafeOrders');
  return orders ? JSON.parse(orders) : [];
};

// Save orders to localStorage
export const saveOrder = (order: Omit<Order, 'id' | 'date' | 'status'>): Order => {
  const orders = getOrders();
  
  const newOrder: Order = {
    ...order,
    id: orders.length > 0 ? Math.max(...orders.map(o => o.id)) + 1 : 1,
    date: new Date().toLocaleDateString(),
    status: 'Pendiente'
  };
  
  orders.push(newOrder);
  localStorage.setItem('cafeOrders', JSON.stringify(orders));
  return newOrder;
};

// Update order status
export const updateOrderStatus = (id: number, status: Order['status']): boolean => {
  const orders = getOrders();
  const orderIndex = orders.findIndex(o => o.id === id);
  
  if (orderIndex === -1) return false;
  
  orders[orderIndex].status = status;
  localStorage.setItem('cafeOrders', JSON.stringify(orders));
  return true;
};
