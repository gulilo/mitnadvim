import { getProfileData } from "@/app/(user)/lib/actions";
import HomeStation from "@/app/components/homeStation";
import { getAllLaunchPoints } from "../data/launchPoint";
import ShiftForm from "./components/ShiftForm";

export const dynamic = "force-dynamic";

export default async function CreateShiftPage() {
  const userProfile = await getProfileData();
  const launchPoints = await getAllLaunchPoints();

  if (!userProfile) {
    return null;
  }

  return (
    <div className="w-full min-h-screen bg-[#f5f5f5] py-8">
      <div className="w-full max-w-6xl mx-auto px-4">
        <div className="flex justify-center mb-6">
          <h1 className="text-[34px] font-bold text-center text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">
            יצירת משמרת
          </h1>
        </div>

        <div className="flex justify-center mb-8">
          <HomeStation areaName={userProfile.areaName} />
        </div>

        <ShiftForm launchPoints={launchPoints} />
        </div>
    </div>
  );
}
