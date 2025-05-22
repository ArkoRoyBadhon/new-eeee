import Image from "next/image";

const ProfileCompletionCard = () => {
  return (
    <div className="max-w-sm mx-auto bg-white rounded-[16px] custom-shadow p-6">
      <div className="flex items-center gap-4 mb-6">
        <div className="relative h-16 w-16">
          <Image
            src="/placeholder.svg?height=64&width=64"
            alt="Profile picture"
            width={64}
            height={64}
            className="rounded-full object-cover"
          />
        </div>
        <div>
          <h2 className="text-xl font-bold">Hussain ahmad</h2>
          <p className="text-gray-500">Trade OK</p>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex justify-between mb-2">
          <span className="text-gray-600">Complete your Profile:</span>
          <span className="font-medium">47%</span>
        </div>
        <div className="h-3 w-full bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-amber-400 rounded-full"
            style={{ width: "47%" }}
          ></div>
        </div>
      </div>

      <div className="flex flex-col gap-[8px]">
        <div className="flex justify-between">
          <span className="text-gray-600">1. Personal info:</span>
          <span className="font-medium">10%</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">2. Business info:</span>
          <span className="font-medium">12%</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">3. Store setup:</span>
          <span className="font-medium">20%</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">4. 1st product upload:</span>
          <span className="font-medium">5%</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">5. Upgrade plan:</span>
          <span className="font-medium">No</span>
        </div>
      </div>
    </div>
  );
};

export default ProfileCompletionCard;
