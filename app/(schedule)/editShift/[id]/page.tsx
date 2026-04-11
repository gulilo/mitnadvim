import { getProfileData } from "@/app/(user)/lib/actions";
import { getAllLaunchPoints } from "../../data/launchPoint";
import { getShiftById } from "../../data/shift";
import ShiftForm from "../../createShift/components/ShiftForm";

export default async function EditShiftPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const shift = await getShiftById(id);
  const userProfile = await getProfileData();
  const launchPoints = await getAllLaunchPoints();

  if (!userProfile || !shift) {
    return null;
  }
  return (
    <div className="w-full min-h-screen bg-[#f5f5f5] py-8">
      <div className="w-full max-w-6xl mx-auto px-4">
        <div className="flex justify-center mb-6">
          <h1 className="text-[34px] font-bold text-center text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">
            עריכת משמרת
          </h1>
        </div>
        <ShiftForm mode="edit" shift={shift} launchPoints={launchPoints} />
      </div>
    </div>
  );
}