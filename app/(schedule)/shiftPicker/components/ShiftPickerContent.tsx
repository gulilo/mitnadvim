import { cn } from "@/app/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/app/components/ui/accordion";
import {
  type DisplayShift,
} from "../../data/shift";
import PickerCell from "./pickerCell";
import { Tag } from "@/app/(user)/data/definitions";
import { ambulance_type, shift_type } from "@/generated/prisma/enums";


const SHIFT_TYPE_LABELS: Record<shift_type, string> = {
  day: "בוקר",
  reinforcement: "תגבור",
  evening: "ערב",
  night: "לילה",
  overstaffed: "מעל התקן",
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
  overstaffed: { bg: "#532ca7", textDark: false },
  security: { bg: "#14ae5c", textDark: true },
};

const SHIFT_TYPE_ORDER: shift_type[] = [
  "day",
  "reinforcement",
  "evening",
  "night",
  "overstaffed",
  "security",
];
function compareShiftTypeOrder(a: shift_type, b: shift_type): number {
  const ia = SHIFT_TYPE_ORDER.indexOf(a);
  const ib = SHIFT_TYPE_ORDER.indexOf(b);
  const ra = ia === -1 ? SHIFT_TYPE_ORDER.length : ia;
  const rb = ib === -1 ? SHIFT_TYPE_ORDER.length : ib;
  return ra - rb;
}

const AMBULANCE_TYPE_STYLE: Record<string, { bg: string; textDark: boolean }> = {
  white: { bg: "rgba(252,92,92,0.5)", textDark: true },
  atan: { bg: "#fffaa8", textDark: true },
  default: { bg: "#fffaa8", textDark: true },
};

function getAmbulanceStyle(ambulanceTypeId: string): { bg: string; textDark: boolean } {
  const key = ambulanceTypeId.toLowerCase();
  return AMBULANCE_TYPE_STYLE[key] ?? AMBULANCE_TYPE_STYLE.default;
}

export default function ShiftPickerContent({
  shiftsData,
  tags,
}: {
  shiftsData: Map<shift_type, Map<ambulance_type, DisplayShift[]>>;
  tags: Tag[];
}) {
  const shiftStyle = (id: string) => SHIFT_TYPE_STYLE[id] ?? { bg: "#e5e5e5", textDark: true };

  return (
    <Accordion type="multiple" className="mt-6 w-full">
      {[...shiftsData]
        .sort(([a], [b]) => compareShiftTypeOrder(a, b))
        .map(([shiftType, ambulanceType]) => {
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
                <span>({[...ambulanceType.values()].reduce((sum, shifts) => sum + shifts.length, 0)})</span>
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
                              <PickerCell shift={shift} key={shift.id} tags={tags} />
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
