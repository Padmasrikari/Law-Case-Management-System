import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/Layout';
import api from '../../utils/api';
import { LayoutDashboard, Search, FileText, Star, MapPin, Briefcase, Shield, ChevronRight, Filter } from 'lucide-react';

const links = [
  { to: '/client', label: 'Dashboard', Icon: LayoutDashboard },
  { to: '/client/lawyers', label: 'Find Lawyers', Icon: Search },
  { to: '/client/cases', label: 'My Cases', Icon: FileText },
];

const specializations = ['All','Criminal Law','Civil Law','Family Law','Corporate Law','Real Estate Law','Immigration Law','Intellectual Property','Tax Law','Labor Law'];

export default function LawyersList() {
  const [lawyers, setLawyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [specialization, setSpecialization] = useState('All');
  const [minRating, setMinRating] = useState('');

  const fetchLawyers = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (specialization !== 'All') params.specialization = specialization;
      if (minRating) params.minRating = minRating;
      const { data } = await api.get('/lawyers', { params });
      setLawyers(data.lawyers || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchLawyers(); }, [specialization, minRating]);

  const renderStars = (rating) => Array.from({ length: 5 }).map((_, i) => (
    <Star key={i} className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`} />
  ));

  return (
    <Layout links={links} title="Find Lawyers">
      <div className="mb-6 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
          <input placeholder="Search by name or specialization..." value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && fetchLawyers()}
            className="input-field pl-10" />
        </div>
        <select value={specialization} onChange={e => setSpecialization(e.target.value)} className="input-field w-auto min-w-40">
          {specializations.map(s => <option key={s}>{s}</option>)}
        </select>
        <select value={minRating} onChange={e => setMinRating(e.target.value)} className="input-field w-auto">
          <option value="">All Ratings</option>
          <option value="4">4+ Stars</option>
          <option value="3">3+ Stars</option>
        </select>
        <button onClick={fetchLawyers} className="btn-primary whitespace-nowrap"><Filter className="w-4 h-4" />Search</button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent"></div></div>
      ) : lawyers.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <Search className="w-16 h-16 mx-auto mb-4 opacity-30" />
          <p className="text-xl font-semibold">No lawyers found</p>
          <p className="mt-2">Try adjusting your filters</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
          {lawyers.map(({ _id, userId, specialization, experience, rating, totalReviews, consultationFee, location, isVerified }) => (
            <div key={_id} className="card p-6 hover:shadow-md transition-all duration-300 group aspect-square flex flex-col justify-between">
              <div>
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                    {userId?.name?.charAt(0) || '?'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-gray-900">{userId?.name || 'Lawyer'}</h3>
                      {isVerified && <span className="badge-verified"><Shield className="w-3 h-3" />Verified</span>}
                    </div>
                    <p className="text-primary-600 text-sm font-medium">{specialization}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1 mb-3">
                  {renderStars(rating)}
                  <span className="text-sm text-gray-600 ml-1">{rating?.toFixed(1) || '0.0'} ({totalReviews || 0})</span>
                </div>

                <div className="space-y-1.5 mb-5">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Briefcase className="w-4 h-4 text-gray-400" /> {experience} years experience
                  </div>
                  {location && <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4 text-gray-400" /> {location}
                  </div>}
                  {consultationFee > 0 && <p className="text-sm font-semibold text-gray-700">₹{consultationFee} / consultation</p>}
                </div>
              </div>

              <div className="flex gap-2">
                <Link to={`/client/lawyers/${userId?._id}`} className="flex-1 py-2 text-center border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all">
                  View Profile
                </Link>
                <Link to={`/client/book/${userId?._id}`} className="flex-1 py-2 text-center bg-primary-600 rounded-xl text-sm font-medium text-white hover:bg-primary-700 transition-all">
                  Book Now
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
}
