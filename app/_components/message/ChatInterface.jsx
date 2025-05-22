"use client";
import InquiryCard from "@/app/_components/InquiryCard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { inquiryApi } from "@/lib/api";
import { useSocketContext } from "@/provider/SocketCotextProvider";
import { FormatMessageTime } from "@/utils/TimeFormatter";
import {
  ChevronLeft,
  ImageIcon,
  Paperclip,
  Search,
  SendHorizontal,
  Smile,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

const contacts = [
  {
    id: "1",
    name: "Kristin Watson",
    phone: "+86 241 5456 7890",
    time: "10:28",
    avatar: "/placeholder.svg?height=40&width=40",
    unread: true,
  },
  {
    id: "2",
    name: "Kathryn",
    phone: "+86 241 5456 7890",
    time: "Yesterday",
    avatar: "/placeholder.svg?height=40&width=40",
    unread: false,
  },
  {
    id: "3",
    name: "Albert Flores",
    phone: "+86 241 5456 7890",
    time: "10:30am",
    avatar: "/placeholder.svg?height=40&width=40",
    unread: true,
  },
  {
    id: "4",
    name: "Jenny Wilson",
    phone: "+86 241 5456 7890",
    time: "10:30am",
    avatar: "/placeholder.svg?height=40&width=40",
    unread: true,
  },
  {
    id: "5",
    name: "Robert Fox",
    phone: "+86 241 5456 7890",
    time: "10:30am",
    avatar: "/placeholder.svg?height=40&width=40",
    unread: true,
  },
];

const ChatInterface = () => {
  const [message, setMessage] = useState("");
  const [allConversations, setAllConversations] = useState([]);
  const [singleConversation, setSingleConversation] = useState(null);
  const [loading, setLoading] = useState(true);
  const inquiryId = useSearchParams().get("inquiry");
  const router = useRouter();
  const { socket } = useSocketContext();
  const [activeContact, setActiveContact] = useState();
  const messagesContainerRef = useRef(null);
  const messagesEndRef = useRef(null);
  const [showChat, setShowChat] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [filteredConversations, setFilteredConversations] = useState("");
  const [activeUsers, setActiveUsers] = useState([]);
  const [newConversation, setNewConversation] = useState([]);
  const { token, user } = useSelector((state) => state.auth);
  const [activeRoute, setActiveRoute] = useState("");
  const scrollToBottom = useCallback(() => {
    if (messagesContainerRef.current && messagesEndRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesEndRef.current.offsetTop,
        behavior: "smooth",
      });
    }
  }, []);

  const fetchMessage = useCallback(async () => {
    try {
      if (inquiryId) {
        const response = await inquiryApi.getInquiries(inquiryId, token);
        setSingleConversation(response);
        setActiveContact(response?._id);
        setShowChat(true);
      }
    } catch (erroractiveRoute) {
      console.error("Error fetching conversations:", error);
    }
  }, [inquiryId]);

  const handleSendMessage = async () => {
    if (message && user?._id && inquiryId) {
      try {
        const inquiryData = {
          senderId: user._id,
          senderType: user.role,
          text: message.trim(),
        };

        const response = await inquiryApi.addMessage(inquiryId, inquiryData);

        if (response) {
          setMessage("");
          setSingleConversation((prev) => ({
            ...prev,
            messages: [
              ...prev.messages,
              {
                ...inquiryData,
                _id: Date.now().toString(),
                createdAt: new Date(),
              },
            ],
          }));
          scrollToBottom();
        }
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  useEffect(() => {
    if (!socket) return;

    const handleConnect = () => {
      console.log("Reconnected to socket");
      fetchMessage();
    };

    socket.on("new_message", handleConnect);

    socket.on("active_users", (activeUsers) => {
      console.log("Active Users:", activeUsers);
      setActiveUsers(activeUsers);
    });

    return () => {
      socket.off("new_message", handleConnect);
      socket.off("active_users", handleConnect);
    };
  }, [socket, fetchMessage]);

  const fetchData = async () => {
    try {
      setLoading(true);

      if (user?._id) {
        let conversationsResponse = [];
        if (user?.role === "buyer") {
          conversationsResponse = await inquiryApi.getInquiriesbyBuyer(
            user._id
          );
        } else if (user?.role === "seller") {
          conversationsResponse = await inquiryApi.getInquiriesbySeller(
            user._id
          );
        }
        setAllConversations(conversationsResponse);
        if (!inquiryId) {
          setActiveContact(conversationsResponse[0]?._id);
        }

        if (!inquiryId && conversationsResponse.length > 0) {
          router.replace(
            `/${user?.role}/message?inquiry=${conversationsResponse[0]._id}`
          );
          return;
        }
      }

      if (inquiryId) {
        await fetchMessage();
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // }, [user?._id, inquiryId, router, fetchMessage]);
  }, [user?._id, inquiryId, router, activeRoute]);

  useEffect(() => {
    scrollToBottom();
  }, [singleConversation?.messages]);

  useEffect(() => {
    const updatedConversations = allConversations.map((conversation) => {
      if (user?.role === "buyer") {
        if (activeUsers.includes(conversation?.sellerId?._id)) {
          return {
            ...conversation,
            activeStatus: true,
          };
        }
      } else if (user?.role === "seller") {
        if (activeUsers.includes(conversation?.buyerId?._id)) {
          return {
            ...conversation,
            activeStatus: true,
          };
        }
      }
      return conversation;
    });

    setNewConversation(updatedConversations);
    console.log("updatedConversations", updatedConversations);
  }, [allConversations, activeUsers]);

  const handleContactSelect = (contact) => {
    setActiveContact(contact?._id);
    router.replace(`/${user?.role}/message?inquiry=${contact._id}`);
    setActiveRoute(contact?._id);
    setShowChat(true);
  };

  const handleBackToContacts = () => {
    setShowChat(false);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchValue(value);

    const filteredConversations = newConversation.filter((conversation) => {
      const firstName = conversation.buyerId
        ? conversation.buyerId.firstName.toLowerCase()
        : conversation.sellerId.firstName.toLowerCase();
      const lastName = conversation.buyerId
        ? conversation.buyerId.lastName.toLowerCase()
        : conversation.sellerId.lastName.toLowerCase();

      return firstName.includes(value) || lastName.includes(value);
    });
    setFilteredConversations(filteredConversations);
  };

  // if (loading || !singleConversation) {
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 ">
      <div className="my-[32px] rounded-[16px] overflow-hidden custom-shadow">
        {showChat && (
          <div className="md:hidden p-4 bg-[#001C44] text-white flex items-center sticky top-0 ">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 mr-2 text-white hover:bg-white/10"
              onClick={handleBackToContacts}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <div className="flex flex-col">
              <div
                className={`font-medium capitalize ${
                  singleConversation ? "block" : "hidden"
                }`}
              >
                {user?.role === "buyer"
                  ? `${singleConversation?.buyerId?.firstName} ${singleConversation?.buyerId?.lastName}`
                  : `${singleConversation?.buyerId?.firstName} ${singleConversation?.buyerId?.lastName}`}
              </div>
              <div className="text-xs text-gray-300">
                {FormatMessageTime(singleConversation?.createdAt)}
              </div>
            </div>
          </div>
        )}

        {/* Desktop header - shown only on desktop */}
        <div className="hidden md:block">
          <div className="p-4 border-b bg-[#001C44] text-white flex items-center  h-[70px]">
            <div className="font-bold text-[18px] custom-text w-80">
              Message
            </div>
            <div className="flex flex-col">
              <div
                className={`font-medium text-[16px] custom-text capitalize ${
                  singleConversation ? "block" : "hidden"
                }`}
              >
                {user?.role === "buyer"
                  ? `${singleConversation?.sellerId?.firstName} ${singleConversation?.sellerId?.lastName}`
                  : `${singleConversation?.buyerId?.firstName} ${singleConversation?.buyerId?.lastName}`}
              </div>
              <div className="text-white text-[14px] custom-text">
                {FormatMessageTime(singleConversation?.updatedAt)}
              </div>
            </div>
          </div>
        </div>

        {/* Main content area */}
        <div className="flex flex-col md:flex-row h-[calc(100vh-160px)] md:h-[calc(100vh-200px)] bg-white">
          {/* Left sidebar */}
          <div
            className={`w-full md:w-80 border-r bg-white flex flex-col ${
              showChat ? "hidden md:flex" : "flex"
            }`}
          >
            <div className="p-4 relative">
              <Input
                type="text"
                value={searchValue}
                onChange={handleSearchChange}
                placeholder="Search..."
                className="w-full pl-10"
              />
              <Search className="absolute left-7 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>

            <Tabs defaultValue="all" className="w-full flex-1 flex flex-col">
              <TabsList className="grid w-full grid-cols-2 bg-transparent px-4">
                <TabsTrigger
                  value="all"
                  className="data-[state=active]:bg-[#DFB547] data-[state=active]:font-bold h-10 px-4 text-sm rounded-full"
                >
                  All
                </TabsTrigger>
                <TabsTrigger
                  value="unread"
                  className="data-[state=active]:bg-[#DFB547] data-[state=active]:font-bold h-10 px-4 text-sm rounded-full"
                >
                  Unread
                </TabsTrigger>
              </TabsList>
              <TabsContent value="all" className="flex-1 overflow-auto">
                <div
                  style={{
                    WebkitOverflowScrolling: "touch",
                  }}
                  className="mt-4 overflow-y-auto "
                >
                  {/* {(searchValue ? filteredConversations : allConversations).map( */}
                  {(searchValue ? filteredConversations : newConversation).map(
                    (contact) => (
                      <div
                        key={contact?._id}
                        className={`flex items-center p-3 cursor-pointer rounded-[10px] mx-[16px] ${
                          activeContact === contact?._id
                            ? "bg-[#001C44] text-white"
                            : "hover:bg-gray-100"
                        }`}
                        onClick={() => handleContactSelect(contact)}
                      >
                        <div className="relative">
                          <Image
                            src={
                              contact?.productId?.image[0] || "/img/apple.webp"
                            }
                            alt={contact?.productId?.title || ""}
                            width={40}
                            height={40}
                            className="rounded-full"
                          />
                          {contact.activeStatus && (
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full"></div>
                          )}
                        </div>
                        <div className="ml-3 flex-1">
                          <div className="flex justify-between">
                            <div className="font-medium text-sm">
                              {user?.role === "buyer"
                                ? `${contact?.sellerId?.firstName} ${contact?.sellerId?.lastName}`
                                : `${contact?.buyerId?.firstName} ${contact?.buyerId?.lastName}`}
                            </div>
                            <div
                              className={`${
                                activeContact === contact?._id
                                  ? "text-white"
                                  : ""
                              }`}
                            >
                              {FormatMessageTime(contact?.updatedAt)}
                            </div>
                          </div>
                          <div
                            className={`text-xs flex justify-between ${
                              activeContact === contact?._id ? "text-white" : ""
                            }`}
                          >
                            <p className="">
                              {user?.role === "buyer"
                                ? contact?.sellerId?.phoneNumber
                                : contact?.buyerId?.phoneNumber}
                            </p>

                            <p className="bg-[#ffffffcb] text-black px-2 rounded-full">
                              {
                                contact?.messages?.filter(
                                  (message) =>
                                    !message?.isRead &&
                                    message?.senderType !== user?.role
                                ).length
                              }
                            </p>
                          </div>
                        </div>
                      </div>
                    )
                  )}

                  {searchValue && filteredConversations.length === 0 && (
                    <div className="p-4 text-center text-gray-500">
                      No conversations found
                    </div>
                  )}
                  {!searchValue && allConversations.length === 0 && (
                    <div className="p-4 text-center text-gray-500">
                      No conversations found
                    </div>
                  )}
                </div>
              </TabsContent>
              <TabsContent value="unread" className="p-4 text-center">
                <div className="text-gray-500 font-medium">
                  No unread messages
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right chat area */}
          {singleConversation ? (
            <div
              className={`flex-1 flex flex-col bg-white relative ${
                !showChat ? "hidden md:flex" : "flex"
              }`}
            >
              {/* Messages area */}
              <div
                ref={messagesContainerRef}
                style={{
                  WebkitOverflowScrolling: "touch",
                }}
                className="flex-1 p-4 overflow-y-auto max-h-[calc(100vh-280px)] md:h-full "
              >
                {singleConversation?.messages?.map((msg) => {
                  const isCurrentUser =
                    (msg.senderType === "buyer" && user?.role === "buyer") ||
                    (msg.senderType === "seller" && user?.role === "seller");

                  return (
                    <div
                      key={msg?._id}
                      className={`flex mb-4 ${
                        isCurrentUser ? "justify-end" : "justify-start"
                      }`}
                    >
                      {!isCurrentUser && (
                        <Avatar className="h-8 w-8 mr-2">
                          <AvatarImage
                            src="https://github.com/shadcn.png"
                            alt="@shadcn"
                          />
                          <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                      )}

                      <div className="flex flex-col max-w-[80%]">
                        <div
                          className={`flex gap-2 text-xs text-gray-500 mb-1 ${
                            isCurrentUser ? "justify-end" : "justify-start"
                          }`}
                        >
                          <p>
                            {isCurrentUser
                              ? "You"
                              : msg.senderType === "buyer"
                              ? singleConversation?.buyerId?.firstName
                              : singleConversation?.sellerId?.firstName}
                          </p>
                          <p>{FormatMessageTime(msg?.createdAt)}</p>
                        </div>

                        {msg.inquiry ? (
                          <InquiryCard
                            headingTitle="Inquiry"
                            singleConversation={singleConversation}
                          />
                        ) : (
                          <div
                            className={`p-3 rounded-lg ${
                              isCurrentUser
                                ? "bg-blue-500 text-white rounded-tr-none"
                                : "bg-gray-200 text-gray-800 rounded-tl-none"
                            }`}
                          >
                            <p>{msg?.text}</p>
                          </div>
                        )}
                      </div>

                      {isCurrentUser && !msg.inquiry && (
                        <Avatar className="h-8 w-8 ml-2">
                          <AvatarImage
                            src="https://github.com/shadcn.png"
                            alt="@shadcn"
                          />
                          <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {user?.role === "buyer" && (
                <div className="p-4 w-full flex justify-center gap-1 md:gap-4 absolute bottom-[110px] left-1/2 transform -translate-x-1/2 z-10">
                  <Button
                    variant="outline"
                    className="hover:bg-[#DFB547] rounded-full px-6 py-[6px] custom- shadow text-[13px] custom-text"
                  >
                    Rate supplier
                  </Button>
                  <Link href={`/order-request?id=${singleConversation?._id}`}>
                    <Button className="text-black bg-white hover:bg-[#DFB547] rounded-full px-6 py-[6px] custom- shadow text-[13px] custom-text">
                      Send order request
                    </Button>
                  </Link>
                </div>
              )}

              {/* Message input area */}
              <div className="p-4 border-t bg-white sticky bottom-0">
                <div className="flex gap-2 mb-2">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Paperclip className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <ImageIcon className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Smile className="h-5 w-5" />
                  </Button>
                </div>

                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Write Message..."
                    className="flex-1 min-h-[40px] py-3 px-4 rounded-xl shadow-sm"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                  />
                  <Button
                    className="bg-black hover:bg-gray-800 rounded-xl px-4 py-3 min-h-[40px]"
                    onClick={handleSendMessage}
                    disabled={!message.trim()}
                  >
                    <SendHorizontal className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className={`${!showChat ? "hidden md:flex" : "flex"}`}>
              <div className="p-4 text-center text-gray-500">
                Select a conversation
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
