
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
  estimatedPreparationTime?: number;
  estimatedDeliveryTime?: number;
}

export interface Claim {
  id: number;
  clientName: string;
  clientEmail: string;
  subject: string;
  message: string;
  date: string;
  status: 'Pendiente' | 'Resuelto';
  claimType: string;
}

// Sistema de límites
export const MAX_CONCURRENT_USERS = 5;
export const MAX_PRODUCTS_PER_USER = 20;

// Controlar usuarios activos
export const getActiveUsers = (): string[] => {
  const activeUsers = localStorage.getItem('cafeActiveUsers');
  return activeUsers ? JSON.parse(activeUsers) : [];
};

export const addActiveUser = (email: string): boolean => {
  const activeUsers = getActiveUsers();
  
  // Verificar si ya está el usuario
  if (activeUsers.includes(email)) return true;
  
  // Verificar si se excedió el límite
  if (activeUsers.length >= MAX_CONCURRENT_USERS) return false;
  
  activeUsers.push(email);
  localStorage.setItem('cafeActiveUsers', JSON.stringify(activeUsers));
  return true;
};

export const removeActiveUser = (email: string): void => {
  const activeUsers = getActiveUsers();
  const updatedUsers = activeUsers.filter(user => user !== email);
  localStorage.setItem('cafeActiveUsers', JSON.stringify(updatedUsers));
};

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
  
  // Decreasing stock when a new order is placed
  updateStockFromOrder(newOrder);
  
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

// Claims management
export const getClaims = (): Claim[] => {
  const claims = localStorage.getItem('cafeClaims');
  return claims ? JSON.parse(claims) : [];
};

export const saveClaim = (claim: Omit<Claim, 'id' | 'date' | 'status'>): Claim => {
  const claims = getClaims();
  
  const newClaim: Claim = {
    ...claim,
    id: claims.length > 0 ? Math.max(...claims.map(c => c.id)) + 1 : 1,
    date: new Date().toLocaleDateString(),
    status: 'Pendiente'
  };
  
  claims.push(newClaim);
  localStorage.setItem('cafeClaims', JSON.stringify(claims));
  return newClaim;
};

export const updateClaimStatus = (id: number, status: Claim['status']): boolean => {
  const claims = getClaims();
  const claimIndex = claims.findIndex(c => c.id === id);
  
  if (claimIndex === -1) return false;
  
  claims[claimIndex].status = status;
  localStorage.setItem('cafeClaims', JSON.stringify(claims));
  return true;
};

// Stock management
export const getInventory = () => {
  const inventory = localStorage.getItem('cafeInventory');
  return inventory ? JSON.parse(inventory) : [];
};

export const saveInventory = (inventory: any[]) => {
  localStorage.setItem('cafeInventory', JSON.stringify(inventory));
};

export const updateStockFromOrder = (order: Order) => {
  const inventory = getInventory();
  
  if (!inventory.length) return; // If no inventory exists yet, do nothing
  
  let updated = false;
  
  // Update stock for each product in the order
  order.products.forEach(item => {
    const productIndex = inventory.findIndex(p => p.id === item.productId);
    if (productIndex !== -1) {
      // Ensure stock doesn't go negative
      inventory[productIndex].stock = Math.max(0, inventory[productIndex].stock - item.quantity);
      updated = true;
    }
  });
  
  if (updated) {
    saveInventory(inventory);
  }
};
