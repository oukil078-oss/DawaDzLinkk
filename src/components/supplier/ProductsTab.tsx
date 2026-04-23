import { useState, useEffect } from 'react';
import { Plus, Search, Upload, CreditCard as Edit, Trash2, Package, Calendar } from 'lucide-react';
import { AddProductModal } from './AddProductModal';
import { ImportExcelModal } from './ImportExcelModal';
import { EditProductModal } from './EditProductModal';
import { useAuth } from '../../contexts/AuthContext';
import { productsApi, suppliersApi } from '../../lib/api';

interface Product {
  id: string;
  name: string;
  reference: string;
  dci: string;
  price: number;
  ug: number;
  available: boolean;
  expiry_date?: string;
  product_type?: string;
}

export function ProductsTab() {
  const { details } = useAuth();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await suppliersApi.getProducts();
      setProducts(data);
    } catch (error) {
      console.error('Error loading products:', error);
      alert('Erreur lors du chargement des produits.');
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.reference.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) return;
    try {
      await productsApi.delete(id);
      setProducts(products.filter(p => p.id !== id));
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Échec de la suppression du produit');
    }
  };

  const handleToggleAvailability = async (id: string) => {
    try {
      const product = products.find(p => p.id === id);
      if (!product) return;

      await productsApi.update(id, { available: !product.available });
      setProducts(products.map(p =>
        p.id === id ? { ...p, available: !p.available } : p
      ));
    } catch (error) {
      console.error('Error toggling availability:', error);
      alert('Échec de la mise à jour');
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setShowEditModal(true);
  };

  const handleUpdateProduct = async (updatedProduct: Product) => {
    try {
      await productsApi.update(updatedProduct.id, {
        name: updatedProduct.name,
        reference: updatedProduct.reference,
        dci: updatedProduct.dci,
        price: updatedProduct.price,
        ug: updatedProduct.ug,
        available: updatedProduct.available,
      });
      setProducts(products.map(p =>
        p.id === updatedProduct.id ? updatedProduct : p
      ));
      setShowEditModal(false);
      setEditingProduct(null);
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Échec de la mise à jour du produit');
    }
  };

  const handleAddProduct = async (product: Omit<Product, 'id'>) => {
    try {
      const newProduct = await productsApi.create(product);
      setProducts([newProduct, ...products]);
      setShowAddModal(false);
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Échec de l\'ajout du produit');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des produits...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm sm:text-base text-gray-600 mb-1">Total Produits</p>
              <p className="text-2xl sm:text-3xl text-gray-900">{products.length}</p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-teal-100 rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 sm:w-6 sm:h-6 text-teal-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm sm:text-base text-gray-600 mb-1">Disponibles</p>
              <p className="text-2xl sm:text-3xl text-emerald-600">
                {products.filter(p => p.available).length}
              </p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 sm:p-6 sm:col-span-2 md:col-span-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm sm:text-base text-gray-600 mb-1">En rupture</p>
              <p className="text-2xl sm:text-3xl text-red-600">
                {products.filter(p => !p.available).length}
              </p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Actions Bar */}
      <div className="bg-white rounded-lg shadow p-4 mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un produit..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
              data-testid="product-search-input"
            />
          </div>
          <div className="flex gap-2 sm:gap-3">
            <button
              onClick={() => setShowImportModal(true)}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 sm:py-2 border border-teal-600 text-teal-700 rounded-lg hover:bg-teal-50 transition-colors text-sm sm:text-base"
              data-testid="import-excel-btn"
            >
              <Upload className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden xs:inline">Import</span>
              <span className="xs:hidden">Excel</span>
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 sm:py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors text-sm sm:text-base"
              data-testid="add-product-btn"
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
              Ajouter
            </button>
          </div>
        </div>
      </div>

      {/* Products Table - Desktop */}
      <div className="hidden lg:block bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Nom Commercial</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Référence</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">DCI</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Prix (DZD)</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">UG (%)</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Expiration</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Statut</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50" data-testid={`product-row-${product.id}`}>
                  <td className="px-6 py-4 text-sm text-gray-900">{product.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{product.reference}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{product.dci}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{product.price.toFixed(2)} DZD</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{product.ug}%</td>
                  <td className="px-6 py-4 text-sm">
                    {product.expiry_date ? (
                      <span className={`flex items-center gap-1 ${
                        new Date(product.expiry_date) < new Date() 
                          ? 'text-red-600 font-medium' 
                          : new Date(product.expiry_date) < new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
                          ? 'text-orange-600'
                          : 'text-gray-600'
                      }`}>
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(product.expiry_date).toLocaleDateString('fr-FR')}
                      </span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleToggleAvailability(product.id)}
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        product.available
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                      data-testid={`toggle-availability-${product.id}`}
                    >
                      {product.available ? 'Disponible' : 'Indisponible'}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEditProduct(product)}
                        className="p-2 text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
                        title="Modifier"
                        data-testid={`edit-product-${product.id}`}
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Supprimer"
                        data-testid={`delete-product-${product.id}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Products Cards - Mobile & Tablet */}
      <div className="lg:hidden space-y-4">
        {filteredProducts.map((product) => (
          <div key={product.id} className="bg-white rounded-lg shadow p-4" data-testid={`product-card-${product.id}`}>
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="font-medium text-gray-900 mb-1">{product.name}</h3>
                <p className="text-sm text-gray-600">{product.reference}</p>
                <p className="text-xs text-gray-500 mt-1">{product.dci}</p>
              </div>
              <button
                onClick={() => handleToggleAvailability(product.id)}
                className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ml-2 ${
                  product.available
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {product.available ? 'Disponible' : 'Indisponible'}
              </button>
            </div>
            
            <div className="flex items-center justify-between py-3 border-t border-gray-100">
              <div className="flex gap-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Prix</p>
                  <p className="text-sm font-medium text-gray-900">{product.price.toFixed(2)} DZD</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">UG</p>
                  <p className="text-sm font-medium text-gray-900">{product.ug}%</p>
                </div>
                {product.expiry_date && (
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Exp.</p>
                    <p className={`text-sm font-medium ${
                      new Date(product.expiry_date) < new Date() 
                        ? 'text-red-600' 
                        : new Date(product.expiry_date) < new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
                        ? 'text-orange-600'
                        : 'text-gray-900'
                    }`}>
                      {new Date(product.expiry_date).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleEditProduct(product)}
                  className="p-2 text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
                  title="Modifier"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteProduct(product.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Supprimer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showAddModal && (
        <AddProductModal
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddProduct}
        />
      )}

      {showImportModal && (
        <ImportExcelModal
          onClose={() => setShowImportModal(false)}
          onImport={(importedProducts) => {
            // Reload all products from the database to ensure consistency
            loadProducts();
            setShowImportModal(false);
          }}
        />
      )}

      {showEditModal && editingProduct && (
        <EditProductModal
          product={editingProduct}
          onClose={() => {
            setShowEditModal(false);
            setEditingProduct(null);
          }}
          onUpdate={handleUpdateProduct}
        />
      )}
    </div>
  );
}
