"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, MessageSquare, Heart, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { saveSettings } from "@/app/features/pulse/redux/engagementSettingsSlice";
import CommentsSettings from "@/app/features/pulse/components/EngagementSettings/CommentsSettings";
import ReactionsSettings from "@/app/features/pulse/components/EngagementSettings/ReactionsSettings";
import GiftsSettings from "@/app/features/pulse/components/EngagementSettings/GiftsSettings";

export function EngagementSettings() {
  const dispatch = useDispatch();
  const { isDirty } = useSelector((state: RootState) => state.engagementSettings);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-[2000px] mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-semibold">Engagement Settings</h1>
          <Button
            onClick={() => dispatch(saveSettings())}
            disabled={!isDirty}
            className="bg-[#FF0000] hover:bg-[#CC0000]"
          >
            <Settings className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>

        <Tabs defaultValue="comments">
          <TabsList>
            <TabsTrigger value="comments" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Comments
            </TabsTrigger>
            <TabsTrigger value="reactions" className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              Reactions
            </TabsTrigger>
            <TabsTrigger value="gifts" className="flex items-center gap-2">
              <Gift className="h-4 w-4" />
              Gifts
            </TabsTrigger>
          </TabsList>

          <div className="mt-6">
            <TabsContent value="comments">
              <CommentsSettings />
            </TabsContent>

            <TabsContent value="reactions">
              <ReactionsSettings />
            </TabsContent>

            <TabsContent value="gifts">
              <GiftsSettings />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}

export default EngagementSettings; 