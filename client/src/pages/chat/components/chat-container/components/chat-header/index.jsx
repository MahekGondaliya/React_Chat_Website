import { useAppstore } from "@/store";
import { RiCloseFill } from "react-icons/ri";
import { HOST } from "@/utils/constants";
import { getcolor } from "@/lib/utils";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";

function ChatHeader() {
  const { closeChat, selectedChatData, selectedChatType } = useAppstore();

  return (
    <div className="h-[10vh] border-b-2 border-[#2f303b]  flex items-center justify-between px-20">
      <div className="flex gap-5 items-center justify-between w-full ">
        <div className="flex gap-3 items-center justify-center ">
          <div className="w-12 h-12 relative ">
            <Avatar className="h-12 w-12  rounded-full overflow-hidden ">
              {selectedChatData.image ? (
                <AvatarImage
                  src={`${HOST}/${selectedChatData.image}`}
                  alt="Profile"
                  className="object-cover w-full h-full bg-black"
                />
              ) : (
                <div
                  className={`uppercase h-12 w-12  text-lg border-[1px] flex items-center justify-center rounded-full ${getcolor(
                    selectedChatData.color
                  )}`}
                >
                  {selectedChatData.firstname
                    ? selectedChatData.firstname.charAt(0)
                    : selectedChatData.email.charAt(0)}
                </div>
              )}
            </Avatar>
          </div>
          <div className=" ">
            {selectedChatType === "contact" &&  selectedChatData.firstname ? `${selectedChatData.firstname}   ${selectedChatData.lastname}` : selectedChatData.email}
          </div>
        </div>

        <div className="flex items-center justify-center gap-5 ">
          <button
            className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all "
            onClick={closeChat}
          >
            <RiCloseFill className="text-3xl "></RiCloseFill>
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatHeader;
