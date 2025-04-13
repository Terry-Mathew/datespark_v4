import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import UserProfile from "@/components/profile/UserProfile";
import SubscriptionManager from "@/components/subscription/SubscriptionManager";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Settings = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container py-16">
        <h1 className="text-3xl font-bold mb-8">Account Settings</h1>
        
        <Tabs defaultValue="profile" className="max-w-2xl mx-auto">
          <TabsList className="mb-8">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="subscription">Subscription</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile">
            <UserProfile />
          </TabsContent>
          
          <TabsContent value="subscription">
            <SubscriptionManager />
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

export default Settings; 