import { useState } from 'react';
import { X, Calendar } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  reference: string;
  dci: string;
  price: number;
  ug: number;
  available: boolean;
  product_type?: 'medical' | 'paramedical' | 'other';
  expiry_date?: string | null;
  category?: string;
  stock_quantity?: number;
}

interface EditProductModalProps {
  product: Product;
  onClose: () => void;
  onUpdate: (product: Product) => void;
}

export function EditProductModal({ product, onClose, onUpdate }: EditProductModalProps) {
  const [formData, setFormData] = useState({
    name: product.name,
    reference: product.reference,
    dci: product.dci,
    price: product.price.toString(),
    ug: product.ug.toString(),
    available: product.available,
    product_type: product.product_type || 'medical',
    expiry_date: product.expiry_date || '',
    category: product.category || '',
    stock_quantity: product.stock_quantity?.toString() || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate({
      ...product,
      name: formData.name,
      reference: formData.reference,
      dci: formData.dci,
      price: parseFloat(formData.price),
      ug: parseInt(formData.ug),
      available: formData.available,
      product_type: formData.product_type as 'medical' | 'paramedical' | 'other',
      expiry_date: formData.expiry_date || null,
      category: formData.category,
      stock_quantity: formData.stock_quantity ? parseInt(formData.stock_quantity) : undefined,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-scale-in">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900">Modifier le produit</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Nom Commercial *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
              placeholder="Ex: Doliprane 500mg"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Référence *</label>
            <input
              type="text"
              required
              value={formData.reference}
              onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
              placeholder="Ex: MED-001"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">DCI *</label>
            <input
              type="text"
              required
              value={formData.dci}
              onChange={(e) => setFormData({ ...formData, dci: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
              placeholder="Ex: Paracétamol"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">Type de produit *</label>
              <select
                required
                value={formData.product_type}
                onChange={(e) => setFormData({ ...formData, product_type: e.target.value as 'medical' | 'paramedical' | 'other' })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                data-testid="edit-product-type-select"
              >
                <option value="medical">Médical</option>
                <option value="paramedical">Paramédical</option>
                <option value="other">Autre</option>
              </select>
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">Date d'expiration</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="date"
                  value={formData.expiry_date}
                  onChange={(e) => setFormData({ ...formData, expiry_date: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                  data-testid="edit-product-expiry-input"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">Catégorie</label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                placeholder="Ex: Antalgique"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">Stock</label>
              <input
                type="number"
                value={formData.stock_quantity}
                onChange={(e) => setFormData({ ...formData, stock_quantity: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                placeholder="0"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">Prix (DZD) *</label>
              <input
                type="number"
                required
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">UG (%) *</label>
              <input
                type="number"
                required
                value={formData.ug}
                onChange={(e) => setFormData({ ...formData, ug: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                placeholder="0"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="available"
              checked={formData.available}
              onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
              className="w-5 h-5 text-teal-600 border-gray-300 rounded focus:ring-teal-500 transition-all"
            />
            <label htmlFor="available" className="text-sm font-medium text-gray-700">
              Produit disponible
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all font-medium"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700 hover:shadow-lg transition-all font-medium"
            >
              Enregistrer les modifications
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
