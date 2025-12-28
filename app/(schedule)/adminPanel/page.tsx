import { ProfileData } from "@/app/(user)/lib/actions";
import HomeStation from "@/app/(user)/components/homeStation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";

export default function AdminPanel(userProfile: ProfileData) {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="flex flex-col items-center justify-center h-screen">
        <h1>יצירת משמרת</h1>
        <HomeStation areaName={userProfile.areaName} />
      </div>
      <div className="flex flex-col items-center justify-center h-screen w-60">
        <div className="flex flex-row items-center justify-center gap-4 w-full">
          <h3 className="whitespace-nowrap">סוג משמרת:</h3>
          <Select>
            <SelectTrigger>
              <SelectValue
                placeholder=""
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="night">לילה</SelectItem>
              <SelectItem value="morning">בוקר</SelectItem>
              <SelectItem value="pre_shift">תגבור</SelectItem>
              <SelectItem value="evening">ערב</SelectItem>
              <SelectItem value="over_the_machine">מעל התקן</SelectItem>
              <SelectItem value="security">אבתחה</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-row items-center justify-center gap-4 w-full">
        <h3 className="whitespace-nowrap">נקודת הזנקה:</h3>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">נקודת הזנקה 1</SelectItem>
            <SelectItem value="2">נקודת הזנקה 2</SelectItem>
            <SelectItem value="3">נקודת הזנקה 3</SelectItem>
          </SelectContent>
        </Select>
        </div>
      </div>
    </div>
  );
}
