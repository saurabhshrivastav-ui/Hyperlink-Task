import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "@lab_bookings";

export const getBookings = async () => {
  try {
    const json = await AsyncStorage.getItem(STORAGE_KEY);
    return json ? JSON.parse(json) : [];
  } catch {
    return [];
  }
};

export const addBooking = async (booking) => {
  const bookings = await getBookings();
  const newBooking = {
    id: `HL${Date.now().toString().slice(-4)}`,
    date: new Date().toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
    testTitle: booking.testTitle || "Diabetes Screening (HbAIC & Fasting Sugar)",
    patientName: booking.patientName || "Sakshi Kewat",
    contact: booking.contact || "8169928844",
    address: booking.address || "Amrut Nagar, Ghatkopar West, Mumbai",
    time: booking.time || "12pm",
    amount: booking.amount || "479/-",
    status: "upcoming", // upcoming | completed | cancelled
    ...booking,
  };
  bookings.unshift(newBooking);
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
  return newBooking;
};

export const updateBookingStatus = async (bookingId, status) => {
  const bookings = await getBookings();
  const idx = bookings.findIndex((b) => b.id === bookingId);
  if (idx !== -1) {
    bookings[idx].status = status;
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
  }
  return bookings;
};

export const clearBookings = async () => {
  await AsyncStorage.removeItem(STORAGE_KEY);
};
