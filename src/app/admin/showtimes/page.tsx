"use client";

import React, { useState, useEffect } from "react";
import { collection, getDocs, addDoc, deleteDoc, doc, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Plus, Trash2, X, CalendarDays, Clock, MapPin, Film } from "lucide-react";
import toast from "react-hot-toast";

const MOCK_THEATERS = [
  "CYBERPLEX DOWNTOWN",
  "CYBERPLEX MEGA MALL",
  "CYBERPLEX GALAXY"
];

const MOCK_FORMATS = ["2D Phụ đề", "3D Lồng tiếng", "IMAX 3D"];

export default function AdminShowtimesPage() {
  const [showtimes, setShowtimes] = useState<any[]>([]);
  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    movieId: "",
    theaterName: MOCK_THEATERS[0],
    format: MOCK_FORMATS[0],
    address: "Tầng 5, TTTM Cyber, Quận 1",
    date: "",
    time: ""
  });

  const fetchData = async () => {
    setLoading(true);
    // Lấy danh sách phim để làm dropdown
    const moviesSnap = await getDocs(collection(db, "movies"));
    const moviesList: any[] = [];
    moviesSnap.forEach((d) => moviesList.push({ id: d.id, ...d.data() }));
    setMovies(moviesList);

    // Lấy danh sách lịch chiếu
    const stSnap = await getDocs(collection(db, "showtimes"));
    const stList: any[] = [];
    stSnap.forEach((d) => {
      const data = d.data();
      const movie = moviesList.find(m => m.id === data.movieId);
      stList.push({ id: d.id, movieTitle: movie?.title || "Không rõ phim", ...data });
    });
    
    // Sắp xếp tạm thời bằng JS
    stList.sort((a, b) => {
       const dateA = a.date + " " + a.time;
       const dateB = b.date + " " + b.time;
       return dateA.localeCompare(dateB);
    });
    
    setShowtimes(stList);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenModal = () => {
    if (movies.length > 0) {
      setFormData({ ...formData, movieId: movies[0].id });
    }
    
    // Auto set date for convenience
    const today = new Date();
    const formattedDate = `${today.getDate().toString().padStart(2, '0')}/${(today.getMonth() + 1).toString().padStart(2, '0')}`;
    setFormData(prev => ({ ...prev, date: formattedDate, time: "19:00" }));
    
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const loadingToast = toast.loading("Đang tạo suất chiếu mới...");
    try {
      const newShowtime = {
        ...formData,
        bookedSeats: [] // Khởi tạo sơ đồ ghế trống
      };
      
      await addDoc(collection(db, "showtimes"), newShowtime);
      toast.success("Tạo suất chiếu thành công!");
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      console.error("Lỗi khi thêm suất chiếu:", error);
      toast.error("Có lỗi xảy ra!");
    } finally {
      toast.dismiss(loadingToast);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("CẢNH BÁO: Bạn có muốn xóa suất chiếu này? Nếu đã có khách đặt vé, dữ liệu vé của khách vẫn tồn tại nhưng không thể mở sơ đồ ghế được nữa.")) {
      const loadingToast = toast.loading("Đang xóa suất chiếu...");
      try {
        await deleteDoc(doc(db, "showtimes", id));
        toast.success("Đã xóa suất chiếu.");
        fetchData();
      } catch (error) {
        console.error("Lỗi khi xóa:", error);
        toast.error("Không thể xóa suất chiếu.");
      } finally {
        toast.dismiss(loadingToast);
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white uppercase tracking-widest text-glow mb-2">Lịch Chiếu</h1>
          <p className="text-gray-400">Thiết lập các suất chiếu và khởi tạo sơ đồ ghế trống</p>
        </div>
        <button 
          onClick={handleOpenModal}
          className="bg-primary hover:bg-primary-glow text-white px-4 py-2 rounded flex items-center gap-2 font-bold uppercase text-sm tracking-wider box-glow transition-all"
        >
          <Plus className="w-5 h-5" /> Thêm Suất Chiếu
        </button>
      </div>

      {loading ? (
        <div className="text-primary animate-pulse font-mono">Đang truy xuất dữ liệu...</div>
      ) : (
        <div className="bg-surface border border-surface-border rounded-lg p-6 overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-surface-border text-gray-500 text-xs uppercase tracking-widest">
                <th className="pb-3 font-bold">Phim</th>
                <th className="pb-3 font-bold">Cụm Rạp</th>
                <th className="pb-3 font-bold">Định dạng</th>
                <th className="pb-3 font-bold">Ngày giờ</th>
                <th className="pb-3 font-bold text-center">Ghế đã đặt</th>
                <th className="pb-3 font-bold text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {showtimes.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-500">Chưa có suất chiếu nào</td>
                </tr>
              ) : (
                (() => {
                  const grouped = showtimes.reduce((acc: any, st: any) => {
                    if (!acc[st.theaterName]) acc[st.theaterName] = [];
                    acc[st.theaterName].push(st);
                    return acc;
                  }, {});

                  return Object.keys(grouped).map(theater => (
                    <React.Fragment key={theater}>
                      <tr className="bg-surface-border/30">
                        <td colSpan={6} className="py-3 px-4 font-bold text-primary uppercase tracking-widest flex items-center gap-2">
                          <MapPin className="w-5 h-5" /> {theater}
                        </td>
                      </tr>
                      {grouped[theater].map((st: any) => (
                        <tr key={st.id} className="border-b border-surface-border/50 hover:bg-white/5 transition-colors">
                          <td className="py-4 px-4 text-sm text-white font-medium flex items-center gap-2">
                            <Film className="w-4 h-4 text-gray-500" /> {st.movieTitle}
                          </td>
                          <td className="py-4 px-4 text-sm text-gray-400">
                            {st.theaterName}
                          </td>
                          <td className="py-4 px-4 text-sm text-gray-300">{st.format}</td>
                          <td className="py-4 px-4 text-sm text-white font-bold">
                            {st.date} <span className="text-primary ml-2">{st.time}</span>
                          </td>
                          <td className="py-4 px-4 text-sm text-center">
                            <span className="px-2 py-1 bg-surface-border rounded text-xs font-mono">{st.bookedSeats?.length || 0} / 120</span>
                          </td>
                          <td className="py-4 px-4 text-right">
                            <button onClick={() => handleDelete(st.id)} className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded transition-colors" title="Xóa suất chiếu">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </React.Fragment>
                  ));
                })()
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Thêm */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-surface border border-surface-border w-full max-w-lg rounded-lg shadow-2xl flex flex-col">
            <div className="flex justify-between items-center p-6 border-b border-surface-border">
              <h2 className="text-xl font-bold text-white uppercase text-glow">Tạo suất chiếu mới</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6">
              <form id="stForm" onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="block text-xs text-gray-400 uppercase font-bold mb-1">Chọn Phim</label>
                  <select required value={formData.movieId} onChange={e => setFormData({...formData, movieId: e.target.value})} className="w-full bg-background border border-surface-border text-white p-2.5 rounded focus:border-primary outline-none">
                    {movies.map(m => (
                      <option key={m.id} value={m.id}>{m.title}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-xs text-gray-400 uppercase font-bold mb-1">Cụm Rạp</label>
                  <select required value={formData.theaterName} onChange={e => setFormData({...formData, theaterName: e.target.value})} className="w-full bg-background border border-surface-border text-white p-2.5 rounded focus:border-primary outline-none">
                    {MOCK_THEATERS.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-gray-400 uppercase font-bold mb-1">Định dạng</label>
                  <select required value={formData.format} onChange={e => setFormData({...formData, format: e.target.value})} className="w-full bg-background border border-surface-border text-white p-2.5 rounded focus:border-primary outline-none">
                    {MOCK_FORMATS.map(f => <option key={f} value={f}>{f}</option>)}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-400 uppercase font-bold mb-1">Ngày (DD/MM)</label>
                    <div className="relative">
                      <CalendarDays className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
                      <input required type="text" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full bg-background border border-surface-border text-white p-2.5 pl-10 rounded focus:border-primary outline-none" placeholder="30/08" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 uppercase font-bold mb-1">Giờ (HH:MM)</label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
                      <input required type="time" value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} className="w-full bg-background border border-surface-border text-white p-2.5 pl-10 rounded focus:border-primary outline-none custom-time-input" />
                    </div>
                  </div>
                </div>
                
                <div className="bg-primary/10 border border-primary/30 p-3 rounded mt-4 text-sm text-gray-300">
                  <span className="text-primary font-bold">Lưu ý:</span> Khi lưu thành công, hệ thống sẽ tự động khởi tạo sơ đồ 120 ghế trống cho suất chiếu này.
                </div>
              </form>
            </div>
            
            <div className="p-6 border-t border-surface-border bg-background flex justify-end gap-4 rounded-b-lg">
              <button onClick={() => setIsModalOpen(false)} className="px-6 py-2 text-white bg-surface border border-surface-border hover:bg-white/5 rounded font-bold uppercase text-sm tracking-wider transition-colors">
                Hủy
              </button>
              <button form="stForm" type="submit" className="px-6 py-2 bg-primary text-white hover:bg-primary-glow box-glow rounded font-bold uppercase text-sm tracking-wider transition-all flex items-center gap-2">
                <Plus className="w-4 h-4" /> Khởi tạo
              </button>
            </div>
          </div>
        </div>
      )}
      
      <style dangerouslySetInnerHTML={{__html: `
        /* Làm cho input time hiển thị icon đồng hồ màu trắng trên Chrome */
        .custom-time-input::-webkit-calendar-picker-indicator {
          filter: invert(1);
          cursor: pointer;
        }
      `}} />
    </div>
  );
}
