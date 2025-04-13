
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Search, Users, UserPlus, Send, Image, Smile, PaperclipIcon, VideoIcon } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';

// Mock data for conversations
const conversations = [
  { 
    id: '1', 
    name: 'Emma Wilson', 
    avatar: '', 
    lastMessage: 'Are you still planning to visit Japan next month?', 
    time: '10:23 AM', 
    unread: 2,
    online: true
  },
  { 
    id: '2', 
    name: 'Miguel Santos', 
    avatar: '', 
    lastMessage: 'I found a great hotel in Barcelona!', 
    time: 'Yesterday', 
    unread: 0,
    online: false
  },
  { 
    id: '3', 
    name: 'Olivia Chen', 
    avatar: '', 
    lastMessage: 'The hiking trail was amazing, check out these photos', 
    time: 'Monday', 
    unread: 0,
    online: true
  },
  { 
    id: '4', 
    name: 'Travel Buddies - Paris', 
    avatar: '', 
    lastMessage: 'James: Is anyone free for dinner tonight?', 
    time: '2 days ago', 
    unread: 5,
    isGroup: true,
    members: 6
  },
  { 
    id: '5', 
    name: 'Backpackers Asia', 
    avatar: '', 
    lastMessage: 'Sarah: Has anyone been to Vietnam recently?', 
    time: 'Last week', 
    unread: 0,
    isGroup: true,
    members: 14
  },
];

// Mock messages for selected conversation
const mockMessages = [
  { 
    id: 'm1', 
    senderId: 'other', 
    text: 'Hi there! How's your trip planning going?', 
    time: '10:15 AM'
  },
  { 
    id: 'm2', 
    senderId: 'me', 
    text: 'It's going well! I've booked my flights to Tokyo already.', 
    time: '10:18 AM'
  },
  { 
    id: 'm3', 
    senderId: 'other', 
    text: 'That's great! Are you still planning to visit Kyoto too?', 
    time: '10:20 AM'
  },
  { 
    id: 'm4', 
    senderId: 'me', 
    text: 'Yes, I'll be spending 3 days in Kyoto. Do you have any recommendations for places to stay there?', 
    time: '10:22 AM'
  },
  { 
    id: 'm5', 
    senderId: 'other', 
    text: 'Are you still planning to visit Japan next month?', 
    time: '10:23 AM'
  },
];

const MessagesContent = () => {
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [messages, setMessages] = useState(mockMessages);
  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!messageInput.trim()) return;
    
    // Add new message to the chat
    const newMessage = {
      id: `m${Date.now()}`,
      senderId: 'me',
      text: messageInput,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages([...messages, newMessage]);
    setMessageInput('');
    
    // Simulate response in a real app
    setTimeout(() => {
      const responseMessage = {
        id: `m${Date.now() + 1}`,
        senderId: 'other',
        text: 'Thanks for the update! I'll send you some recommendations soon.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      setMessages(prev => [...prev, responseMessage]);
    }, 2000);
  };

  const filteredConversations = conversations.filter(convo => 
    convo.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-[calc(80vh-8rem)] flex flex-col md:flex-row">
      {/* Conversations Sidebar */}
      <div className={`w-full md:w-1/3 lg:w-1/4 border-r border-border ${selectedChat ? 'hidden md:block' : ''}`}>
        <div className="p-4 h-full flex flex-col">
          <div className="mb-4">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="search"
                placeholder="Search messages..."
                className="pl-10 w-full bg-secondary/50"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Tabs defaultValue="all">
              <TabsList className="grid w-full grid-cols-3 mb-4">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="direct">Direct</TabsTrigger>
                <TabsTrigger value="groups">Groups</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="mt-0">
                <ScrollArea className="h-[calc(80vh-15rem)]">
                  <div className="space-y-1">
                    {filteredConversations.map((chat) => (
                      <Button
                        key={chat.id}
                        variant="ghost"
                        className={`w-full justify-start h-auto py-2 px-2 ${
                          selectedChat === chat.id ? 'bg-secondary' : ''
                        }`}
                        onClick={() => setSelectedChat(chat.id)}
                      >
                        <div className="flex items-center w-full">
                          <div className="relative">
                            <Avatar className="h-10 w-10 mr-3">
                              {chat.avatar ? (
                                <AvatarImage src={chat.avatar} alt={chat.name} />
                              ) : (
                                <AvatarFallback className={chat.isGroup ? "bg-secondary text-primary" : "bg-primary/10 text-primary"}>
                                  {chat.isGroup ? <Users className="h-4 w-4" /> : chat.name.charAt(0)}
                                </AvatarFallback>
                              )}
                            </Avatar>
                            {chat.online && !chat.isGroup && (
                              <span className="absolute bottom-0 right-2 h-3 w-3 rounded-full bg-green-500 border-2 border-white"></span>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-center">
                              <p className="font-medium text-sm truncate">{chat.name}</p>
                              <span className="text-xs text-muted-foreground whitespace-nowrap">{chat.time}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <p className="text-xs text-muted-foreground truncate">
                                {chat.lastMessage}
                              </p>
                              {chat.unread > 0 && (
                                <Badge className="ml-1 h-5 min-w-5 flex items-center justify-center rounded-full px-1.5">{chat.unread}</Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>
              
              <TabsContent value="direct" className="mt-0">
                <ScrollArea className="h-[calc(80vh-15rem)]">
                  <div className="space-y-1">
                    {filteredConversations
                      .filter(chat => !chat.isGroup)
                      .map((chat) => (
                        <Button
                          key={chat.id}
                          variant="ghost"
                          className={`w-full justify-start h-auto py-2 px-2 ${
                            selectedChat === chat.id ? 'bg-secondary' : ''
                          }`}
                          onClick={() => setSelectedChat(chat.id)}
                        >
                          <div className="flex items-center w-full">
                            <div className="relative">
                              <Avatar className="h-10 w-10 mr-3">
                                {chat.avatar ? (
                                  <AvatarImage src={chat.avatar} alt={chat.name} />
                                ) : (
                                  <AvatarFallback className="bg-primary/10 text-primary">
                                    {chat.name.charAt(0)}
                                  </AvatarFallback>
                                )}
                              </Avatar>
                              {chat.online && (
                                <span className="absolute bottom-0 right-2 h-3 w-3 rounded-full bg-green-500 border-2 border-white"></span>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-center">
                                <p className="font-medium text-sm truncate">{chat.name}</p>
                                <span className="text-xs text-muted-foreground whitespace-nowrap">{chat.time}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <p className="text-xs text-muted-foreground truncate">
                                  {chat.lastMessage}
                                </p>
                                {chat.unread > 0 && (
                                  <Badge className="ml-1 h-5 min-w-5 flex items-center justify-center rounded-full px-1.5">{chat.unread}</Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </Button>
                      ))}
                  </div>
                </ScrollArea>
              </TabsContent>
              
              <TabsContent value="groups" className="mt-0">
                <ScrollArea className="h-[calc(80vh-15rem)]">
                  <div className="space-y-1">
                    {filteredConversations
                      .filter(chat => chat.isGroup)
                      .map((chat) => (
                        <Button
                          key={chat.id}
                          variant="ghost"
                          className={`w-full justify-start h-auto py-2 px-2 ${
                            selectedChat === chat.id ? 'bg-secondary' : ''
                          }`}
                          onClick={() => setSelectedChat(chat.id)}
                        >
                          <div className="flex items-center w-full">
                            <Avatar className="h-10 w-10 mr-3">
                              <AvatarFallback className="bg-secondary text-primary">
                                <Users className="h-4 w-4" />
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-center">
                                <div className="flex items-center">
                                  <p className="font-medium text-sm truncate">{chat.name}</p>
                                  <Badge variant="outline" className="ml-2 h-5 text-xs">
                                    {chat.members} members
                                  </Badge>
                                </div>
                                <span className="text-xs text-muted-foreground whitespace-nowrap">{chat.time}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <p className="text-xs text-muted-foreground truncate">
                                  {chat.lastMessage}
                                </p>
                                {chat.unread > 0 && (
                                  <Badge className="ml-1 h-5 min-w-5 flex items-center justify-center rounded-full px-1.5">{chat.unread}</Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </Button>
                      ))}
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="mt-auto">
            <Button className="w-full" variant="outline" onClick={() => toast.info('New message feature coming soon!')}>
              <UserPlus className="mr-2 h-4 w-4" />
              New Message
            </Button>
          </div>
        </div>
      </div>
      
      {/* Chat Area */}
      <div className={`flex-1 flex flex-col h-full ${!selectedChat ? 'hidden md:flex' : ''}`}>
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <div className="p-3 border-b border-border flex justify-between items-center">
              <div className="flex items-center">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="mr-2 md:hidden" 
                  onClick={() => setSelectedChat(null)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="m15 18-6-6 6-6"/></svg>
                </Button>
                <Avatar className="h-9 w-9 mr-2">
                  <AvatarFallback className="bg-primary/10 text-primary">
                    E
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-sm">Emma Wilson</p>
                  <p className="text-xs text-muted-foreground">Online</p>
                </div>
              </div>
              <div className="flex">
                <Button variant="ghost" size="icon" onClick={() => toast.info('Video call feature coming soon!')}>
                  <VideoIcon className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => toast.info('More options coming soon!')}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
                </Button>
              </div>
            </div>
            
            {/* Messages Display */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.senderId === 'me' ? 'justify-end' : 'justify-start'}`}
                  >
                    {message.senderId !== 'me' && (
                      <Avatar className="h-8 w-8 mr-2 mt-1 flex-shrink-0">
                        <AvatarFallback className="bg-primary/10 text-primary">
                          E
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div className="max-w-[75%]">
                      <div
                        className={`rounded-2xl px-4 py-2 text-sm ${
                          message.senderId === 'me'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-secondary text-secondary-foreground'
                        }`}
                      >
                        {message.text}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1 flex justify-end">
                        {message.time}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            
            {/* Message Input */}
            <div className="border-t border-border p-3">
              <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="icon" 
                  className="text-muted-foreground"
                  onClick={() => toast.info('File upload coming soon!')}
                >
                  <PaperclipIcon className="h-5 w-5" />
                </Button>
                <div className="relative flex-1">
                  <Input
                    placeholder="Type a message..."
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    className="pl-3 pr-10 bg-secondary/50"
                  />
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="icon" 
                    className="absolute right-0 top-0 text-muted-foreground h-full"
                    onClick={() => toast.info('Emoji picker coming soon!')}
                  >
                    <Smile className="h-5 w-5" />
                  </Button>
                </div>
                <Button type="submit" size="icon" className="bg-primary hover:bg-primary/90">
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center p-6">
              <div className="bg-primary/10 p-4 rounded-full inline-block mb-4">
                <MessageSquare className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Your Messages</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Connect with other travelers and share your experiences
              </p>
              <Button className="bg-primary hover:bg-primary/90" onClick={() => toast.info('Start a conversation feature coming soon!')}>
                Start a conversation
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagesContent;
