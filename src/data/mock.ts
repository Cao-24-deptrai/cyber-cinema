export const MOCK_MOVIES = [
  {
    id: "1",
    title: "Galactic Wars: Apex",
    originalTitle: "Galactic Wars: Apex",
    genre: "Hành động / Sci-Fi",
    duration: "145 phút",
    rating: "8.8",
    releaseDate: "2026-08-15",
    ageRestriction: "C13",
    director: "Neill Blomkamp",
    cast: "Keanu Reeves, Charlize Theron",
    synopsis: "Trong tương lai năm 2145, khi Trái Đất cạn kiệt tài nguyên, một cuộc chiến khốc liệt nổ ra giữa các thuộc địa trên Sao Hỏa. Đội trưởng Apex phải dẫn dắt một nhóm phiến quân nhỏ để đánh cắp lõi năng lượng lượng tử, hy vọng cứu lấy cả hai hành tinh.",
    posterUrl: "https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?q=80&w=800&auto=format&fit=crop",
    bannerUrl: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=2874&auto=format&fit=crop",
    trailerId: "dQw4w9WgXcQ" // YouTube ID
  },
  {
    id: "2",
    title: "Neon Drift",
    originalTitle: "Neon Drift",
    genre: "Đua xe / Hành động",
    duration: "120 phút",
    rating: "9.2",
    releaseDate: "2026-07-20",
    ageRestriction: "C16",
    director: "Edgar Wright",
    cast: "Ryan Gosling, Ana de Armas",
    synopsis: "Một tay đua ngầm ở thành phố Neo-Tokyo bị vướng vào một âm mưu của các tập đoàn công nghệ lớn. Anh phải sử dụng kỹ năng siêu phàm của mình để sống sót và giải cứu người em gái.",
    posterUrl: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?q=80&w=800&auto=format&fit=crop",
    bannerUrl: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=2874&auto=format&fit=crop",
    trailerId: "dQw4w9WgXcQ"
  },
  {
    id: "3",
    title: "Synthetic Dawn",
    originalTitle: "Synthetic Dawn",
    genre: "Tâm lý / Sci-Fi",
    duration: "135 phút",
    rating: "8.5",
    releaseDate: "2025-11-10",
    ageRestriction: "C18",
    director: "Denis Villeneuve",
    cast: "Oscar Isaac, Rebecca Ferguson",
    synopsis: "Khi AI đạt đến điểm kỳ dị (Singularity), một thanh tra phải truy lùng một con robot có khả năng mô phỏng hoàn hảo cảm xúc con người, dẫn đến những câu hỏi sâu sắc về sự tồn tại.",
    posterUrl: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=800&auto=format&fit=crop",
    bannerUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2874&auto=format&fit=crop",
    trailerId: "dQw4w9WgXcQ"
  },
  {
    id: "4",
    title: "Orbital Bound",
    originalTitle: "Orbital Bound",
    genre: "Phiêu lưu / Không gian",
    duration: "115 phút",
    rating: "8.0",
    releaseDate: "2024-03-05",
    ageRestriction: "P",
    director: "Alfonso Cuarón",
    cast: "Sandra Bullock, George Clooney",
    synopsis: "Một tai nạn trạm vũ trụ khiến hai phi hành gia trôi dạt trong không gian. Họ phải sử dụng trí thông minh và lòng dũng cảm để tìm đường về Trái Đất trước khi hết oxy.",
    posterUrl: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=800&auto=format&fit=crop",
    bannerUrl: "https://images.unsplash.com/photo-1454789548928-9efd52dc4031?q=80&w=2874&auto=format&fit=crop",
    trailerId: "dQw4w9WgXcQ"
  }
];

export const MOCK_THEATERS = [
  {
    id: "cyberplex-downtown",
    name: "CYBERPLEX DOWNTOWN",
    city: "TP. Hồ Chí Minh",
    district: "Quận 1",
    address: "Tầng 5, TTTM CyberCenter, 128 Nguyễn Du, Bến Nghé, Quận 1, TP.HCM",
    phone: "1900 2077 (Nhánh 1)",
    email: "downtown@cyberplex.vn",
    imageUrl: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=1200&auto=format&fit=crop",
    formats: ["IMAX Laser 3D", "Dolby Atmos", "2D Standard", "VIP CyberLounge"],
    totalScreens: 8,
    totalSeats: 1250,
    amenities: [
      "Bãi đỗ xe ô tô/xe máy rộng rãi",
      "Khu ẩm thực CyberBites",
      "Ghế đôi Sweetbox",
      "Quầy Bar CyberLounge",
      "Phòng chiếu VIP riêng biệt",
      "Cổng soát vé tự động QR"
    ],
    mapUrl: "https://maps.google.com/?q=128+Nguyen+Du+Ben+Nghe+District+1+Ho+Chi+Minh"
  },
  {
    id: "cyberplex-neon-city",
    name: "CYBERPLEX NEON CITY",
    city: "TP. Hồ Chí Minh",
    district: "TP. Thủ Đức",
    address: "Tầng 4, Neon Mall, 88 Song Hành, An Phú, TP. Thủ Đức, TP.HCM",
    phone: "1900 2077 (Nhánh 2)",
    email: "neoncity@cyberplex.vn",
    imageUrl: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=1200&auto=format&fit=crop",
    formats: ["4DX Motion", "ScreenX 270°", "2D Standard"],
    totalScreens: 6,
    totalSeats: 980,
    amenities: [
      "Bãi đỗ xe tầng hầm liên thông",
      "CyberGaming Arcade",
      "Ghế đôi Sweetbox",
      "Check-in QR tự động",
      "Quầy bắp nước tiện lợi"
    ],
    mapUrl: "https://maps.google.com/?q=88+Song+Hanh+An+Phu+Thu+Duc+Ho+Chi+Minh"
  },
  {
    id: "cyberplex-mega-mall",
    name: "CYBERPLEX MEGA MALL",
    city: "TP. Hồ Chí Minh",
    district: "Quận 7",
    address: "Tầng 6, Crescent Mega Plaza, 101 Tôn Dật Tiên, Tân Phú, Quận 7, TP.HCM",
    phone: "1900 2077 (Nhánh 3)",
    email: "megamall@cyberplex.vn",
    imageUrl: "https://images.unsplash.com/photo-1574267432553-4b4628081c31?q=80&w=1200&auto=format&fit=crop",
    formats: ["IMAX Laser 3D", "4DX Motion", "Dolby Atmos", "2D Standard"],
    totalScreens: 10,
    totalSeats: 1600,
    amenities: [
      "Bãi giữ xe sức chứa 5000 xe",
      "Quầy bắp rang CyberBites 12 vị",
      "Phòng chiếu riêng CyberKids",
      "Khu mua sắm liên thông",
      "Khu chờ sang trọng"
    ],
    mapUrl: "https://maps.google.com/?q=101+Ton+Dat+Tien+Tan+Phu+District+7+Ho+Chi+Minh"
  },
  {
    id: "cyberplex-galaxy",
    name: "CYBERPLEX GALAXY",
    city: "Hà Nội",
    district: "Cầu Giấy",
    address: "Tầng 5, Tòa tháp Galaxy Horizon, 241 Xuân Thủy, Cầu Giấy, Hà Nội",
    phone: "1900 2077 (Nhánh 4)",
    email: "galaxy.hn@cyberplex.vn",
    imageUrl: "https://images.unsplash.com/photo-1595769816263-9b910be24d5f?q=80&w=1200&auto=format&fit=crop",
    formats: ["IMAX Laser 3D", "ScreenX", "Dolby Atmos", "VIP CyberLounge"],
    totalScreens: 9,
    totalSeats: 1420,
    amenities: [
      "Bãi đỗ xe thông minh",
      "Quầy CyberLounge Skyview",
      "Ghế Sweetbox cao cấp",
      "Máy in vé & soát vé tự động QR",
      "Phòng tiệc sinh nhật & sự kiện"
    ],
    mapUrl: "https://maps.google.com/?q=241+Xuan+Thuy+Cau+Giay+Ha+Noi"
  }
];

export const MOCK_SHOWTIMES = [
  {
    theaterName: "CYBERPLEX DOWNTOWN",
    address: "Khu công nghệ cao, 128 Nguyễn Du, Bến Nghé, Quận 1, TP.HCM",
    formats: [
      {
        name: "IMAX Laser 3D",
        times: ["18:30", "21:00", "23:30"]
      },
      {
        name: "2D Standard",
        times: ["17:00", "19:15", "22:00"]
      }
    ]
  },
  {
    theaterName: "CYBERPLEX NEON CITY",
    address: "Tầng 4, Neon Mall, 88 Song Hành, An Phú, TP. Thủ Đức, TP.HCM",
    formats: [
      {
        name: "4DX Motion",
        times: ["19:00", "21:30"]
      },
      {
        name: "2D Standard",
        times: ["18:00", "20:30", "23:00"]
      }
    ]
  },
  {
    theaterName: "CYBERPLEX MEGA MALL",
    address: "Tầng 6, Crescent Mega Plaza, 101 Tôn Dật Tiên, Tân Phú, Quận 7, TP.HCM",
    formats: [
      {
        name: "IMAX Laser 3D",
        times: ["17:30", "20:15", "22:45"]
      },
      {
        name: "Dolby Atmos",
        times: ["18:15", "21:00"]
      }
    ]
  },
  {
    theaterName: "CYBERPLEX GALAXY",
    address: "Tầng 5, Tòa tháp Galaxy Horizon, 241 Xuân Thủy, Cầu Giấy, Hà Nội",
    formats: [
      {
        name: "IMAX Laser 3D",
        times: ["18:00", "20:45", "23:15"]
      },
      {
        name: "2D Standard",
        times: ["17:15", "19:30", "21:45"]
      }
    ]
  }
];

// Helper sinh danh sách suất chiếu mẫu theo ngày
export function generateMockShowtimesList(targetDateStr?: string) {
  const result: any[] = [];
  let counter = 1;

  MOCK_MOVIES.forEach((movie) => {
    MOCK_SHOWTIMES.forEach((theater) => {
      theater.formats.forEach((fmt) => {
        fmt.times.forEach((t) => {
          result.push({
            id: `st_${counter++}`,
            movieId: movie.id,
            movieTitle: movie.title,
            posterUrl: movie.posterUrl,
            rating: movie.rating,
            ageRestriction: movie.ageRestriction,
            duration: movie.duration,
            genre: movie.genre,
            theaterName: theater.theaterName,
            address: theater.address,
            format: fmt.name,
            date: targetDateStr || "28/08",
            time: t,
            bookedSeats: ["C5", "C6", "D7"] // Vài ghế mẫu đã đặt
          });
        });
      });
    });
  });

  return result;
}

