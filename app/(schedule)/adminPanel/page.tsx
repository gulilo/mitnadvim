import { getProfileData } from "@/app/(user)/lib/actions";
import HomeStation from "@/app/(user)/components/homeStation";
import { getAllLaunchPoints } from "../data/launchPoint";
import Form from "./components/form";

export default async function AdminPanel() {
  const userProfile = await getProfileData();
  const launchPoints = await getAllLaunchPoints();

  if (!userProfile) {
    return null; // or redirect to login
  }

  return (
    <div className="w-full min-h-screen bg-[#f5f5f5] py-8">
      <div className="w-full max-w-6xl mx-auto px-4">
        {/* Title */}
        <div className="flex justify-center mb-6">
          <h1 className="text-[34px] font-bold text-center text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">
            יצירת משמרת
          </h1>
        </div>

        {/* Location */}
        <div className="flex justify-center mb-8">
          <HomeStation areaName={userProfile.areaName} />
        </div>

        {/* Form */}
        <Form launchPoints={launchPoints} />
      </div>
    </div>
  );
}
