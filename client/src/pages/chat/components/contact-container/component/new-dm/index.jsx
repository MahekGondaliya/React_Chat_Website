import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FaPlus } from "react-icons/fa";
import { useState } from "react";
import { HOST } from "@/utils/constants";
import { getcolor } from "@/lib/utils";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { animationDefaultOptions } from "@/lib/utils";
import Lottie from "react-lottie";
import { apiclient } from "@/lib/api-client";
import { SEARCH_CONTACT } from "@/utils/constants";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAppstore } from "@/store";

function NewDm() {
  const { setSelectedChatData, setSelectedChatType } = useAppstore();
  const [openNewContactModal, setOpenNewContactModal] = useState(false);
  const [searchedContact, setSearchedContact] = useState([]);

  const SearchContact = async (searchTerm) => {
    try {
      if (searchTerm.length > 0) {
        const res = await apiclient.post(
          SEARCH_CONTACT,
          { searchTerm },
          { withCredentials: true }
        );

        if (res.status === 200 && res.data.contact) {
          setSearchedContact(res.data.contact);
        }
      } else {
        setSearchedContact([]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const selectedContact = (contact) => {
    setSelectedChatType("contact");
    setSelectedChatData(contact);
    setOpenNewContactModal(false);
    setSearchedContact([]);
  };

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <FaPlus
              className="text-neutral-400 font-light text-opacity-90 text-start hover:text-neutral-100 cursor-pointer transition-all duration-300 "
              onClick={() => setOpenNewContactModal(true)}
            />
          </TooltipTrigger>
          <TooltipContent className="bg-[#1c1b1e] border-none mb-2 p-3 text-white">
            <p>Select New Contact</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <Dialog open={openNewContactModal} onOpenChange={setOpenNewContactModal}>
        <DialogContent className="bg-[#181920] border-none text-white w-[400px] h-[400px] flex flex-col">
          <DialogHeader>
            <DialogTitle> Please Select Contact... </DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <div>
            <Input
              className="rounded-lg p-6 bg-[#2c2e3b] border-none"
              placeholder="Search Contact"
              onChange={(e) => SearchContact(e.target.value)}
            />
          </div>
          {searchedContact.length > 0 && (
            <ScrollArea className="h-[250px] ">
              <div className="flex flex-col gap-5">
                {searchedContact.map((contact) => (
                  <div
                    className="flex gap-3 cursor-pointer items-center"
                    key={contact._id}
                    onClick={() => selectedContact(contact)}
                  >
                    <div className="w-12 h-12 relative ">
                      <Avatar className="h-12 w-12  rounded-full overflow-hidden ">
                        {contact.image ? (
                          <AvatarImage
                            src={`${HOST}/${contact.image}`}
                            alt="Profile"
                            className="object-cover w-full h-full bg-black rounded-full"
                          />
                        ) : (
                          <div
                            className={`uppercase h-12 w-12  text-lg border-[1px] flex items-center justify-center rounded-full ${getcolor(
                              contact.color
                            )}`}
                          >
                            {contact.firstname
                              ? contact.firstname.charAt(0)
                              : contact.email.charAt(0)}
                          </div>
                        )}
                      </Avatar>
                    </div>
                    <div className="flex flex-col">
                      <span>
                        {contact.firstname && contact.lastname
                          ? `${contact.firstname}-${contact.lastname}`
                          : `${contact.email}`}
                      </span>
                      <span className="text-xs">{contact.email}</span>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
          {searchedContact.length <= 0 && (
            <div className="flex-1 mt-5  md:mt-0 md:flex flex-col justify-center items-center transition-all duration-1000">
              <Lottie
                isClickToPauseDisabled={true}
                options={animationDefaultOptions}
                height={100}
                width={100}
              />
              <div className="text-opacity-80 text-white flex flex-col gap-5 items-center mt-5 lg:text-2xl text-xl transition-all duration-300 text-center">
                <h3 className="poppins-medium">
                  Hi <span className="text-purple-500">! </span>Search
                  <span className="text-purple-500"> New</span> Contact.
                </h3>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

export default NewDm;
