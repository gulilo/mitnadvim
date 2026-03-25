import Image from "next/image";
export default function HomeStation({ areaName }: { areaName: string }) {
    return (
        <div className="flex flex-row mb-2">
        <Image
          src="/icon_pin-MDA.svg"
          alt="Home Station"
          width={18}
          height={26}
        />
        <h4 className="text-black mr-2">
          תחנת אם: {areaName || "לא צוין"}
        </h4>
      </div>
    )
}