import { useState } from 'react';
import { X, Calendar } from 'lucide-react';

interface Product {
  name: string;
  reference: string;
  dci: string;
  price: number;
  ug: number;
  available: boolean;
  product_type: 'medical' | 'paramedical' | 'other';
  expiry_date: string | null;
  category?: string;
  stock_quantity?: number;
}

interface AddProductModalProps {
  onClose: () => void;
  onAdd: (product: Product) => void;
}

export function AddProductModal({ onClose, onAdd }: AddProductModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    reference: '',
    dci: '',
    price: '',
    ug: '',
    available: true,
    product_type: 'medical' as 'medical' | 'paramedical' | 'other',
    expiry_date: '',
    category: '',
    stock_quantity: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      ...formData,
      reference: formData.reference || '',
      dci: formData.dci || '',
      price: formData.price ? parseFloat(formData.price) : 0,
      ug: formData.ug ? parseInt(formData.ug) : 0,
      expiry_date: formData.expiry_date || null,
      stock_quantity: formData.stock_quantity ? parseInt(formData.stock_quantity) : 0,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-gray-900">Ajouter un produit</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block mb-2 text-gray-700">Nom Commercial *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ex: Doliprane 500mg"
            />
          </div>

          <div>
            <label className="block mb-2 text-gray-700">Référence</label>
            <input
              type="text"
              value={formData.reference}
              onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ex: MED-001"
            />
          </div>

          <div>
            <label className="block mb-2 text-gray-700">DCI</label>
            <input
              type="text"
              value={formData.dci}
              onChange={(e) => setFormData({ ...formData, dci: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              placeholder="Ex: Paracétamol"
              data-testid="product-dci-input"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 text-gray-700">Type de produit</label>
              <select
                value={formData.product_type}
                onChange={(e) => setFormData({ ...formData, product_type: e.target.value as 'medical' | 'paramedical' | 'other' })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                data-testid="product-type-select"
              >
                <option value="medical">Médical</option>
                <option value="paramedical">Paramédical</option>
                <option value="other">Autre</option>
              </select>
            </div>

            <div>
              <label className="block mb-2 text-gray-700">Date d'expiration</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="date"
                  value={formData.expiry_date}
                  onChange={(e) => setFormData({ ...formData, expiry_date: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  data-testid="product-expiry-input"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 text-gray-700">Catégorie</label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="Ex: Antalgique"
                data-testid="product-category-input"
              />
            </div>

            <div>
              <label className="block mb-2 text-gray-700">Stock initial</label>
              <input
                type="number"
                value={formData.stock_quantity}
                onChange={(e) => setFormData({ ...formData, stock_quantity: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="0"
                data-testid="product-stock-input"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 text-gray-700">Prix (DZD)</label>
              <input
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="0.00"
                data-testid="product-price-input"
              />
            </div>

            <div>
              <label className="block mb-2 text-gray-700">UG (%)</label>
              <input
                type="number"
                value={formData.ug}
                onChange={(e) => setFormData({ ...formData, ug: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="0"
                data-testid="product-ug-input"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="available"
              checked={formData.available}
              onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
              className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="available" className="text-gray-700">
              Produit disponible
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
            >
              Ajouter le produit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}