import { auth } from "@/auth";
import { redirect } from "next/navigation";
import {
  getAllLaunchPoints,
  getAllAreas,
  getAreaName,
} from "../data/launchPoint";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import CreateLaunchPointForm from "./components/CreateLaunchPointForm";
import DeleteLaunchPointButton from "./components/DeleteLaunchPointButton";
import SortableLaunchPointsList from "./components/sortableLaunchPointsList";

export default async function CreateLP() {
  const session = await auth();
  if (!session?.user) {
    redirect("./login");
  }

  const launchPoints = await getAllLaunchPoints();
  const areas = await getAllAreas();

  // Get area names for each launch point
  const launchPointsWithAreaNames = await Promise.all(
    launchPoints.map(async (lp) => {
      const areaName = await getAreaName(lp.area_id);
      return { ...lp, areaName: areaName || "Unknown" };
    })
  );

  return (
    <div dir="rtl" className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">יצירת נקודת הזנקה</h1>

      {/* Form to create new launch point */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>הוסף נקודת הזנקה חדשה</CardTitle>
        </CardHeader>
        <CardContent>
          <CreateLaunchPointForm areas={areas} />
        </CardContent>
      </Card>

      {/* List of existing launch points */}
      <Card>
        <CardHeader>
          <CardTitle>נקודות הזנקה קיימות</CardTitle>
        </CardHeader>
        <CardContent>
          {launchPointsWithAreaNames.length === 0 ? (
            <p className="text-muted-foreground">אין נקודות הזנקה עדיין</p>
          ) : (
            <SortableLaunchPointsList items={launchPointsWithAreaNames} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
