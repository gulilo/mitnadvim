import { cn } from "@/app/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/app/components/ui/accordion";
import type { AmbulanceType, DisplayShift, PickerShiftType, ShiftType } from "../../data/shift";
import PickerCell from "./pickerCell";

const SHIFT_TYPE_LABELS: Record<ShiftType, string> = {
  day: "בוקר",
  reinforcement: "תגבור",
  evening: "ערב",
  night: "לילה",
  over_the_machine: "מעל התקן",
  security: "אבטחה",
};

const AMBULANCE_TYPE_LABELS: Record<string, string> = {
  white: "אמבולנס לבן",
  atan: "אמבולנס טיפול נמרץ",
};

function getAmbulanceTypeLabel(ambulanceType: string): string {
  const key = ambulanceType.toLowerCase().replace(/\s+/g, "_");
  return AMBULANCE_TYPE_LABELS[key] ?? AMBULANCE_TYPE_LABELS[ambulanceType] ?? ambulanceType;
}

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
  shiftsData: Map<ShiftType, Map<AmbulanceType, DisplayShift[]>>;
}) {
  const shiftStyle = (id: string) => SHIFT_TYPE_STYLE[id] ?? { bg: "#e5e5e5", textDark: true };
  
  return (
    <Accordion type="multiple" className="mt-6 w-full">
      {[...shiftsData].map(([shiftType, ambulanceType]) => {
        const style = shiftStyle(shiftType);
        const hasAmbulanceTypes = ambulanceType.size > 0;
        return (
          <AccordionItem
            key={shiftType}
            value={shiftType}
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
              <span>{SHIFT_TYPE_LABELS[shiftType]}</span>
              <span>({ambulanceType.size})</span>
            </AccordionTrigger>
            <AccordionContent className="p-0">
              {hasAmbulanceTypes ? (
                <Accordion type="multiple" className="w-full">
                  {[...ambulanceType].map(([ambulanceType, shifts]) => {
                    const ambStyle = getAmbulanceStyle(ambulanceType);
                    return (
                      <AccordionItem
                        key={ambulanceType}
                        value={ambulanceType}
                        className={cn("border border-red-500")}
                      >
                        <AccordionTrigger
                          className={cn(
                            "h-20 px-6 py-0 text-lg font-bold w-full",
                            ambStyle.textDark ? "text-black" : "text-white"
                          )}
                          style={{ backgroundColor: ambStyle.bg }}
                        >
                          <span>{getAmbulanceTypeLabel(ambulanceType)}</span>
                          <span>({shifts.length})</span>
                        </AccordionTrigger>
                        <AccordionContent className="p-0"
                          style={{ backgroundColor: ambStyle.bg }}
                        >
                          {shifts.map((shift) => (
                            <PickerCell shift={shift} key={shift.id} />

                            // <div
                            //   key={loc.shiftId}
                            //   className="flex h-20 w-full items-center justify-between gap-4 px-6 text-lg font-bold border border-red-500"
                            //   style={{
                            //     backgroundColor: ambStyle.bg,
                            //     color: ambStyle.textDark ? "black" : "white",
                            //   }}
                            // >
                            //   {loc.ambulanceNumber != null && (
                            //     <span>
                            //       {loc.ambulanceNumber}
                            //     </span>
                            //   )}
                            //   <span>{loc.label}</span>
                            // </div>
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
