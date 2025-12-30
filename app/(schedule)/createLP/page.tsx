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
            <ul className="space-y-2">
              {launchPointsWithAreaNames.map((lp) => (
                <li
                  key={lp.id}
                  className="flex flex-row justify-between items-center p-3 border-b border-border"
                >
                  <div className="flex flex-col">
                    <span className="font-medium">{lp.name}</span>
                    <span className="text-sm text-muted-foreground">
                      אזור: {lp.areaName}
                    </span>
                  </div>
                  <DeleteLaunchPointButton
                    launchPointId={lp.id}
                    launchPointName={lp.name}
                  />
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
