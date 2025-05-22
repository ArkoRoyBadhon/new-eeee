import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ImageIcon, Paperclip, Send, Smile } from 'lucide-react';
import React from 'react';

const MessageINput = ({ onSendMessage }) => {
    const [message, setMessage] = useState("")

  const handleSendMessage = () => {
    if (message.trim()) {
      onSendMessage(message)
      setMessage("")
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="p-2 border-t bg-white flex items-end">
      <div className="flex gap-2 p-2">
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

      <div className="flex-1">
        <Input
          placeholder="Write Message"
          className="min-h-[40px]"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>

      <Button className="ml-2" size="icon" onClick={handleSendMessage} disabled={!message.trim()}>
        <Send className="h-5 w-5" />
      </Button>
    </div>
  )
};

export default MessageINput;