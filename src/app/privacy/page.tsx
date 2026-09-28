"use client";

import Link from "next/link";
import { 
  ShieldCheck, 
  Lock, 
  Database, 
  Eye, 
  Share2, 
  UserX, 
  Cookie, 
  Mail, 
  CheckCircle2,
  FileKey
} from "lucide-react";

export default function PrivacyPage() {
  const sections = [
    {
      id: "commitment",
      icon: ShieldCheck,
      title: "1. Cam Kết Quyền Riêng Tư",
      content: `CyberPlex Cinemas cam kết tôn trọng và bảo vệ tối đa quyền riêng tư của khách hàng. Chúng tôi hiểu rằng thông tin cá nhân của bạn là tài sản quý giá và có trách nhiệm bảo đảm rằng mọi dữ liệu thu thập trong quá trình bạn sử dụng dịch vụ đều được bảo mật theo các chuẩn mực an toàn thông tin quốc tế và pháp luật Việt Nam.`
    },
    {
      id: "collection",
      icon: Database,
      title: "2. Thông Tin Chúng Tôi Thu Thập",
      content: `Chúng tôi chỉ thu thập các thông tin thực sự cần thiết nhằm phục vụ quy trình cung cấp dịch vụ đặt vé xem phim:
- Thông tin định danh: Họ tên, địa chỉ email, số điện thoại đăng ký tài khoản.
- Lịch sử giao dịch: Tên phim, rạp, ghế ngồi, ngày giờ chiếu, mã vé QR và trạng thái thanh toán.
- Dữ liệu thiết bị & kỹ thuật: Địa chỉ IP, loại trình duyệt, hệ điều hành nhằm tối ưu hóa trải nghiệm hiển thị và phòng chống gian lận.
Lưu ý: CyberPlex KHÔNG TRỰC TIẾP LƯU TRỮ thông tin thẻ tín dụng/ghi nợ (số thẻ, ngày hết hạn, mã bảo mật CVV). Toàn bộ thao tác xử lý thẻ được mã hóa và tiếp nhận trực tiếp bởi các cổng thanh toán uy tín được Ngân hàng Nhà nước cấp phép.`
    },
    {
      id: "purpose",
      icon: Eye,
      title: "3. Mục Đích Sử Dụng Dữ Liệu",
      content: `Thông tin thu thập được sử dụng cho các mục đích chính sau:
- Xử lý đơn hàng, xuất vé điện tử có mã QR và gửi email xác nhận đặt vé thành công.
- Xác thực vé tại cổng soát vé tự động khi khách hàng đến rạp.
- Tích điểm thưởng thành viên CyberPlex và gửi các ưu đãi cá nhân hóa (nếu bạn đồng ý nhận thông tin).
- Hỗ trợ khách hàng, giải quyết khiếu nại, sự cố kỹ thuật hoặc hoàn tiền khi suất chiếu bị gián đoạn.
- Cải thiện chất lượng hệ thống, nâng cao trải nghiệm người dùng và ngăn ngừa các hành vi gian lận trực tuyến.`
    },
    {
      id: "security",
      icon: Lock,
      title: "4. Cơ Chế Lưu Trữ & Mã Hóa Dữ Liệu",
      content: `Dữ liệu người dùng được lưu trữ trên hạ tầng đám mây đạt tiêu chuẩn bảo mật ISO/IEC 27001. Mọi dữ liệu truyền tải giữa trình duyệt của bạn và máy chủ CyberPlex đều được mã hóa bằng giao thức SSL/TLS chuẩn 256-bit cao cấp nhất. Chúng tôi áp dụng quy trình kiểm soát truy cập nghiêm ngặt và sao lưu dữ liệu thường xuyên để phòng ngừa nguy cơ rò rỉ hoặc mất mát.`
    },
    {
      id: "sharing",
      icon: Share2,
      title: "5. Chia Sẻ Thông Tin Với Bên Thứ Ba",
      content: `CyberPlex TUYỆT ĐỐI KHÔNG bán, cho thuê, thương mại hóa hay tiết lộ thông tin cá nhân của bạn cho bất kỳ bên thứ ba nào vì mục đích quảng cáo khi chưa có sự đồng ý rõ ràng từ bạn. Thông tin chỉ được cung cấp cho:
- Các đối tác cổng thanh toán phục vụ việc hoàn tất giao dịch.
- Cơ quan thực thi pháp luật khi có yêu cầu hợp pháp theo đúng trình tự pháp lý của Việt Nam.`
    },
    {
      id: "user-rights",
      icon: UserX,
      title: "6. Quyền Của Khách Hàng Đối Với Dữ Liệu",
      content: `Bạn có đầy đủ các quyền đối với dữ liệu cá nhân của mình:
- Quyền truy cập và cập nhật thông tin cá nhân trong trang Hồ Sơ Cá Nhân bất kỳ lúc nào.
- Quyền từ chối nhận các email khuyến mãi hoặc bản tin điện ảnh.
- Quyền yêu cầu xóa vĩnh viễn tài khoản và toàn bộ dữ liệu lịch sử liên quan bằng cách gửi yêu cầu đến bộ phận bảo mật dữ liệu của chúng tôi.`
    },
    {
      id: "cookies",
      icon: Cookie,
      title: "7. Chính Sách Cookie",
      content: `Website sử dụng cookies và các công nghệ lưu trữ cục bộ để duy trì phiên đăng nhập của bạn, ghi nhớ tùy chọn giao diện (như rạp yêu thích hoặc chế độ xem lịch chiếu), và phân tích lượng truy cập ẩn danh nhằm nâng cao hiệu năng hoạt động của hệ thống.`
    }
  ];

  return (
    <div className="min-h-screen bg-background pt-24 pb-20">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-12 border-b border-surface-border pb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/20 border border-primary/40 rounded-full text-xs font-bold text-primary mb-4 box-glow">
            <Lock className="w-3.5 h-3.5" />
            <span>AN TOÀN THÔNG TIN</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black uppercase tracking-widest text-glow text-white mb-4">
            Chính Sách Bảo Mật
          </h1>
          <p className="text-gray-400 text-sm">
            Hiệu lực từ: <strong>01/01/2026</strong> • Tiêu chuẩn an toàn thông tin CyberPlex
          </p>
        </div>

        {/* Nội dung các phần */}
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

        {/* Liên hệ bảo mật */}
        <div className="mt-12 p-6 sm:p-8 bg-surface-border/30 border border-surface-border rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-primary/20 border border-primary/40 rounded-xl text-primary shrink-0 box-glow">
              <FileKey className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white uppercase mb-1">
                Bộ Phận Bảo Vệ Dữ Liệu (DPO)
              </h3>
              <p className="text-xs sm:text-sm text-gray-400">
                Mọi thắc mắc hoặc yêu cầu liên quan đến dữ liệu cá nhân, vui lòng liên hệ: <strong className="text-primary">privacy@cyberplex.vn</strong>
              </p>
            </div>
          </div>
          <Link
            href="/support"
            className="px-5 py-2.5 bg-primary hover:bg-primary-glow text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-all box-glow shrink-0"
          >
            Liên Hệ Ngay
          </Link>
        </div>
      </div>
    </div>
  );
}
