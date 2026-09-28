"use client";

import Link from "next/link";
import { 
  FileText, 
  ShieldAlert, 
  CreditCard, 
  UserCheck, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  PhoneCall,
  HelpCircle
} from "lucide-react";

export default function TermsPage() {
  const sections = [
    {
      id: "general",
      icon: FileText,
      title: "1. Giới Thiệu & Chấp Thuận Điều Khoản",
      content: `Chào mừng bạn đến với hệ thống rạp chiếu phim CyberPlex Cinemas. Bằng việc truy cập, đăng ký tài khoản, hoặc tiến hành giao dịch đặt vé trên website hoặc ứng dụng của CyberPlex, bạn xác nhận rằng mình đã đọc, hiểu rõ và đồng ý bị ràng buộc bởi các Điều khoản Sử dụng này cùng Chính sách Bảo mật của chúng tôi. Nếu bạn không đồng ý với bất kỳ điều khoản nào, vui lòng ngưng sử dụng dịch vụ.`
    },
    {
      id: "account",
      icon: UserCheck,
      title: "2. Tài Khoản & Bảo Mật",
      content: `Khách hàng có trách nhiệm cung cấp thông tin cá nhân chính xác, đầy đủ (bao gồm họ tên, số điện thoại, địa chỉ email hợp lệ). Bạn chịu trách nhiệm hoàn toàn về việc bảo mật mật khẩu và tất cả các hoạt động diễn ra dưới tài khoản của mình. Khi phát hiện tài khoản bị truy cập trái phép, bạn có nghĩa vụ thông báo ngay cho ban quản trị CyberPlex để xử lý kịp thời.`
    },
    {
      id: "booking",
      icon: CreditCard,
      title: "3. Quy Định Đặt Vé & Thanh Toán",
      content: `Giá vé được niêm yết rõ ràng bằng Việt Nam Đồng (VNĐ) và đã bao gồm thuế GTGT. Khi đặt vé trực tuyến, khách hàng thanh toán qua các cổng thanh toán điện tử được cấp phép. Giao dịch được xem là thành công khi hệ thống xuất mã vé QR và gửi email xác nhận. Quý khách vui lòng kiểm tra kỹ thông tin suất chiếu, tên phim, cụm rạp, số lượng ghế trước khi thanh toán.`
    },
    {
      id: "cancellation",
      icon: AlertTriangle,
      title: "4. Chính Sách Đổi Trả & Hủy Vé",
      content: `Theo quy chuẩn của ngành điện ảnh và hệ thống rạp tự động, vé xem phim đã thanh toán thành công KHÔNG ĐƯỢC PHÉP ĐỔI, TRẢ HOẶC HOÀN TIỀN dưới bất kỳ hình thức nào vì lý do cá nhân của khách hàng. Trong trường hợp bất khả kháng khi suất chiếu bị hủy bởi CyberPlex (do sự cố kỹ thuật, thiên tai, cúp điện diện rộng), khách hàng sẽ được hoàn 100% giá trị vé hoặc đổi sang suất chiếu tương đương.`
    },
    {
      id: "rating",
      icon: ShieldAlert,
      title: "5. Quy Định Phân Loại Độ Tuổi Khán Giả",
      content: `CyberPlex tuân thủ nghiêm ngặt Luật Điện ảnh Việt Nam về phân loại phim theo độ tuổi:
- P: Phim được phép phổ biến đến người xem ở mọi độ tuổi.
- K: Phim được phổ biến đến người xem dưới 13 tuổi với điều kiện có cha mẹ/người giám hộ đi cùng.
- T13 (13+): Phim dành cho khán giả từ đủ 13 tuổi trở lên.
- T16 (16+): Phim dành cho khán giả từ đủ 16 tuổi trở lên.
- T18 (18+): Phim dành cho khán giả từ đủ 18 tuổi trở lên.
Nhân viên soát vé có quyền yêu cầu xuất trình giấy tờ tùy thân hợp lệ (CCCD, thẻ học sinh/sinh viên) trước khi vào phòng chiếu. Trường hợp không đủ tuổi quy định, khách hàng sẽ bị từ chối vào rạp và không được hoàn tiền vé.`
    },
    {
      id: "rules",
      icon: Clock,
      title: "6. Nội Quy Trong Phòng Chiếu",
      content: `Để mang lại trải nghiệm xem phim hoàn hảo cho tất cả mọi người, khán giả vui lòng tuân thủ:
- Đến rạp đúng giờ quy định.
- Chuyển điện thoại và các thiết bị di động sang chế độ rung hoặc im lặng.
- Nghiêm cấm tuyệt đối mọi hành vi quay phim, chụp ảnh, ghi âm hoặc phát trực tiếp (livestream) nội dung phim. Vi phạm sẽ bị xử lý theo pháp luật về quyền sở hữu trí tuệ.
- Không mang thức ăn, đồ uống mua từ bên ngoài vào rạp.
- Giữ trật tự, văn minh, không gác chân lên ghế phía trước.`
    },
    {
      id: "liability",
      icon: CheckCircle2,
      title: "7. Quyền Sở Hữu Trí Tuệ & Giới Hạn Trách Nhiệm",
      content: `Tất cả hình ảnh, logo, giao diện, âm thanh, video trailer và văn bản trên nền tảng CyberPlex đều thuộc quyền sở hữu của CyberPlex Cinemas hoặc các đối tác phát hành phim. Mọi hành vi sao chép, chỉnh sửa hoặc tái sử dụng vì mục đích thương mại khi chưa có sự đồng ý bằng văn bản đều là vi phạm pháp luật.`
    }
  ];

  return (
    <div className="min-h-screen bg-background pt-24 pb-20">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-12 border-b border-surface-border pb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/20 border border-primary/40 rounded-full text-xs font-bold text-primary mb-4 box-glow">
            <FileText className="w-3.5 h-3.5" />
            <span>ĐIỀU KHOẢN DỊCH VỤ</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black uppercase tracking-widest text-glow text-white mb-4">
            Điều Khoản Sử Dụng
          </h1>
          <p className="text-gray-400 text-sm">
            Cập nhật lần cuối: <strong>Tháng 09/2026</strong> • Phiên bản 2.4 CyberPlex
          </p>
        </div>

        {/* Danh sách các điều khoản */}
        <div className="space-y-8">
          {sections.map((sec) => {
            const Icon = sec.icon;
            return (
              <div 
                key={sec.id}
                className="bg-surface border border-surface-border rounded-2xl p-6 sm:p-8 shadow-xl hover:border-primary/40 transition-all"
              >
                <div className="flex items-center gap-3.5 mb-4">
                  <div className="p-2.5 bg-primary/20 border border-primary/40 rounded-xl text-primary box-glow shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold text-white uppercase tracking-wider">
                    {sec.title}
                  </h2>
                </div>
                <div className="text-gray-300 text-sm sm:text-base leading-relaxed whitespace-pre-line pl-1 sm:pl-12">
                  {sec.content}
                </div>
              </div>
            );
          })}
        </div>

        {/* Thông tin hỗ trợ */}
        <div className="mt-12 p-6 sm:p-8 bg-surface-border/30 border border-surface-border rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-lg font-bold text-white uppercase mb-1">
              Bạn Có Thắc Mắc Về Điều Khoản?
            </h3>
            <p className="text-xs sm:text-sm text-gray-400">
              Đội ngũ chăm sóc khách hàng của CyberPlex luôn sẵn sàng hỗ trợ và giải đáp 24/7.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/support"
              className="px-5 py-2.5 bg-primary hover:bg-primary-glow text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-all box-glow flex items-center gap-2"
            >
              <HelpCircle className="w-4 h-4" />
              <span>Trung Tâm Hỗ Trợ</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
