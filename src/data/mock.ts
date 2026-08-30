export const MOCK_MOVIES = [
  {
    id: "1",
    title: "Galactic Wars: Apex",
    originalTitle: "Galactic Wars: Apex",
    genre: "Hành động / Sci-Fi",
    duration: "145 phút",
    rating: "8.8",
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
    ageRestriction: "P",
    director: "Alfonso Cuarón",
    cast: "Sandra Bullock, George Clooney",
    synopsis: "Một tai nạn trạm vũ trụ khiến hai phi hành gia trôi dạt trong không gian. Họ phải sử dụng trí thông minh và lòng dũng cảm để tìm đường về Trái Đất trước khi hết oxy.",
    posterUrl: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=800&auto=format&fit=crop",
    bannerUrl: "https://images.unsplash.com/photo-1454789548928-9efd52dc4031?q=80&w=2874&auto=format&fit=crop",
    trailerId: "dQw4w9WgXcQ"
  }
];

export const MOCK_SHOWTIMES = [
  {
    theaterName: "CYBERPLEX DOWNTOWN",
    address: "Khu công nghệ cao, Quận 1",
    formats: [
      {
        name: "IMAX 3D",
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
    address: "Tầng 5, TTTM Neon, Quận 2",
    formats: [
      {
        name: "4DX",
        times: ["19:00", "21:30"]
      },
      {
        name: "2D Standard",
        times: ["18:00", "20:30", "23:00"]
      }
    ]
  }
];
