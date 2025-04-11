import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Globe, MapPin, Users, Mail, Calendar } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative py-24 overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1488085061387-422e29b40080?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1031&q=80')] bg-cover bg-center opacity-20"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-background/50 to-background"></div>
          
          <div className="container-custom relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <Badge variant="outline" className="mb-4 px-3 py-1 border-primary text-primary">
                Our Story
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                About NomadJourney
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8">
                Inspiring authentic travel experiences and connecting explorers from around the world
              </p>
            </div>
          </div>
        </section>
        
        {/* Our Mission */}
        <section className="py-16">
          <div className="container-custom">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
                <p className="text-lg text-muted-foreground mb-6">
                  At NomadJourney, we believe travel is more than just visiting new places — it's about creating meaningful connections, understanding different cultures, and growing as individuals.
                </p>
                <p className="text-lg text-muted-foreground mb-6">
                  Our mission is to inspire and empower travelers to explore the world authentically, responsibly, and with purpose. We're dedicated to providing a platform where travel enthusiasts can find inspiration, share experiences, and connect with like-minded explorers.
                </p>
                <div className="flex flex-wrap gap-4 mt-8">
                  <Button variant="default" className="bg-primary">
                    <Users className="mr-2 h-5 w-5" /> Join Our Community
                  </Button>
                  <Button variant="outline" className="border-primary text-primary">
                    <Mail className="mr-2 h-5 w-5" /> Contact Us
                  </Button>
                </div>
              </div>
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1522199710521-72d69614c702?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1172&q=80" 
                  alt="Team planning travel routes"
                  className="rounded-lg shadow-xl"
                />
                <div className="absolute -bottom-6 -right-6 bg-background p-4 rounded-lg shadow-lg border border-border hidden md:block">
                  <div className="flex items-center gap-3">
                    <Globe className="h-10 w-10 text-primary" />
                    <div>
                      <p className="font-bold">50+ Countries</p>
                      <p className="text-sm text-muted-foreground">Covered in our guides</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Our Story */}
        <section className="py-16 bg-muted/30">
          <div className="container-custom">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Our Story</h2>
              <p className="text-lg text-muted-foreground">
                From a small travel blog to a thriving global community
              </p>
            </div>
            
            <div className="space-y-12">
              <Card className="overflow-hidden border-none shadow-md">
                <CardContent className="p-0">
                  <div className="grid grid-cols-1 md:grid-cols-12">
                    <div className="md:col-span-4 bg-primary/10 p-8 flex flex-col justify-center">
                      <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/20 text-primary">
                        <Calendar className="h-6 w-6" />
                      </div>
                      <h3 className="text-xl font-bold mb-2">2018</h3>
                      <p className="font-medium">The Beginning</p>
                    </div>
                    <div className="md:col-span-8 p-8">
                      <p className="text-muted-foreground">
                        NomadJourney started as a personal travel blog by our founder, Alex Chen. After traveling to 30 countries, Alex wanted to share authentic travel experiences that went beyond typical tourist attractions. The blog quickly gained a following of travelers seeking authentic cultural experiences.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="overflow-hidden border-none shadow-md">
                <CardContent className="p-0">
                  <div className="grid grid-cols-1 md:grid-cols-12">
                    <div className="md:col-span-4 bg-primary/10 p-8 flex flex-col justify-center">
                      <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/20 text-primary">
                        <Calendar className="h-6 w-6" />
                      </div>
                      <h3 className="text-xl font-bold mb-2">2020</h3>
                      <p className="font-medium">Community Growth</p>
                    </div>
                    <div className="md:col-span-8 p-8">
                      <p className="text-muted-foreground">
                        As the blog grew, we noticed travelers were using our comment section to connect with each other. This inspired us to launch a dedicated community platform where travelers could find companions, share tips, and organize meetups. Despite the pandemic, our online community thrived as travelers supported each other during a challenging time.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="overflow-hidden border-none shadow-md">
                <CardContent className="p-0">
                  <div className="grid grid-cols-1 md:grid-cols-12">
                    <div className="md:col-span-4 bg-primary/10 p-8 flex flex-col justify-center">
                      <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/20 text-primary">
                        <Calendar className="h-6 w-6" />
                      </div>
                      <h3 className="text-xl font-bold mb-2">Today</h3>
                      <p className="font-medium">Global Community</p>
                    </div>
                    <div className="md:col-span-8 p-8">
                      <p className="text-muted-foreground">
                        Today, NomadJourney has evolved into a comprehensive travel platform with over 500,000 members worldwide. We're proud to offer curated destination guides, a thriving community forum, and tools to help travelers connect with like-minded explorers. Our mission remains the same: to inspire authentic travel experiences that create lasting connections.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        
        {/* Team Section */}
        <section className="py-16">
          <div className="container-custom">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Meet Our Team</h2>
              <p className="text-lg text-muted-foreground">
                The passionate travel enthusiasts behind NomadJourney
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  name: "Alex Chen",
                  role: "Founder & CEO",
                  image: "https://i.pravatar.cc/300?img=11",
                  location: "Bangkok, Thailand"
                },
                {
                  name: "Maya Johnson",
                  role: "Head of Content",
                  image: "https://i.pravatar.cc/300?img=5",
                  location: "Barcelona, Spain"
                },
                {
                  name: "David Kim",
                  role: "Community Manager",
                  image: "https://i.pravatar.cc/300?img=12",
                  location: "Lisbon, Portugal"
                },
                {
                  name: "Sophia Nguyen",
                  role: "Destination Expert",
                  image: "https://i.pravatar.cc/300?img=9",
                  location: "Bali, Indonesia"
                }
              ].map((member, index) => (
                <Card key={index} className="overflow-hidden border-none shadow-md hover:-translate-y-1 transition-all duration-300">
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <div className="mb-4 h-28 w-28 overflow-hidden rounded-full border-4 border-primary/20">
                      <img 
                        src={member.image} 
                        alt={member.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                    <p className="text-primary font-medium mb-3">{member.role}</p>
                    <div className="flex items-center justify-center text-sm text-muted-foreground">
                      <MapPin className="h-3 w-3 mr-1" />
                      <span>{member.location}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;
