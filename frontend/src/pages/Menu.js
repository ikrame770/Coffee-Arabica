import React, { useEffect, useState } from 'react';

function Menu() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(true);

  const categories = [
    { id: 'ALL', name: 'Tout', icon: '🌟' },
    { id: 'COFFEE', name: 'Cafés', icon: '☕' },
    { id: 'CREPE', name: 'Crêpes', icon: '🥞' },
    { id: 'CAKE', name: 'Gâteaux', icon: '🍰' },
    { id: 'BEVERAGE', name: 'Boissons', icon: '🥤' }
  ];

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    if (selectedCategory === 'ALL') {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(
        products.filter(p => p.category === selectedCategory)
      );
    }
  }, [selectedCategory, products]);


  const loadProducts = async () => {
    try {
      const res = await fetch('http://localhost:8081/api/products/available');
      if (!res.ok) throw new Error('Erreur chargement');
      const data = await res.json();
      setProducts(data);
      setFilteredProducts(data);
    } catch (error) {
      console.error('Erreur:', error);
      alert('Impossible de charger les produits');
    } finally {
      setLoading(false);
    }
  };



  const addToCart = (product) => {
    const exist = cart.find(item => item.product.id === product.id);
    if (exist) {
      setCart(cart.map(item =>
        item.product.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { product, quantity: 1 }]);
    }
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      setCart(cart.filter(item => item.product.id !== productId));
    } else {
      setCart(cart.map(item =>
        item.product.id === productId
          ? { ...item, quantity: newQuantity }
          : item
      ));
    }
  };

  const handleOrder = async () => {
    if (!customerName.trim()) {
      alert('Veuillez entrer votre nom !');
      return;
    }

    if (cart.length === 0) {
      alert('Votre panier est vide !');
      return;
    }

    const order = {
      customerName: customerName.trim(),
      phone: phone.trim(),
      items: cart.map(item => ({
        product: { id: item.product.id },
        quantity: item.quantity
      }))
    };

    try {
      const res = await fetch('http://localhost:8081/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order)
      });

      if (!res.ok) throw new Error('Erreur commande');

      alert('✅ Commande créée avec succès !');
      setCart([]);
      setShowCart(false);
      setCustomerName('');
      setPhone('');
    } catch (error) {
      console.error('Erreur:', error);
      alert('❌ Erreur lors de la création de la commande');
    }
  };

  const total = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Chargement du menu...</p>
      </div>
    );
  }

  return (
    <div className="container">
      {/* CHANGÉ: hero → menu-header */}
      <div className="menu-header">
        <h1 className="menu-title">📋 Notre Menu</h1>
        <p className="menu-subtitle">Découvrez nos délicieux produits</p>
      </div>

      {/* Filtres */}
      <div className="filters">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`filter-btn ${selectedCategory === cat.id ? 'active' : ''}`}
          >
            {cat.icon} {cat.name}
          </button>
        ))}
      </div>

      {/* Produits */}
      {filteredProducts.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">😔</div>
          <h3 className="empty-title">Aucun produit disponible</h3>
          <p>Cette catégorie est vide pour le moment</p>
        </div>
      ) : (
        <div className="grid">
          {filteredProducts.map(product => (
            <div key={product.id} className="product-card">
              <img
                src={product.image || 'https://via.placeholder.com/280x200?text=Produit'}
                alt={product.name}
                className="product-image"
              />
              <div className="product-info">
                <div className="product-name">{product.name}</div>
                <p className="product-description">
                  {product.description || 'Délicieux produit'}
                </p>
                <div className="product-price">{product.price} MAD</div>
                <button onClick={() => addToCart(product)} className="btn btn-primary">
                  🛒 Ajouter au panier
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Bouton panier flottant */}
      {cart.length > 0 && (
        <div onClick={() => setShowCart(true)} className="cart-float">
          🛒 Panier <span className="cart-count">{cart.length}</span>
        </div>
      )}

      {/* Modal panier */}
      {showCart && (
        <div onClick={() => setShowCart(false)} className="modal-overlay">
          <div onClick={(e) => e.stopPropagation()} className="modal">
            <div className="modal-header">
              <h2 className="modal-title">🛒 Votre Panier</h2>
              <button onClick={() => setShowCart(false)} className="modal-close">×</button>
            </div>

            <div className="modal-body">
              {cart.map(item => (
                <div key={item.product.id} className="cart-item">
                  <div className="cart-item-info">
                    <div className="cart-item-name">{item.product.name}</div>
                    <div className="cart-item-details">
                      {item.product.price} MAD × {item.quantity}
                    </div>
                  </div>
                  <div className="cart-item-controls">
                    <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)}>
                      -
                    </button>
                    <span className="cart-quantity">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)}>
                      +
                    </button>
                    <button
                      onClick={() => updateQuantity(item.product.id, 0)}
                      className="btn-delete"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}

              <div className="cart-total">
                Total: {total.toFixed(2)} MAD
              </div>

              <div className="form-group">
                <label className="form-label">Votre nom *</label>
                <input
                  className="form-input"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Entrez votre nom"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Téléphone</label>
                <input
                  className="form-input"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Votre numéro de téléphone"
                />
              </div>

              <button onClick={handleOrder} className="btn btn-success">
                ✅ Confirmer la commande
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Menu;