"use client";

import { useState, useEffect } from "react";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Plus, Edit2, Trash2, X, Image as ImageIcon } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminMoviesPage() {
  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    originalTitle: "",
    genre: "",
    duration: "",
    director: "",
    rating: "",
    ageRestriction: "",
    posterUrl: "",
    bannerUrl: "",
    synopsis: "",
    trailerId: ""
  });

  const extractYoutubeId = (url: string) => {
    if (!url) return "";
    // Xử lý các dạng link: https://www.youtube.com/watch?v=XYZ, https://youtu.be/XYZ, hoặc chỉ truyền ID "XYZ"
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : url;
  };

  const fetchMovies = async () => {
    setLoading(true);
    const snap = await getDocs(collection(db, "movies"));
    const list: any[] = [];
    snap.forEach((doc) => list.push({ id: doc.id, ...doc.data() }));
    setMovies(list);
    setLoading(false);
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  const handleOpenModal = (movie: any = null) => {
    if (movie) {
      setEditingId(movie.id);
      setFormData({ ...movie, trailerId: movie.trailerId || "" });
    } else {
      setEditingId(null);
      setFormData({
        title: "", originalTitle: "", genre: "", duration: "",
        director: "", rating: "", ageRestriction: "", posterUrl: "", bannerUrl: "", synopsis: "", trailerId: ""
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const loadingToast = toast.loading("Đang lưu thông tin phim...");
    try {
      const processedData = {
        ...formData,
        trailerId: extractYoutubeId(formData.trailerId)
      };

      if (editingId) {
        await updateDoc(doc(db, "movies", editingId), processedData);
        toast.success("Cập nhật phim thành công!");
      } else {
        await addDoc(collection(db, "movies"), processedData);
        toast.success("Đã thêm phim mới!");
      }
      setIsModalOpen(false);
      fetchMovies();
    } catch (error) {
      console.error("Lỗi khi lưu phim:", error);
      toast.error("Có lỗi xảy ra khi lưu phim!");
    } finally {
      toast.dismiss(loadingToast);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("CẢNH BÁO: Bạn có chắc chắn muốn xóa bộ phim này khỏi hệ thống?")) {
      const loadingToast = toast.loading("Đang xóa phim...");
      try {
        await deleteDoc(doc(db, "movies", id));
        toast.success("Đã xóa phim khỏi hệ thống.");
        fetchMovies();
      } catch (error) {
        console.error("Lỗi khi xóa:", error);
        toast.error("Không thể xóa phim này.");
      } finally {
        toast.dismiss(loadingToast);
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white uppercase tracking-widest text-glow mb-2">Quản lý Phim</h1>
          <p className="text-gray-400">Điều khiển danh sách phim đang chiếu trên hệ thống</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-primary hover:bg-primary-glow text-white px-4 py-2 rounded flex items-center gap-2 font-bold uppercase text-sm tracking-wider box-glow transition-all"
        >
          <Plus className="w-5 h-5" /> Thêm Phim Mới
        </button>
      </div>

      {loading ? (
        <div className="text-primary animate-pulse font-mono">Đang truy xuất dữ liệu...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {movies.map((movie) => (
            <div key={movie.id} className="bg-surface border border-surface-border rounded-lg overflow-hidden group">
              <div className="h-48 relative overflow-hidden bg-gray-900 flex items-center justify-center">
                {movie.bannerUrl ? (
                  <img src={movie.bannerUrl} alt={movie.title} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                ) : (
                  <ImageIcon className="w-10 h-10 text-gray-600" />
                )}
                <div className="absolute top-2 right-2 flex gap-2">
                  <button onClick={() => handleOpenModal(movie)} className="p-2 bg-blue-500/80 text-white rounded hover:bg-blue-500 backdrop-blur-sm transition-colors">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(movie.id)} className="p-2 bg-red-500/80 text-white rounded hover:bg-red-500 backdrop-blur-sm transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-white text-lg truncate pr-2">{movie.title}</h3>
                  <span className="px-2 py-1 bg-surface-border text-xs rounded text-gray-300 shrink-0">{movie.ageRestriction}</span>
                </div>
                <div className="text-sm text-gray-400 mb-4">{movie.genre} • {movie.duration}</div>
                <div className="flex items-center justify-between text-xs font-mono text-gray-500">
                  <span>ID: {movie.id.substring(0,6)}...</span>
                  <span className="text-primary font-bold">★ {movie.rating}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Thêm/Sửa */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-surface border border-surface-border w-full max-w-3xl rounded-lg shadow-2xl flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-6 border-b border-surface-border">
              <h2 className="text-xl font-bold text-white uppercase text-glow">
                {editingId ? "Cập nhật thông tin phim" : "Thêm phim mới"}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
              <form id="movieForm" onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs text-gray-400 uppercase font-bold mb-1">Tên phim (Tiếng Việt)</label>
                    <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-background border border-surface-border text-white p-2.5 rounded focus:border-primary outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 uppercase font-bold mb-1">Tên gốc (Tiếng Anh)</label>
                    <input type="text" value={formData.originalTitle} onChange={e => setFormData({...formData, originalTitle: e.target.value})} className="w-full bg-background border border-surface-border text-white p-2.5 rounded focus:border-primary outline-none" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-400 uppercase font-bold mb-1">Thể loại</label>
                      <input required type="text" value={formData.genre} onChange={e => setFormData({...formData, genre: e.target.value})} className="w-full bg-background border border-surface-border text-white p-2.5 rounded focus:border-primary outline-none" placeholder="Sci-Fi / Action" />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 uppercase font-bold mb-1">Thời lượng</label>
                      <input required type="text" value={formData.duration} onChange={e => setFormData({...formData, duration: e.target.value})} className="w-full bg-background border border-surface-border text-white p-2.5 rounded focus:border-primary outline-none" placeholder="120 phút" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 uppercase font-bold mb-1">Đạo diễn</label>
                    <input type="text" value={formData.director} onChange={e => setFormData({...formData, director: e.target.value})} className="w-full bg-background border border-surface-border text-white p-2.5 rounded focus:border-primary outline-none" />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-400 uppercase font-bold mb-1">Điểm IMDb</label>
                      <input type="text" value={formData.rating} onChange={e => setFormData({...formData, rating: e.target.value})} className="w-full bg-background border border-surface-border text-white p-2.5 rounded focus:border-primary outline-none" placeholder="8.5" />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 uppercase font-bold mb-1">Độ tuổi</label>
                      <select value={formData.ageRestriction} onChange={e => setFormData({...formData, ageRestriction: e.target.value})} className="w-full bg-background border border-surface-border text-white p-2.5 rounded focus:border-primary outline-none">
                        <option value="">Chọn...</option>
                        <option value="P">P (Mọi lứa tuổi)</option>
                        <option value="T13">T13 (13+)</option>
                        <option value="T16">T16 (16+)</option>
                        <option value="T18">T18 (18+)</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 uppercase font-bold mb-1">Link Ảnh Poster dọc</label>
                    <input required type="text" value={formData.posterUrl} onChange={e => setFormData({...formData, posterUrl: e.target.value})} className="w-full bg-background border border-surface-border text-white p-2.5 rounded focus:border-primary outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 uppercase font-bold mb-1">Link Ảnh Banner ngang</label>
                    <input required type="text" value={formData.bannerUrl} onChange={e => setFormData({...formData, bannerUrl: e.target.value})} className="w-full bg-background border border-surface-border text-white p-2.5 rounded focus:border-primary outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 uppercase font-bold mb-1">Link Youtube Trailer</label>
                    <input type="text" value={formData.trailerId} onChange={e => setFormData({...formData, trailerId: e.target.value})} className="w-full bg-background border border-surface-border text-white p-2.5 rounded focus:border-primary outline-none" placeholder="Nhập Link hoặc ID video (Vd: dQw4w9WgXcQ)" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 uppercase font-bold mb-1">Tóm tắt nội dung</label>
                    <textarea rows={3} value={formData.synopsis} onChange={e => setFormData({...formData, synopsis: e.target.value})} className="w-full bg-background border border-surface-border text-white p-2.5 rounded focus:border-primary outline-none resize-none" />
                  </div>
                </div>
              </form>
            </div>
            
            <div className="p-6 border-t border-surface-border bg-background flex justify-end gap-4 rounded-b-lg">
              <button onClick={() => setIsModalOpen(false)} className="px-6 py-2 text-white bg-surface border border-surface-border hover:bg-white/5 rounded font-bold uppercase text-sm tracking-wider transition-colors">
                Hủy
              </button>
              <button form="movieForm" type="submit" className="px-6 py-2 bg-primary text-white hover:bg-primary-glow box-glow rounded font-bold uppercase text-sm tracking-wider transition-all">
                {editingId ? "Cập nhật" : "Lưu Phim"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
