import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Layout from '../../components/Layout';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { LayoutDashboard, Search, FileText, Star, MapPin, Briefcase, Shield, Calendar, Send } from 'lucide-react';

const links = [
  { to: '/client', label: 'Dashboard', Icon: LayoutDashboard },
  { to: '/client/lawyers', label: 'Find Lawyers', Icon: Search },
  { to: '/client/cases', label: 'My Cases', Icon: FileText },
];

export default function LawyerProfile() {
  const { id } = useParams();
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [review, setReview] = useState({ rating: 5, comment: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.get(`/lawyers/${id}`).then(r => setData(r.data)).finally(() => setLoading(false));
  }, [id]);

  const submitReview = async () => {
    setSubmitting(true);
    try {
      await api.post('/reviews', { lawyerId: id, ...review });
      toast.success('Review submitted!');
      const updated = await api.get(`/lawyers/${id}`);
      setData(updated.data);
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to submit review'); }
    finally { setSubmitting(false); }
  };

  const renderStars = (rating, interactive = false, onChange) => Array.from({ length: 5 }).map((_, i) => (
    <Star key={i}
      onClick={() => interactive && onChange && onChange(i + 1)}
      className={`w-5 h-5 ${i < rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'} ${interactive ? 'cursor-pointer hover:text-amber-400' : ''}`} />
  ));

  if (loading) return <Layout links={links} title="Lawyer Profile"><div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent"></div></div></Layout>;
  if (!data) return <Layout links={links} title="Not Found"><p>Lawyer not found</p></Layout>;

  const { profile, reviews } = data;

  return (
    <Layout links={links} title="Lawyer Profile">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="card p-8 mb-6">
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-primary-700 rounded-3xl flex items-center justify-center text-white font-bold text-4xl flex-shrink-0">
              {profile.userId?.name?.charAt(0)}
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h1 className="font-display text-3xl font-bold text-gray-900">{profile.userId?.name}</h1>
                {profile.isVerified && <span className="badge-verified text-sm"><Shield className="w-4 h-4" />Verified</span>}
              </div>
              <p className="text-primary-600 font-semibold text-lg mb-3">{profile.specialization}</p>
              <div className="flex flex-wrap gap-4 text-gray-600 text-sm mb-4">
                <span className="flex items-center gap-1"><Briefcase className="w-4 h-4" />{profile.experience} years exp.</span>
                {profile.location && <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{profile.location}</span>}
                <span className="flex items-center gap-1">{renderStars(profile.rating)} {profile.rating?.toFixed(1)} ({profile.totalReviews} reviews)</span>
              </div>
              {profile.bio && <p className="text-gray-600 text-sm leading-relaxed">{profile.bio}</p>}
            </div>
            <div className="text-center sm:text-right">
              {profile.consultationFee > 0 && <p className="text-2xl font-bold text-gray-900">₹{profile.consultationFee}</p>}
              <p className="text-gray-500 text-sm mb-4">per consultation</p>
              <Link to={`/client/book/${id}`} className="btn-primary inline-flex justify-center">
                <Calendar className="w-4 h-4" /> Book Now
              </Link>
            </div>
          </div>
        </div>

        {/* Time Slots */}
        {profile.timeSlots?.length > 0 && (
          <div className="card p-6 mb-6">
            <h2 className="font-display text-xl font-bold text-gray-900 mb-4">Available Time Slots</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {profile.timeSlots.filter(s => s.isAvailable).map((slot, i) => (
                <div key={i} className="border border-gray-200 rounded-xl p-3 text-sm">
                  <p className="font-semibold text-gray-800">{slot.day}</p>
                  <p className="text-gray-500">{slot.startTime} – {slot.endTime}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reviews */}
        <div className="card p-6 mb-6">
          <h2 className="font-display text-xl font-bold text-gray-900 mb-5">Client Reviews</h2>
          {reviews?.length === 0 ? (
            <p className="text-gray-400 text-center py-8">No reviews yet. Be the first!</p>
          ) : (
            <div className="space-y-4 mb-6">
              {reviews.map(r => (
                <div key={r._id} className="border-b border-gray-100 pb-4 last:border-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center font-bold text-sm">{r.clientId?.name?.charAt(0)}</div>
                      <span className="font-medium text-sm">{r.clientId?.name}</span>
                    </div>
                    <div className="flex">{renderStars(r.rating)}</div>
                  </div>
                  {r.comment && <p className="text-gray-600 text-sm pl-10">{r.comment}</p>}
                </div>
              ))}
            </div>
          )}

          {/* Add Review */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="font-semibold text-gray-800 mb-3">Write a Review</h3>
            <div className="flex gap-1 mb-3">{renderStars(review.rating, true, (r) => setReview({...review, rating: r}))}</div>
            <textarea value={review.comment} onChange={e => setReview({...review, comment: e.target.value})}
              placeholder="Share your experience..." className="input-field resize-none mb-3" rows={3} />
            <button onClick={submitReview} disabled={submitting} className="btn-primary">
              <Send className="w-4 h-4" /> {submitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
