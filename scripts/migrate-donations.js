
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, Timestamp } from "firebase/firestore";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderID: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const donations = [
  { name: "JOKOWISAYANGPRABOWO", amount: 10000, message: "semangat mimin", date: "2026-04-21T13:14:00" },
  { name: "Fahri", amount: 1000, message: "Beli", date: "2026-04-05T00:00:00" },
  { name: "Kolane_958", amount: 5000, message: "Mimin :) req:Space flight sim", date: "2025-10-09T00:00:00" },
  { name: "Kolane_958", amount: 10000, message: "kalau bisa cepetin up nya hehe", date: "2025-09-30T00:00:00" },
  { name: "Kolane_958", amount: 10000, message: "Req hello neighbor yang full ya mimin yang baik hati", date: "2025-09-28T00:00:00" },
  { name: "Agus lagi", amount: 15000, message: "Itu batlefield 4 nya jangan kasih ggl drive bang gw gak bisa dwonload, kasih link kyk meongclub ajh. request utama:WALPAPER ENGINE!!!👌", date: "2025-08-22T00:00:00" },
  { name: "Agus", amount: 20000, message: "Request game ini bang https://vt.tiktok.com/ZSSTCC9eT/", date: "2025-08-14T00:00:00" },
  { name: "dinky puppy", amount: 10000, message: "makasih miminnn btw forza ada kah xixixi", date: "2025-08-06T00:00:00" },
  { name: "Dinkypupy", amount: 10000, message: "Req game MOTOGP dong om:*", date: "2025-08-02T00:00:00" },
  { name: "Fauzi", amount: 1000, message: "Min bisa req Spongebob the cosmic shake", date: "2025-07-30T00:00:00" },
  { name: "escanor.", amount: 1000, message: "makasih ya bang , ini hari pertama", date: "2025-07-16T00:00:00" },
  { name: "klara", amount: 15000, message: "miminnnnnn, mau game haremmmm donggg 😋😭😭😭😭😊😊😊", date: "2025-07-06T00:00:00" },
  { name: "kiki", amount: 1000, message: "sukses", date: "2025-06-18T00:00:00" },
  { name: "Zainal", amount: 15000, message: "Ditunggu bang kiriman kode email untuk game DMC 5", date: "2025-06-07T00:00:00" },
  { name: "Fauzi", amount: 2000, message: "Semangat:)", date: "2025-05-21T00:00:00" },
  { name: "Fwyd", amount: 10000, message: "bg mau nanya, pas install pes 2016 muncul \".Net framework not occur\" cara mengatasinya gmn bg, terus usb nya ga kebaca jg", date: "2025-04-08T00:00:00" },
  { name: "salis", amount: 10000, message: "izin download game devil my cry 5 bang entar kalau bisa gw kirim lagi 20k", date: "2024-11-28T00:00:00" },
  { name: "Rafal", amount: 1000, message: "Halo", date: "2024-07-21T00:00:00" },
];

async function migrate() {
  console.log("Starting migration of " + donations.length + " donations...");
  for (const don of donations) {
    try {
      const docRef = await addDoc(collection(db, "donations"), {
        name: don.name,
        amount: don.amount,
        message: don.message,
        timestamp: Timestamp.fromDate(new Date(don.date)),
        processed: true,
        source: "migration"
      });
      console.log("Migrated: " + don.name + " (" + don.amount + ") -> " + docRef.id);
    } catch (e) {
      console.error("Error migrating " + don.name + ": ", e);
    }
  }
  console.log("Migration complete!");
  process.exit(0);
}

migrate();
