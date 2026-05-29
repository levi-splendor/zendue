import { useEffect } from "react";
import { supabase } from "../lib/supabase";
import { sendActivityReminderEmail } from "../lib/email";

export const useActivityNotifier = (userId: string | undefined) => {
  useEffect(() => {
    if (!userId) return;

    const interval = setInterval(async () => {
      const now = new Date().toISOString();
      console.log("Checking activities at:", now);

      const { data: activities, error } = await supabase
        .from("activities")
        .select("*")
        .eq("user_id", userId)
        .eq("notified", false)
        .lte("scheduled_at", now);

      console.log("Found activities:", activities, "Error:", error);

      if (error) console.error("Notifier error:", error);
      if (!activities?.length) return;

      const {
        data: { user },
      } = await supabase.auth.getUser();

      activities.forEach(async (activity) => {
        console.log("Triggering notification for:", activity.title);

        // 1. In-app alert
        alert(`⏰ Reminder: ${activity.title}`);

        // 2. Play sound
        const audio = new Audio("/notification.mp3");
        audio.play().catch(console.error);

        // 3. Send email
        console.log("Sending email to current signed-in user");
        await sendActivityReminderEmail(
          undefined,
          activity.title,
          activity.scheduled_at,
        );

        // 4. Mark as notified
        await supabase
          .from("activities")
          .update({ notified: true })
          .eq("id", activity.id);
      });
    }, 5000); // every 5 seconds

    return () => clearInterval(interval);
  }, [userId]);
};
