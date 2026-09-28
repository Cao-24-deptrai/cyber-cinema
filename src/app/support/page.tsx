"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  HelpCircle, 
  Phone, 
  Mail, 
  MessageSquare, 
  ChevronDown, 
  ChevronUp, 
  Send, 
  Sparkles, 
  Clock, 
  MapPin, 
  CheckCircle2,
  FileQuestion,
  Headphones
} from "lucide-react";
import toast from "react-hot-toast";

export default function SupportPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    category: "ticket",
    message: ""
  });
  const [submitting, setSubmitting] = useState(false);

  const faqs = [
    {
      q: "Làm thế nào để tôi nhận vé xem phim sau khi đặt thành công?",
      a: "Sau khi hoàn tất thanh toán, hệ thống sẽ tự động gửi email xác nhận kèm Mã Vé QR điện tử về địa chỉ email của bạn. Bạn cũng có thể truy cập vào mục 'Vé Đã Mua' trong Hồ sơ cá nhân trên website để xem lại toàn bộ vé xem phim của mình bất kỳ lúc nào."
    },
    {
      q: "Tôi có bắt buộc phải in vé giấy khi đến rạp không?",
      a: "Hoàn toàn KHÔNG cần in vé giấy! CyberPlex áp dụng công nghệ soát vé tự động bằng mã QR. Bạn chỉ cần mở mã QR trên điện thoại di động và đưa vào camera tại cổng soát vé là có thể bước thẳng vào phòng chiếu trong 1 giây."
    },
    {
      q: "Tôi có thể đổi hoặc hủy vé đã mua không?",
      a: "Theo quy chuẩn chung của ngành điện ảnh, vé xem phim đã thanh toán thành công KHÔNG THỂ HỦY hoặc ĐỔI sang suất chiếu khác vì lý do cá nhân. Chỉ trong trường hợp suất chiếu bị hủy do sự cố kỹ thuật từ phía CyberPlex, bạn sẽ được hoàn 100% tiền vé hoặc đổi vé suất chiếu khác."
    },
    {
      q: "Quy định về độ tuổi xem phim (P, T13, T16, T18) được kiểm tra như thế nào?",
      a: "Nhân viên rạp có quyền yêu cầu khán giả xuất trình giấy tờ tùy thân có ảnh và ngày sinh (CCCD, Thẻ học sinh/sinh viên, VNeID) trước khi vào phòng chiếu đối với các phim có giới hạn độ tuổi. Khán giả không đủ tuổi quy định sẽ không được phép vào xem và không được hoàn tiền vé."
    },
    {
      q: "Tôi quên mật khẩu đăng nhập thì phải làm sao?",
      a: "Tại màn hình Đăng nhập, bạn hãy nhấn vào liên kết 'Quên mật khẩu?'. Hệ thống sẽ gửi một liên kết đặt lại mật khẩu mới đến địa chỉ email đã đăng ký của bạn. Ngoài ra, bạn có thể liên hệ hotline 1900 2077 để được hỗ trợ xác thực tài khoản."
    },
    {
      q: "Tôi có được tích điểm thành viên khi mua vé online không?",
      a: "Có! Mỗi lần đặt vé online khi đã đăng nhập tài khoản CyberPlex, hệ thống sẽ tự động tích điểm thưởng thành viên tương ứng 5% - 10% giá trị đơn hàng. Điểm thưởng này có thể được dùng để đổi vé xem phim miễn phí hoặc combo bắp nước."
    }
  ];

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    // Giả lập gửi yêu cầu hỗ trợ
    await new Promise((resolve) => setTimeout(resolve, 800));

    toast.success("Yêu cầu của bạn đã được gửi thành công! Đội ngũ CSKH sẽ phản hồi trong vòng 24 giờ.");
    setFormData({
      name: "",
      email: "",
      phone: "",
      category: "ticket",
      message: ""
    });
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-background pt-24 pb-20">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* HERO HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/20 border border-primary/40 rounded-full text-xs font-bold text-primary mb-4 box-glow">
            <Headphones className="w-3.5 h-3.5" />
            <span>TRUNG TÂM TRỢ GIÚP 24/7</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black uppercase tracking-widest text-glow text-white mb-4">
            Chúng Tôi Có Thể Giúp Gì Cho Bạn?
          </h1>
          <p className="text-gray-300 text-sm md:text-base leading-relaxed">
            Tìm câu trả lời nhanh cho các vấn đề thường gặp hoặc gửi yêu cầu trực tiếp đến đội ngũ hỗ trợ kỹ thuật và chăm sóc khách hàng của CyberPlex.
          </p>
        </div>

        {/* CÁC KÊNH LIÊN HỆ NHANH */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {/* Hotline */}
          <div className="bg-surface border border-surface-border rounded-2xl p-6 text-center hover:border-primary/50 transition-all shadow-xl flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 bg-primary/20 border border-primary/40 rounded-xl flex items-center justify-center mx-auto mb-4 text-primary box-glow">
                <Phone className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white uppercase tracking-wider mb-1">
                Tổng Đài CSKH
              </h3>
              <p className="text-xs text-gray-400 mb-4">
                Hỗ trợ đặt vé, tra cứu suất chiếu & sự cố rạp
              </p>
            </div>
            <div>
              <a 
                href="tel:19002077" 
                className="text-xl font-black text-primary hover:text-white transition-colors block text-glow"
              >
                1900 2077
              </a>
              <span className="text-[11px] text-gray-500 mt-1 block">8:00 - 23:00 hàng ngày (1.000đ/phút)</span>
            </div>
          </div>

          {/* Email */}
          <div className="bg-surface border border-surface-border rounded-2xl p-6 text-center hover:border-primary/50 transition-all shadow-xl flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 bg-primary/20 border border-primary/40 rounded-xl flex items-center justify-center mx-auto mb-4 text-primary box-glow">
                <Mail className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white uppercase tracking-wider mb-1">
                Hỗ Trợ Qua Email
              </h3>
              <p className="text-xs text-gray-400 mb-4">
                Phản hồi thắc mắc, hóa đơn VAT & góp ý dịch vụ
              </p>
            </div>
            <div>
              <a 
                href="mailto:support@cyberplex.vn" 
                className="text-base font-bold text-primary hover:text-white transition-colors block"
              >
                support@cyberplex.vn
              </a>
              <span className="text-[11px] text-gray-500 mt-1 block">Phản hồi trong vòng 2 - 4 giờ làm việc</span>
            </div>
          </div>

          {/* Trực tiếp tại rạp */}
          <div className="bg-surface border border-surface-border rounded-2xl p-6 text-center hover:border-primary/50 transition-all shadow-xl flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 bg-primary/20 border border-primary/40 rounded-xl flex items-center justify-center mx-auto mb-4 text-primary box-glow">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white uppercase tracking-wider mb-1">
                Quầy Vé Tại Cụm Rạp
              </h3>
              <p className="text-xs text-gray-400 mb-4">
                Hỗ trợ trực tiếp từ đội ngũ nhân viên CyberPlex
              </p>
            </div>
            <div>
              <Link 
                href="/theaters" 
                className="text-sm font-bold text-primary hover:text-white transition-colors underline block"
              >
                Tìm cụm rạp gần nhất →
              </Link>
              <span className="text-[11px] text-gray-500 mt-1 block">Mở cửa theo giờ chiếu phim</span>
            </div>
          </div>
        </div>

        {/* 2 CỘT: FAQ (BÊN TRÁI) & FORM LIÊN HỆ (BÊN PHẢI) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">
          {/* CỘT CÂU HỎI THƯỜNG GẶP (7 COLS) */}
          <div className="lg:col-span-7 bg-surface border border-surface-border rounded-2xl p-6 sm:p-8 shadow-xl">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-surface-border">
              <FileQuestion className="w-6 h-6 text-primary" />
              <div>
                <h2 className="text-xl font-bold text-white uppercase tracking-wider">
                  Câu Hỏi Thường Gặp (FAQ)
                </h2>
                <p className="text-xs text-gray-400">Các thắc mắc phổ biến nhất của khán giả</p>
              </div>
            </div>

            <div className="space-y-3">
              {faqs.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div 
                    key={idx}
                    className="border border-surface-border rounded-xl overflow-hidden transition-all bg-background/50"
                  >
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 hover:text-primary transition-colors cursor-pointer"
                    >
                      <span className="text-sm sm:text-base font-bold text-white">
                        {faq.q}
                      </span>
                      {isOpen ? (
                        <ChevronUp className="w-5 h-5 text-primary shrink-0" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400 shrink-0" />
                      )}
                    </button>
                    {isOpen && (
                      <div className="px-4 sm:px-5 pb-5 pt-1 text-xs sm:text-sm text-gray-300 leading-relaxed border-t border-surface-border/50 animate-in fade-in duration-200">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* CỘT GỬI YÊU CẦU HỖ TRỢ (5 COLS) */}
          <div className="lg:col-span-5 bg-surface border border-surface-border rounded-2xl p-6 sm:p-8 shadow-xl">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-surface-border">
              <MessageSquare className="w-6 h-6 text-primary" />
              <div>
                <h2 className="text-xl font-bold text-white uppercase tracking-wider">
                  Gửi Yêu Cầu Hỗ Trợ
                </h2>
                <p className="text-xs text-gray-400">Chúng tôi sẽ liên hệ lại ngay</p>
              </div>
            </div>

            <form onSubmit={handleSubmitForm} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">
                  Họ và tên *
                </label>
                <input
                  required
                  type="text"
                  placeholder="Ví dụ: Nguyễn Văn A"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-background border border-surface-border text-white text-xs sm:text-sm py-2.5 px-3.5 rounded-xl focus:border-primary focus:outline-none transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">
                    Email *
                  </label>
                  <input
                    required
                    type="email"
                    placeholder="email@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-background border border-surface-border text-white text-xs sm:text-sm py-2.5 px-3.5 rounded-xl focus:border-primary focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">
                    Số điện thoại
                  </label>
                  <input
                    type="tel"
                    placeholder="0912 345 678"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-background border border-surface-border text-white text-xs sm:text-sm py-2.5 px-3.5 rounded-xl focus:border-primary focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">
                  Vấn đề cần hỗ trợ *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full bg-background border border-surface-border text-white text-xs sm:text-sm py-2.5 px-3.5 rounded-xl focus:border-primary focus:outline-none transition-colors cursor-pointer"
                >
                  <option value="ticket">Vé xem phim & Xuất mã QR</option>
                  <option value="payment">Thanh toán & Cổng điện tử</option>
                  <option value="account">Tài khoản & Điểm thành viên</option>
                  <option value="feedback">Góp ý dịch vụ & Chất lượng rạp</option>
                  <option value="other">Vấn đề khác</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">
                  Nội dung chi tiết *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Mô tả cụ thể mã đơn hàng (nếu có), rạp chiếu và vấn đề bạn đang gặp phải..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-background border border-surface-border text-white text-xs sm:text-sm p-3.5 rounded-xl focus:border-primary focus:outline-none transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 bg-primary hover:bg-primary-glow text-white font-bold rounded-xl text-xs sm:text-sm uppercase tracking-wider transition-all box-glow flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {submitting ? (
                  <span>Đang gửi thông tin...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Gửi Yêu Cầu Hỗ Trợ</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
