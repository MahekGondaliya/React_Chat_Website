import { useAppstore } from "@/store";
import { HOST, LOGOUT } from "@/utils/constants";
import { getcolor } from "@/lib/utils";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "@radix-ui/react-tooltip";
import { FiEdit2 } from "react-icons/fi";
import { IoPowerSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { apiclient } from "@/lib/api-client";

function ProfileInfo() {
  const navigate = useNavigate();
  const { userInfo, setUserInfo } = useAppstore();

  const logOut = async () => {
    try {
      const res = await apiclient.post(LOGOUT, {}, { withCredentials: true });

      if (res.status === 200) {
        setUserInfo(null);
        navigate("/auth");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="absolute bottom-0 h-16 flex items-center justify-between px-10 w-full bg-[#2a2b33] ">
      <div className="flex gap-3 items-center justify-center ">
        <div className="w-12 h-12 relative ">
          <Avatar className="h-12 w-12  rounded-full overflow-hidden ">
            {userInfo.image ? (
              <AvatarImage
                src={`${HOST}/${userInfo.image}`}
                alt="Profile"
                className="object-cover w-full h-full bg-black"
              />
            ) : (
              <div
                className={`uppercase h-12 w-12  text-lg border-[1px] flex items-center justify-center rounded-full ${getcolor(
                  userInfo.color
                )}`}
              >
                {userInfo.firstName
                  ? userInfo.firstName.charAt(0)
                  : userInfo.email.charAt(0)}
              </div>
            )}
          </Avatar>
        </div>
        <div>
          {userInfo.firstname && userInfo.lastname
            ? `${userInfo.firstname}-${userInfo.lastname}`
            : " "}
        </div>
      </div>
      <div className="flex gap-5 ">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <FiEdit2
                className="text-purple-500 text-xl font-medium "
                onClick={() => {
                  navigate("/profile");
                }}
              ></FiEdit2>
            </TooltipTrigger>
            <TooltipContent className="border-none bg-[#1c1b16] text-white">
              <p>Edit Profile</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <IoPowerSharp
                className="text-red-500 text-xl font-medium "
                onClick={logOut}
              ></IoPowerSharp>
            </TooltipTrigger>
            <TooltipContent className="border-none bg-[#1c1b16] text-white">
              <p>LogOut</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}

export default ProfileInfo;
