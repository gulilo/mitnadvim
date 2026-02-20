import { cn } from "@/app/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/app/components/ui/accordion";
import type { PickerShiftType } from "../data/shift";

const SHIFT_TYPE_STYLE: Record<
  string,
  { bg: string; textDark: boolean }
> = {
  day: { bg: "#5bd5fa", textDark: true },
  reinforcement: { bg: "#c3adf3", textDark: true },
  evening: { bg: "#2b6678", textDark: false },
  night: { bg: "#183e4a", textDark: false },
  over_the_machine: { bg: "#532ca7", textDark: false },
  security: { bg: "#14ae5c", textDark: true },
};

const AMBULANCE_TYPE_STYLE: Record<string, { bg: string; textDark: boolean }> = {
  white: { bg: "rgba(252,92,92,0.5)", textDark: true },
  intensive: { bg: "#fffaa8", textDark: true },
  default: { bg: "#fffaa8", textDark: true },
};

function getAmbulanceStyle(ambulanceTypeId: string): { bg: string; textDark: boolean } {
  const key = ambulanceTypeId.toLowerCase();
  return AMBULANCE_TYPE_STYLE[key] ?? AMBULANCE_TYPE_STYLE.default;
}

export default function ShiftPickerContent({
  shiftsData,
}: {
  shiftsData: PickerShiftType[];
}) {
  const shiftStyle = (id: string) => SHIFT_TYPE_STYLE[id] ?? { bg: "#e5e5e5", textDark: true };

  return (
    <Accordion type="multiple" className="mt-6 w-full">
      {shiftsData.map((shift) => {
        const style = shiftStyle(shift.id);
        const hasAmbulanceTypes = shift.ambulanceTypes.length > 0;
        return (
          <AccordionItem
            key={shift.id}
            value={shift.id}
            className={cn("border border-red-500")}
          >
            <AccordionTrigger
              className={cn(
                "h-20 rounded-none px-6 py-0 w-full",
                "text-lg font-bold",
                style.textDark ? "text-black" : "text-white"
              )}
              style={{ backgroundColor: style.bg }}
            >
              <span>{shift.label}</span>
              <span>({shift.count})</span>
            </AccordionTrigger>
            <AccordionContent className="p-0">
              {hasAmbulanceTypes ? (
                <Accordion type="multiple" className="w-full">
                  {shift.ambulanceTypes.map((amb) => {
                    const ambStyle = getAmbulanceStyle(amb.id);
                    return (
                      <AccordionItem
                        key={amb.id}
                        value={amb.id}
                        className={cn("border border-red-500")}
                      >
                        <AccordionTrigger
                          className={cn(
                            "h-20 px-6 py-0 text-lg font-bold w-full",
                            ambStyle.textDark ? "text-black" : "text-white"
                          )}
                          style={{ backgroundColor: ambStyle.bg }}
                        >
                          <span>{amb.label}</span>
                          <span>({amb.count})</span>
                        </AccordionTrigger>
                        <AccordionContent className="p-0">
                          {amb.locations.map((loc) => (
                            <div
                              key={loc.shiftId}
                              className="flex h-20 w-full items-center justify-between gap-4 px-6 text-lg font-bold border border-red-500"
                              style={{
                                backgroundColor: ambStyle.bg,
                                color: ambStyle.textDark ? "black" : "white",
                              }}
                            >
                              {loc.ambulanceNumber != null && (
                                <span>
                                  {loc.ambulanceNumber}
                                </span>
                              )}
                              <span>{loc.label}</span>
                            </div>
                          ))}
                        </AccordionContent>
                      </AccordionItem>
                    );
                  })}
                </Accordion>
              ) : null}
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}
