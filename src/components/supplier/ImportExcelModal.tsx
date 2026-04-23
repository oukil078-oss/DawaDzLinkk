import { useState, useRef } from 'react';
import { X, Upload, FileSpreadsheet, Download, CircleCheck as CheckCircle, CircleAlert as AlertCircle, Loader as Loader2, Sparkles, Settings } from 'lucide-react';
import * as XLSX from 'xlsx';
import { productsApi } from '../../lib/api';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';

// API URL for direct calls
const API_URL = '';

interface Product {
  id: string;
  name: string;
  reference: string;
  dci: string;
  price: number;
  ug: number;
  available: boolean;
  stock_quantity?: number;
  product_type?: string;
  expiry_date?: string;
}

interface ImportExcelModalProps {
  onClose: () => void;
  onImport: (products: Product[]) => void;
}

interface ImportResult {
  success: number;
  failed: number;
  errors: string[];
}

type ImportMode = 'template' | 'ai';

export function ImportExcelModal({ onClose, onImport }: ImportExcelModalProps) {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [importMode, setImportMode] = useState<ImportMode>('ai');
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [parsedProducts, setParsedProducts] = useState<any[]>([]);
  const [aiMapping, setAiMapping] = useState<Record<string, string>>({});
  const [fileName, setFileName] = useState<string>('');
  const [rawData, setRawData] = useState<any[][]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const downloadTemplate = () => {
    const link = document.createElement('a');
    link.href = '/modele_import_produits_(1).xlsx';
    link.download = 'modele_import_produits.xlsx';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setIsUploading(true);
    setParsedProducts([]);
    setImportResult(null);
    setAiMapping({});

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];

      setRawData(jsonData);
      
      // Get column names from first row
      const headerRow = jsonData[0] || [];
      const columnNames = headerRow.map((col: any) => String(col || '').trim());
      setColumns(columnNames);

      if (importMode === 'ai') {
        // Use AI to analyze the file
        await analyzeWithAI(columnNames, jsonData);
      } else {
        // Use template-based parsing
        parseWithTemplate(jsonData);
      }
      
      setIsUploading(false);
    } catch (error) {
      console.error('Error parsing Excel file:', error);
      setImportResult({
        success: 0,
        failed: 0,
        errors: ['Erreur lors de la lecture du fichier Excel. Vérifiez le format.']
      });
      setIsUploading(false);
    }
  };

  const analyzeWithAI = async (columnNames: string[], jsonData: any[][]) => {
    setIsAnalyzing(true);
    try {
      const token = localStorage.getItem('token');
      
      // Prepare sample data (first 5 rows as objects)
      const sampleData: any[] = [];
      for (let i = 1; i < Math.min(6, jsonData.length); i++) {
        const row = jsonData[i];
        if (!row || row.length === 0) continue;
        
        const obj: Record<string, any> = {};
        columnNames.forEach((col, idx) => {
          obj[col] = row[idx] ?? '';
        });
        sampleData.push(obj);
      }

      const response = await fetch(`${API_URL}/api/analyze-excel`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          columns: columnNames,
          sample_data: sampleData
        })
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'analyse AI');
      }

      const result = await response.json();
      
      if (result.error) {
        showToast({ type: 'warning', title: 'Analyse partielle', message: result.error });
        // Fall back to template parsing
        parseWithTemplate(jsonData);
      } else {
        setAiMapping(result.mapping || {});
        
        // Use AI-parsed products if available
        if (result.products && result.products.length > 0) {
          // Transform AI products to match all rows
          const allProducts = transformAllRowsWithMapping(jsonData, result.mapping);
          setParsedProducts(allProducts);
          showToast({ type: 'success', title: 'Analyse IA terminée', message: `${allProducts.length} produit(s) détecté(s)` });
        } else {
          // Apply mapping to all rows
          const allProducts = transformAllRowsWithMapping(jsonData, result.mapping);
          setParsedProducts(allProducts);
        }
      }
    } catch (error: any) {
      console.error('AI analysis error:', error);
      showToast({ type: 'error', title: 'Erreur IA', message: 'Passage en mode manuel' });
      // Fall back to template parsing
      parseWithTemplate(jsonData);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const transformAllRowsWithMapping = (jsonData: any[][], mapping: Record<string, string>) => {
    const products: any[] = [];
    const headerRow = jsonData[0] || [];

    for (let i = 1; i < jsonData.length; i++) {
      const row = jsonData[i];
      if (!row || row.every((cell: any) => cell === undefined || cell === null || cell === '')) continue;

      const product: any = {
        name: '',
        reference: '',
        dci: '',
        description: null,
        category: null,
        product_type: 'medical',
        expiry_date: null,
        price: 0,
        ug: 0,
        stock_quantity: 0,
        min_order_quantity: 1,
        available: true,
      };

      headerRow.forEach((colName: string, idx: number) => {
        const mappedField = mapping[colName];
        if (!mappedField) return;
        const rawValue = row[idx];

        if (['price', 'ug', 'stock_quantity', 'min_order_quantity'].includes(mappedField)) {
          product[mappedField] = rawValue !== undefined && rawValue !== null && rawValue !== '' ? parseFloat(rawValue) || 0 : 0;
        } else if (mappedField === 'available') {
          product[mappedField] = rawValue !== undefined && rawValue !== null && rawValue !== ''
            ? String(rawValue).toLowerCase() === 'oui' || String(rawValue).toLowerCase() === 'true' || String(rawValue) === '1'
            : true;
        } else if (mappedField === 'expiry_date') {
          if (rawValue === undefined || rawValue === null || rawValue === '') {
            product[mappedField] = null;
          } else if (rawValue instanceof Date) {
            product[mappedField] = rawValue.toISOString().split('T')[0];
          } else if (typeof rawValue === 'number') {
            const date = new Date((rawValue - 25569) * 86400 * 1000);
            product[mappedField] = date.toISOString().split('T')[0];
          } else {
            product[mappedField] = String(rawValue).trim() || null;
          }
        } else {
          product[mappedField] = rawValue !== undefined && rawValue !== null && rawValue !== '' ? String(rawValue).trim() : null;
        }
      });

      if (!product.name) product.name = `Produit-${i}`;
      if (!product.reference) product.reference = `REF-${i}-${Date.now()}`;

      products.push(product);
    }

    return products;
  };

  const parseWithTemplate = (jsonData: any[][]) => {
    const products: any[] = [];
    for (let i = 1; i < jsonData.length; i++) {
      const row = jsonData[i];
      if (!row || row.every((cell: any) => cell === undefined || cell === null || cell === '')) continue;

      const parseDate = (val: any) => {
        if (!val && val !== 0) return null;
        if (val instanceof Date) return val.toISOString().split('T')[0];
        if (typeof val === 'number') return new Date((val - 25569) * 86400 * 1000).toISOString().split('T')[0];
        return String(val).trim() || null;
      };

      const product = {
        name: row[0] ? String(row[0]).trim() : `Produit-${i}`,
        reference: row[1] ? String(row[1]).trim() : `REF-${i}-${Date.now()}`,
        dci: row[2] ? String(row[2]).trim() : null,
        product_type: row[3] ? String(row[3]).trim() : 'medical',
        expiry_date: parseDate(row[4]),
        price: parseFloat(row[5]) || 0,
        ug: parseInt(row[6]) || 0,
        available: row[7] !== undefined && row[7] !== null && row[7] !== ''
          ? String(row[7]).toLowerCase() === 'oui' || String(row[7]).toLowerCase() === 'true' || String(row[7]) === '1'
          : true,
        stock_quantity: 0,
        min_order_quantity: 1,
        category: null,
      };

      products.push(product);
    }

    setParsedProducts(products);
  };

  const handleImport = async () => {
    if (parsedProducts.length === 0) return;

    setIsProcessing(true);
    const results: ImportResult = { success: 0, failed: 0, errors: [] };
    const importedProducts: Product[] = [];

    for (const product of parsedProducts) {
      try {
        const created = await productsApi.create({
          name: product.name || `Produit`,
          reference: product.reference || '',
          dci: product.dci || '',
          description: product.description || null,
          category: product.category || null,
          product_type: product.product_type || 'medical',
          expiry_date: product.expiry_date || null,
          price: product.price || 0,
          ug: product.ug || 0,
          stock_quantity: product.stock_quantity || 0,
          min_order_quantity: product.min_order_quantity || 1,
          available: product.available !== false,
        });
        
        importedProducts.push({
          id: created.id,
          name: created.name,
          reference: created.reference,
          dci: created.dci || 'N/A',
          price: created.price,
          ug: created.ug || 0,
          available: created.available,
          stock_quantity: created.stock_quantity,
          product_type: created.product_type,
          expiry_date: created.expiry_date,
        });
        results.success++;
      } catch (error: any) {
        results.failed++;
        results.errors.push(`${product.name}: ${error.message || 'Erreur inconnue'}`);
      }
    }

    setImportResult(results);
    setIsProcessing(false);

    if (importedProducts.length > 0) {
      setTimeout(() => {
        onImport(importedProducts);
      }, 1500);
    }
  };

  const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && (file.name.endsWith('.xlsx') || file.name.endsWith('.xls'))) {
      // Create a fake event to reuse handleFileSelect
      const fakeEvent = {
        target: { files: [file] }
      } as unknown as React.ChangeEvent<HTMLInputElement>;
      await handleFileSelect(fakeEvent);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Importer depuis Excel</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            data-testid="close-import-modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {/* Import Mode Selection */}
          <div className="mb-6">
            <p className="text-sm font-medium text-gray-700 mb-3">Mode d'importation:</p>
            <div className="flex gap-3">
              <button
                onClick={() => setImportMode('ai')}
                className={`flex-1 flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                  importMode === 'ai' 
                    ? 'border-teal-500 bg-teal-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  importMode === 'ai' ? 'bg-teal-500 text-white' : 'bg-gray-100 text-gray-500'
                }`}>
                  <Sparkles className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <p className={`font-medium ${importMode === 'ai' ? 'text-teal-700' : 'text-gray-700'}`}>
                    Import Intelligent (IA)
                  </p>
                  <p className="text-xs text-gray-500">L'IA analyse et mappe automatiquement vos colonnes</p>
                </div>
              </button>
              
              <button
                onClick={() => setImportMode('template')}
                className={`flex-1 flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                  importMode === 'template' 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  importMode === 'template' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-500'
                }`}>
                  <Settings className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <p className={`font-medium ${importMode === 'template' ? 'text-blue-700' : 'text-gray-700'}`}>
                    Mode Modèle
                  </p>
                  <p className="text-xs text-gray-500">Utilisez notre modèle Excel standard</p>
                </div>
              </button>
            </div>
          </div>

          {/* Step 1: Download template (only for template mode) */}
          {importMode === 'template' && (
            <div className="mb-6">
              <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <FileSpreadsheet className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-blue-900 mb-2">
                    Téléchargez d'abord notre modèle Excel pour assurer la compatibilité
                  </p>
                  <button 
                    onClick={downloadTemplate}
                    className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
                    data-testid="download-template-btn"
                  >
                    <Download className="w-4 h-4" />
                    Télécharger le modèle
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* AI Mode Info */}
          {importMode === 'ai' && (
            <div className="mb-6">
              <div className="flex items-start gap-3 p-4 bg-teal-50 border border-teal-200 rounded-lg">
                <Sparkles className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-teal-900 font-medium mb-1">Import intelligent avec IA</p>
                  <p className="text-sm text-teal-700">
                    Importez n'importe quel fichier Excel ! L'IA détectera automatiquement vos colonnes et remplira les valeurs manquantes avec "N/A" ou 0.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Upload file */}
          {!importResult && (
            <div 
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-teal-400 transition-colors"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileSelect}
                className="hidden"
                data-testid="excel-file-input"
              />
              
              {isUploading || isAnalyzing ? (
                <div className="py-4">
                  <Loader2 className="w-8 h-8 text-teal-600 animate-spin mx-auto mb-2" />
                  <p className="text-gray-600">
                    {isAnalyzing ? 'Analyse IA en cours...' : 'Lecture du fichier...'}
                  </p>
                  {isAnalyzing && (
                    <p className="text-sm text-gray-500 mt-1">L'IA détecte les colonnes et prépare l'import</p>
                  )}
                </div>
              ) : parsedProducts.length > 0 ? (
                <div className="py-4">
                  <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                  <p className="text-gray-900 font-medium mb-1">{fileName}</p>
                  <p className="text-green-600 mb-4">
                    {parsedProducts.length} produit(s) détecté(s) et prêt(s) à importer
                  </p>
                  <div className="flex gap-3 justify-center">
                    <button
                      onClick={() => {
                        setParsedProducts([]);
                        setFileName('');
                        if (fileInputRef.current) fileInputRef.current.value = '';
                      }}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                    >
                      Changer de fichier
                    </button>
                    <button
                      onClick={handleImport}
                      disabled={isProcessing}
                      className="px-6 py-2 bg-[#009689] text-white rounded-lg hover:bg-[#00786F] disabled:opacity-50 flex items-center gap-2"
                      data-testid="confirm-import-btn"
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Importation...
                        </>
                      ) : (
                        <>Importer {parsedProducts.length} produit(s)</>
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Upload className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="mb-2 text-gray-900">
                    Glissez-déposez votre fichier Excel ici
                  </p>
                  <p className="text-sm text-gray-600 mb-4">ou</p>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    data-testid="browse-files-btn"
                  >
                    Parcourir les fichiers
                  </button>
                  <p className="text-xs text-gray-500 mt-4">
                    Formats acceptés: .xlsx, .xls (Max 10MB)
                  </p>
                </>
              )}
            </div>
          )}

          {/* Import Results */}
          {importResult && (
            <div className="text-center py-6">
              {importResult.success > 0 ? (
                <>
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <p className="text-gray-900 font-medium mb-2">
                    Importation terminée !
                  </p>
                  <p className="text-green-600 mb-2">
                    {importResult.success} produit(s) importé(s) avec succès
                  </p>
                  {importResult.failed > 0 && (
                    <p className="text-red-600 text-sm">
                      {importResult.failed} produit(s) n'ont pas pu être importés
                    </p>
                  )}
                </>
              ) : (
                <>
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertCircle className="w-8 h-8 text-red-600" />
                  </div>
                  <p className="text-gray-900 font-medium mb-2">
                    Échec de l'importation
                  </p>
                  {importResult.errors.length > 0 && (
                    <div className="mt-4 text-left max-h-40 overflow-y-auto bg-red-50 p-3 rounded-lg">
                      {importResult.errors.map((error, index) => (
                        <p key={index} className="text-sm text-red-700">{error}</p>
                      ))}
                    </div>
                  )}
                </>
              )}
              
              <button
                onClick={onClose}
                className="mt-6 px-6 py-2 bg-[#009689] text-white rounded-lg hover:bg-[#00786F]"
              >
                Fermer
              </button>
            </div>
          )}

          {/* Instructions */}
          {!importResult && parsedProducts.length === 0 && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h4 className="mb-3 text-gray-900 font-medium">Instructions:</h4>
              <ol className="space-y-2 text-sm text-gray-600">
                <li className="flex gap-2">
                  <span className="text-blue-600 font-medium">1.</span>
                  <span>Téléchargez le modèle Excel fourni</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-blue-600 font-medium">2.</span>
                  <span>Remplissez les colonnes: Nom Commercial, Référence, DCI, Type Produit, Date Expiration, Prix (DZD), UG (%), Disponible</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-blue-600 font-medium">3.</span>
                  <span>Sauvegardez et importez le fichier</span>
                </li>
              </ol>
            </div>
          )}

          {/* Preview Table */}
          {parsedProducts.length > 0 && !importResult && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h4 className="mb-3 text-gray-900 font-medium">Aperçu des produits à importer:</h4>
              <div className="overflow-x-auto max-h-60 border rounded-lg">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Nom</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Réf</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">DCI</th>
                      <th className="px-3 py-2 text-right text-xs font-medium text-gray-500">Prix</th>
                      <th className="px-3 py-2 text-center text-xs font-medium text-gray-500">Dispo</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {parsedProducts.slice(0, 10).map((product, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-3 py-2 text-gray-900">{product.name}</td>
                        <td className="px-3 py-2 text-gray-600">{product.reference}</td>
                        <td className="px-3 py-2 text-gray-600">{product.dci}</td>
                        <td className="px-3 py-2 text-right text-gray-900">{product.price} DZD</td>
                        <td className="px-3 py-2 text-center">
                          {product.available ? (
                            <span className="text-green-600">✓</span>
                          ) : (
                            <span className="text-red-600">✗</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {parsedProducts.length > 10 && (
                  <p className="p-2 text-center text-sm text-gray-500 bg-gray-50">
                    ... et {parsedProducts.length - 10} autres produits
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}