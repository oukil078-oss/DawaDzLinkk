import { useState } from 'react';
import { Search, Filter, Package, Star, CheckCircle, XCircle } from 'lucide-react';
import { Product } from '../PharmacyDashboard';

interface ProductSearchProps {
  onProductSelect: (product: Product) => void;
}

export function ProductSearch({ onProductSelect }: ProductSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const products: Product[] = [
    {
      id: '1',
      name: 'Paracétamol 500mg',
      reference: 'MED-001',
      category: 'Antalgique',
      price: 25.50,
      supplier: 'Pharma Distribution SA',
      supplierRating: 4.8,
      available: true
    },
    {
      id: '2',
      name: 'Amoxicilline 1g',
      reference: 'MED-002',
      category: 'Antibiotique',
      price: 85.00,
      supplier: 'MediSupply Pro',
      supplierRating: 4.5,
      available: false
    },
    {
      id: '3',
      name: 'Ibuprofène 400mg',
      reference: 'MED-003',
      category: 'Anti-inflammatoire',
      price: 35.00,
      supplier: 'Pharma Distribution SA',
      supplierRating: 4.8,
      available: true
    },
    {
      id: '4',
      name: 'Aspirine 100mg',
      reference: 'MED-010',
      category: 'Antalgique',
      price: 15.50,
      supplier: 'HealthCare Solutions',
      supplierRating: 4.6,
      available: true
    },
    {
      id: '5',
      name: 'Doliprane 1000mg',
      reference: 'MED-011',
      category: 'Antalgique',
      price: 45.00,
      supplier: 'Pharma Distribution SA',
      supplierRating: 4.8,
      available: true
    },
  ];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.reference.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div>
      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher par nom ou référence..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
            >
              <option value="all">Toutes catégories</option>
              <option value="Antalgique">Antalgique</option>
              <option value="Antibiotique">Antibiotique</option>
              <option value="Anti-inflammatoire">Anti-inflammatoire</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <p className="text-gray-600 mb-4">
        {filteredProducts.length} produit{filteredProducts.length > 1 ? 's' : ''} trouvé{filteredProducts.length > 1 ? 's' : ''}
      </p>

      {/* Products Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden cursor-pointer"
            onClick={() => onProductSelect(product)}
          >
            <div className={`h-2 ${product.available ? 'bg-green-500' : 'bg-red-500'}`}></div>
            
            <div className="p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Package className="w-6 h-6 text-gray-600" />
                </div>
                <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                  product.available 
                    ? 'bg-emerald-100 text-emerald-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {product.available ? (
                    <CheckCircle className="w-3 h-3" />
                  ) : (
                    <XCircle className="w-3 h-3" />
                  )}
                  <span>{product.available ? 'Disponible' : 'Indisponible'}</span>
                </div>
              </div>

              <h4 className="mb-1 text-gray-900">{product.name}</h4>
              <p className="text-sm text-gray-600 mb-1">{product.reference}</p>
              <p className="text-sm text-gray-500 mb-3">{product.category}</p>

              <div className="mb-4 pb-4 border-b border-gray-200">
                <p className="text-2xl text-green-600">{product.price.toFixed(2)} DZD</p>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-1">Fournisseur</p>
                <p className="text-gray-900 mb-2">{product.supplier}</p>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  <span className="text-sm text-gray-700">{product.supplierRating}</span>
                  <span className="text-sm text-gray-500">(156 avis)</span>
                </div>
              </div>

              {product.available && (
                <button className="w-full mt-4 bg-sky-600 text-white py-2 rounded-lg hover:bg-sky-700 transition-colors">
                  Contacter le fournisseur
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}