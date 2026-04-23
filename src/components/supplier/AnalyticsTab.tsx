import { useState, useEffect } from 'react';
import { Star, TrendingUp, Users, Package, ShoppingCart, Loader2 } from 'lucide-react';
import { suppliersApi } from '../../lib/api';

interface Stats {
  total_products: number;
  available_products: number;
  total_agents: number;
  active_agents: number;
  total_orders: number;
  pending_orders: number;
  total_reviews: number;
  average_rating: number;
  total_revenue: number;
}

interface Review {
  id: string;
  rating: number;
  title: string | null;
  comment: string | null;
  created_at: string;
  pharmacy?: {
    pharmacy_name: string;
  };
}

export function AnalyticsTab() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [statsData, reviewsData] = await Promise.all([
        suppliersApi.getStats(),
        suppliersApi.getReviews(),
      ]);
      setStats(statsData);
      setReviews(reviewsData);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
      </div>
    );
  }

  // Calculate rating distribution
  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: reviews.filter(r => r.rating === rating).length,
    percentage: reviews.length > 0 
      ? (reviews.filter(r => r.rating === rating).length / reviews.length) * 100 
      : 0,
  }));

  return (
    <div>
      <h2 className="mb-6 text-xl sm:text-2xl text-gray-900">Statistiques et Avis</h2>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm sm:text-base text-gray-600">Note moyenne</p>
            <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />
          </div>
          <p className="text-2xl sm:text-3xl text-gray-900">{stats?.average_rating || 0}</p>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">Sur {stats?.total_reviews || 0} avis</p>
        </div>

        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm sm:text-base text-gray-600">Produits</p>
            <Package className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
          </div>
          <p className="text-2xl sm:text-3xl text-gray-900">{stats?.total_products || 0}</p>
          <p className="text-xs sm:text-sm text-green-600 mt-1">{stats?.available_products || 0} disponibles</p>
        </div>

        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm sm:text-base text-gray-600">Commandes</p>
            <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
          </div>
          <p className="text-2xl sm:text-3xl text-gray-900">{stats?.total_orders || 0}</p>
          <p className="text-xs sm:text-sm text-orange-600 mt-1">{stats?.pending_orders || 0} en attente</p>
        </div>

        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm sm:text-base text-gray-600">Chiffre d'affaires</p>
            <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500" />
          </div>
          <p className="text-2xl sm:text-3xl text-gray-900">
            {(stats?.total_revenue || 0).toLocaleString('fr-DZ')}
          </p>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">DZD</p>
        </div>
      </div>

      {/* Rating Distribution */}
      <div className="bg-white rounded-lg shadow p-4 sm:p-6 mb-6 sm:mb-8">
        <h3 className="mb-4 sm:mb-6 text-lg sm:text-xl text-gray-900">Distribution des notes</h3>
        {reviews.length > 0 ? (
          <div className="space-y-3">
            {ratingDistribution.map(({ rating, count, percentage }) => (
              <div key={rating} className="flex items-center gap-2 sm:gap-4">
                <div className="flex items-center gap-1 w-16 sm:w-20">
                  <span className="text-xs sm:text-sm text-gray-700">{rating}</span>
                  <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500 fill-yellow-500" />
                </div>
                <div className="flex-1 bg-gray-200 rounded-full h-2 sm:h-3">
                  <div
                    className="bg-yellow-500 h-2 sm:h-3 rounded-full transition-all"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <span className="text-xs sm:text-sm text-gray-600 w-8 sm:w-12 text-right">
                  {count}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">Aucun avis pour le moment</p>
        )}
      </div>

      {/* Recent Reviews */}
      <div className="bg-white rounded-lg shadow p-4 sm:p-6">
        <h3 className="mb-4 sm:mb-6 text-lg sm:text-xl text-gray-900">Avis récents</h3>
        {reviews.length > 0 ? (
          <div className="space-y-4">
            {reviews.slice(0, 10).map((review) => (
              <div key={review.id} className="border-b border-gray-200 pb-4 last:border-0">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
                  <div className="flex-1">
                    <p className="text-sm sm:text-base text-gray-900">
                      {review.pharmacy?.pharmacy_name || 'Pharmacie anonyme'}
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 sm:w-4 sm:h-4 ${
                            i < review.rating
                              ? 'text-yellow-500 fill-yellow-500'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <span className="text-xs sm:text-sm text-gray-500">
                    {new Date(review.created_at).toLocaleDateString('fr-FR')}
                  </span>
                </div>
                {review.title && (
                  <p className="text-sm font-medium text-gray-800 mb-1">{review.title}</p>
                )}
                {review.comment && (
                  <p className="text-xs sm:text-sm text-gray-600">{review.comment}</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">Aucun avis pour le moment</p>
        )}
      </div>
    </div>
  );
}
