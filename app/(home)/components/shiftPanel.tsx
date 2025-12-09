import ShiftCard from "./shiftCard";

const shifts = [
  {
    date: "ראשון, 13/7/2025",
    duty: "ערב",
    location: "לבן, ת״א 1",
  },
  {
    date: "שלישי, 15/7/2025",
    duty: "לילה",
    location: "נט״ן, מזא״ה",
  },
  {
    date: "שבת, 26/7/2025",
    duty: "אבטחה",
    location: "איצטדיון בלומפילד",
  },
];

export default function ShiftPanel() {
  return (
    <section className="relative mt-8">
      <div className="absolute -top-4 right-8 rounded-full bg-[#f5f5f5] px-3 py-1 text-sm font-semibold text-[#111] shadow-[0_0_0_1px_rgba(0,0,0,0.05)]">
        המשמרות שלי
      </div>
      <div className="rounded-3xl border-2 border-[#fc5c5c] bg-white px-4 pb-6 pt-8 shadow-sm">
        <div className="grid grid-cols-[1.6fr,0.6fr,0.9fr] gap-3 border-b border-[#fcd1d1] pb-2 text-xs font-bold text-[#111]">
          <p className="text-right">יום ותאריך</p>
          <p className="text-right">משמרת</p>
          <p className="text-right">נה״ז</p>
        </div>
        <div className="mt-3 space-y-3">
          {shifts.map((shift) => (
            <ShiftCard
              key={shift.date}
              className="grid grid-cols-[1.6fr,0.6fr,0.9fr] gap-3"
            >
              <p className="text-right">{shift.date}</p>
              <p className="text-right font-semibold">{shift.duty}</p>
              <p className="text-right">{shift.location}</p>
            </ShiftCard>
          ))}
        </div>
      </div>
    </section>
  );
}
