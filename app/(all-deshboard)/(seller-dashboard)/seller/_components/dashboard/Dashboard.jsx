import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ShoppingCart, Package, User, MessageSquare } from "lucide-react";
import Image from "next/image";

export default function Dashboard() {
  return (
    <Card className="p-6 shadow-[0_0_15px_2px_rgba(0,0,0,0.1)]">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-20">
        {/* Profile cards - left side */}
        <div className="flex flex-col gap-6">
          {/* Profile info card */}
          <Card className="shadow-[0_0_15px_2px_rgba(0,0,0,0.1)] py-0">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full overflow-hidden">
                  <Image
                    src="/assets/NavIcone.png"
                    alt="Profile"
                    width={56}
                    height={56}
                    className="w-full h-full object-cover border-4 border-stone-200 rounded-full"
                  />
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-lg">Hussain ahmad</h3>
                  <p className="text-sm text-[#555]">Trade OK</p>
                </div>
              </div>

              <div className="mt-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-[#555]">
                    Complete your Profile:
                  </span>
                  <span className="text-[16px] font-medium text-stone-900">
                    47%
                  </span>
                </div>
                <Progress
                  value={47}
                  className="h-3.5 bg-gray-200 [&>div]:bg-[#DFB547]"
                />
              </div>

              <div className="mt-6 space-y-2 text-[#555]">
                <div className="flex justify-between text-sm">
                  <span>1. Personal info:</span>
                  <span className="text-[16px] font-medium text-stone-900">
                    10%
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>2. Business info:</span>
                  <span className="text-[16px] font-medium text-stone-900">
                    12%
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>3. Store setup:</span>
                  <span className="text-[16px] font-medium text-stone-900">
                    20%
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>4. 1st product upload:</span>
                  <span className="text-[16px] font-medium text-stone-900">
                    5%
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>5. Upgrade plan:</span>
                  <span className="text-[16px] font-medium text-stone-900">
                    No
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Trade OK card */}
          <Card className="shadow-[0_0_15px_2px_rgba(0,0,0,0.1)] bg-[#FDF5E5] py-0">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-lg">Trade OK</h3>
                <div className="w-auto h-7 bg-[#001C44] px-[4px] pb-1 rounded">
                  <Image
                    src="/assets/verifyIcon.png"
                    alt="Trade badge"
                    width={24}
                    height={24}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-6">
                Lorem ipsum dolor sit amet consectetur. Rutrum non cursus nunc
                convallis sem.
              </p>

              <button className="bg-[#DFB547] hover:bg-[#DFB547]/90 font-bold rounded-full text-sm px-6 py-2 transition-colors">
                Upgrade Now
              </button>
            </CardContent>
          </Card>
        </div>

        {/* Todo list cards - right side */}
        <div className="lg:col-span-2">
          <h2 className="text-xl font-bold mb-2">To Do List</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Unread Message */}
            <Card className="shadow-[0_0_15px_2px_rgba(0,0,0,0.1)] bg-[#001C44] text-white">
              <CardContent>
                <div className="flex justify-between items-center">
                  <span className="text-3xl font-bold">5</span>
                  <div className="flex items-center">
                    <Avatar>
                      <AvatarImage
                        src="https://github.com/shadcn.png"
                        alt="@shadcn"
                      />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <div className="flex justify-center items-center bg-[#DFB547] rounded-full size-8 -ml-2 relative text-[18px] font-bold text-stone-800">
                      5
                    </div>
                  </div>
                </div>
               <hr className="mt-3 mb-2 border-[#fff]/40" />
                <p className="font-semibold text-[#fff]/80">Unread Message</p>
              </CardContent>
            </Card>
            <Card className="shadow-[0_0_15px_2px_rgba(0,0,0,0.1)] bg-[#001C44] text-white">
              <CardContent>
                <div className="flex justify-between items-center">
                  <span className="text-3xl font-bold">3</span>
                  <div className="bg-amber-400 rounded-full p-2">
                  <User className="w-5 h-5 text-[#001C44]" />
                </div>
                </div>
                <hr className="mt-3 mb-2 border-[#fff]/40" />
                <p className="font-semibold text-[#fff]/80">New Customer</p>
              </CardContent>
            </Card>
               <Card className="shadow-[0_0_15px_2px_rgba(0,0,0,0.1)] bg-[#001C44] text-white">
              <CardContent>
                <div className="flex justify-between items-center">
                  <span className="text-3xl font-bold">5</span>
                  <div className="bg-amber-400 rounded-full p-2">
                  <User className="w-5 h-5 text-[#001C44]" />
                </div>
                </div>
                <hr className="mt-3 mb-2 border-[#fff]/40" />
                <p className="font-semibold text-[#fff]/80">New Customer</p>
              </CardContent>
            </Card>
               <Card className="shadow-[0_0_15px_2px_rgba(0,0,0,0.1)] bg-[#001C44] text-white">
              <CardContent>
                <div className="flex justify-between items-center">
                  <span className="text-3xl font-bold">3</span>
                  <div className="bg-amber-400 rounded-full p-2">
                  <User className="w-5 h-5 text-[#001C44]" />
                </div>
                </div>
                <hr className="mt-3 mb-2 border-[#fff]/40" />
                <p className="font-semibold text-[#fff]/80">New Customer</p>
              </CardContent>
            </Card>
               <Card className="shadow-[0_0_15px_2px_rgba(0,0,0,0.1)] bg-[#001C44] text-white">
              <CardContent>
                <div className="flex justify-between items-center">
                  <span className="text-3xl font-bold">36</span>
                  <div className="bg-amber-400 rounded-full p-2">
                  <User className="w-5 h-5 text-[#001C44]" />
                </div>
                </div>
                <hr className="mt-3 mb-2 border-[#fff]/40" />
                <p className="font-semibold text-[#fff]/80">New Customer</p>
              </CardContent>
            </Card>
               <Card className="shadow-[0_0_15px_2px_rgba(0,0,0,0.1)] bg-[#001C44] text-white">
              <CardContent>
                <div className="flex justify-between items-center">
                  <span className="text-3xl font-bold">4</span>
                  <div className="bg-amber-400 rounded-full p-2">
                  <User className="w-5 h-5 text-[#001C44]" />
                </div>
                </div>
                <hr className="mt-3 mb-2 border-[#fff]/40" />
                <p className="font-semibold text-[#fff]/80">New Customer</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Card>
  );
}
