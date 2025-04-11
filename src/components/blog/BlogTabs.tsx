
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TabProps {
  id: string;
  label: string;
  content: React.ReactNode;
}

interface BlogTabsProps {
  tabs: TabProps[];
  defaultTab: string;
  className?: string;
}

const BlogTabs = ({ tabs, defaultTab, className }: BlogTabsProps) => {
  return (
    <Tabs defaultValue={defaultTab} className={className}>
      <TabsList>
        {tabs.map((tab) => (
          <TabsTrigger key={tab.id} value={tab.id}>
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      
      {tabs.map((tab) => (
        <TabsContent key={tab.id} value={tab.id}>
          {tab.content}
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default BlogTabs;
