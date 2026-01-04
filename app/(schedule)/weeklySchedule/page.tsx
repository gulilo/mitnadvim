import { getNextWeekShifts, DisplayShift } from "../data/shift";
import { getAllLaunchPoints } from "../data/launchPoint";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";

const DAY_NAMES = ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שבת"];

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("he-IL", {
    day: "numeric",
    month: "numeric",
  }).format(date);
}

function formatTime(time: string): string {
  // time is in format "HH:MM:SS" or "HH:MM"
  const parts = time.split(":");
  return `${parts[0]}:${parts[1]}`;
}

export default async function WeeklySchedule() {
  const shifts = await getNextWeekShifts();
  const launchPoints = await getAllLaunchPoints();
  
  // Create a map for quick launch point lookup
  const launchPointMap = new Map(launchPoints.map(lp => [lp.id, lp.name]));

  // Group shifts by date
  const shiftsByDate = new Map<string, DisplayShift[]>();
  shifts.forEach(shift => {
    const dateKey = shift.date.toISOString().split('T')[0];
    if (!shiftsByDate.has(dateKey)) {
      shiftsByDate.set(dateKey, []);
    }
    shiftsByDate.get(dateKey)!.push(shift);
  });

  // Generate the 7 days
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const days: { date: Date; dateKey: string; dayName: string }[] = [];
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    const dateKey = date.toISOString().split('T')[0];
    const dayName = DAY_NAMES[date.getDay()];
    days.push({ date, dateKey, dayName });
  }

  return (
    <div dir="rtl" className="w-full min-h-screen bg-[#f5f5f5] py-8">
      <div className="w-full max-w-7xl mx-auto px-4">
        {/* Title */}
        <div className="flex justify-center mb-6">
          <h1 className="text-[34px] font-bold text-center">
            לוח משמרות - השבוע הקרוב
          </h1>
        </div>

        {/* Weekly Schedule */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-4">
          {days.map(({ date, dateKey, dayName }) => {
            const dayShifts = shiftsByDate.get(dateKey) || [];
            
            return (
              <Card key={dateKey} className="bg-white">
                <CardHeader>
                  <CardTitle className="text-lg font-bold text-center">
                    {dayName}
                  </CardTitle>
                  <div className="text-sm text-center text-muted-foreground">
                    {formatDate(date)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {dayShifts.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center">
                      אין משמרות
                    </p>
                  ) : (
                    dayShifts.map((shift, index) => {
                      const launchPointName = launchPointMap.get(shift.launch_point_id) || "לא ידוע";
                      const isPermanent = shift.isFromPermanent;
                      
                      return (
                        <div
                          key={`${dateKey}-${index}-${shift.id || shift.permanent_shift_id}`}
                          className={`p-3 rounded-lg border ${
                            isPermanent 
                              ? "bg-blue-50 border-blue-200" 
                              : shift.status === "active"
                              ? "bg-green-50 border-green-200"
                              : "bg-gray-50 border-gray-200"
                          }`}
                        >
                          <div className="font-semibold text-sm mb-1">
                            {launchPointName}
                          </div>
                          <div className="text-xs text-muted-foreground mb-1">
                            {formatTime(shift.start_time)} - {formatTime(shift.end_time)}
                          </div>
                          <div className="flex justify-between items-center text-xs">
                            <span>
                              {shift.adult_only ? "מבוגרים בלבד" : "כל הגילאים"}
                            </span>
                            <span className="font-medium">
                              {shift.number_of_slots} מקומות
                            </span>
                          </div>
                          {isPermanent && (
                            <div className="text-xs text-blue-600 mt-1">
                              משמרת קבועה
                            </div>
                          )}
                          {shift.status === "canceled" && (
                            <div className="text-xs text-red-600 mt-1">
                              בוטל
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}

