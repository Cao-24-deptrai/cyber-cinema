import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, doc, setDoc } from "firebase/firestore";
import { MOCK_MOVIES, MOCK_SHOWTIMES } from "@/data/mock";

export async function GET() {
  try {
    // 1. Thêm danh sách phim
    const moviesRef = collection(db, "movies");
    for (const movie of MOCK_MOVIES) {
      await setDoc(doc(moviesRef, movie.id), movie);
    }

    // 2. Thêm lịch chiếu mẫu
    const showtimesRef = collection(db, "showtimes");
    let showtimeIdCounter = 1;
    
    for (const movie of MOCK_MOVIES) {
      for (const theater of MOCK_SHOWTIMES) {
        for (const format of theater.formats) {
          for (const time of format.times) {
            const showtimeId = `st_${showtimeIdCounter++}`;
            await setDoc(doc(showtimesRef, showtimeId), {
              movieId: movie.id,
              theaterName: theater.theaterName,
              address: theater.address,
              format: format.name,
              date: "28/08",
              time: time,
              bookedSeats: [] // Khởi tạo mảng ghế trống
            });
          }
        }
      }
    }

    return NextResponse.json({ success: true, message: "Database seeded successfully!" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
