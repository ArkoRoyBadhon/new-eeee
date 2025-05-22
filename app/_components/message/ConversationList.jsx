const ConversationList = ({
  conversations,
  activeConversation,
  onSelectConversation,
}) => {
  <div className="flex-1 overflow-y-auto">
    {conversations.map((conversation) => (
      <div
        key={conversation.id}
        className={`flex items-center gap-3 p-3 hover:bg-gray-100 cursor-pointer ${
          activeConversation === conversation.id ? "bg-gray-100" : ""
        }`}
        onClick={() => onSelectConversation(conversation.id)}
      >
        <Avatar className="h-10 w-10">
          <img
            src={conversation.avatar || "/placeholder.svg"}
            alt={conversation.name}
          />
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-center">
            <p className="font-medium truncate">{conversation.name}</p>
            <span className="text-xs text-gray-500">
              {conversation.timestamp}
            </span>
          </div>
          <p className="text-sm text-gray-500 truncate">
            {conversation.lastMessage}
          </p>
        </div>
        {conversation.unread && (
          <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
        )}
      </div>
    ))}
  </div>;
};

export default ConversationList;
