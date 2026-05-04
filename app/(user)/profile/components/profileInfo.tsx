import ProfilePicture from "./profilePicture";
import UserRoleIcon from "./userRoleIcon";
import HomeStation from "@/app/components/homeStation";
import { tag, user_info } from "@prisma/client";
import Tags from "@/app/components/tags";
import { DisplayTag } from "../../data/definitions";

export default function ProfileInfo({ user, areaName, tags, displayTags }: { user: user_info, areaName: string, tags: tag[], displayTags: DisplayTag[] }) {
    return (
        <div className="flex flex-row items-center px-4 pb-4">
            <ProfilePicture user={user} />
            <div className="flex flex-col mr-3 justify-center gap-1 ">
                <h4 className="text-black pb-1 mb-1">{user.role}</h4>

                {/* Star of Life icon placeholder - using Cross as approximation */}
                <div className="flex flex-row mr-3">
                    <UserRoleIcon user={user} tags={tags} />
                    <div className="flex flex-col mr-3">
                        <h3 className=" text-black ">{user.first_name}</h3>
                        <h3 className=" text-black">{user.last_name}</h3>
                    </div>
                </div>

                <HomeStation areaName={areaName || ""} ></HomeStation>

                <Tags tags={displayTags} ></Tags>
            </div>
        </div>
    );
}