import React, { useState, useEffect } from "react";
import { useUser } from "~/contexts/UserContext.client";
import Loader from "./Loader.client";
import Listings from "./Listings";
import AdminLayout from "./AdminLayout.client";
import { db } from "~/firebase.client";
import { collection, getDocs, query, where } from "firebase/firestore";

interface Analytics {
  totalFungi: number;
  totalCollectors: number;
  totalImages: number;
  fungiWithDNA: number;
}

const Dashboard: React.FC = () => {
  const { user, loading } = useUser();
  const [analytics, setAnalytics] = useState<Analytics>({
    totalFungi: 0,
    totalCollectors: 0,
    totalImages: 0,
    fungiWithDNA: 0,
  });
  const [analyticsLoading, setAnalyticsLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setAnalyticsLoading(true);

      // Get total fungi count
      const fungiCollection = collection(db, "fungi");
      const fungiSnapshot = await getDocs(fungiCollection);
      const totalFungi = fungiSnapshot.size;

      // Get total collectors count
      const collectorsCollection = collection(db, "collectors");
      const collectorsSnapshot = await getDocs(collectorsCollection);
      const totalCollectors = collectorsSnapshot.size;

      // Get fungi with DNA count
      const fungiWithDNAQuery = query(fungiCollection, where("adnExtraido", "==", true));
      const fungiWithDNASnapshot = await getDocs(fungiWithDNAQuery);
      const fungiWithDNA = fungiWithDNASnapshot.size;

      // Calculate total images count
      let totalImages = 0;
      fungiSnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.images && Array.isArray(data.images)) {
          totalImages += data.images.length;
        }
      });

      setAnalytics({
        totalFungi,
        totalCollectors,
        totalImages,
        fungiWithDNA,
      });
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setAnalyticsLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Dashboard</h2>
          <p className="text-gray-600">Bienvenido, {user?.email}</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Hongos</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {analyticsLoading ? "..." : analytics.totalFungi.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Colectores</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {analyticsLoading ? "..." : analytics.totalCollectors.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Imágenes</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {analyticsLoading ? "..." : analytics.totalImages.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-orange-500 rounded-md flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Con ADN</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {analyticsLoading ? "..." : analytics.fungiWithDNA.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Listings */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Registros Recientes</h3>
          </div>
          <div className="p-6">
            <Listings />
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
