import emailjs from "@emailjs/browser";

const SERVICE_ID = "service_6ickkl5";
const TEMPLATE_ID = "template_jk1c8zq";
const PUBLIC_KEY = "H2_nCQcSrYXYztoor";

export const sendTimerCompleteEmail = async (
  todoText: string,
  _mode: string,
) => {
  try {
    const { supabase } = await import("./supabase");
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user?.email) return;

    await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      {
        to_name: user.email.split("@")[0],
        to_email: user.email,
        title: todoText,
        scheduled_at: new Date().toLocaleTimeString(),
        message: `Your timer for "${todoText}" has completed!`,
      },
      PUBLIC_KEY,
    );

    console.log("✅ Timer complete email sent!");
  } catch (error) {
    console.error("Failed to send timer email:", error);
  }
};

export const sendActivityReminderEmail = async (
  email: string | undefined,
  title: string,
  scheduledAt: string,
) => {
  try {
    // If no email passed, resolve it from the currently signed-in user
    if (!email) {
      const { supabase } = await import("./supabase");
      const {
        data: { user },
      } = await supabase.auth.getUser();
      email = user?.email;
    }

    if (!email) return;

    await emailjs.send(SERVICE_ID, TEMPLATE_ID, {
  to_name: email.split('@')[0],
  to_email: email,        // ← this sends to the logged in user's email
  title,
  scheduled_at: new Date(scheduledAt).toLocaleTimeString(),
  message: `Your activity "${title}" is due now!`,
  name: email.split('@')[0],
}, PUBLIC_KEY
    );

    console.log("✅ Reminder email sent!");
  } catch (error) {
    console.error("Failed to send reminder email:", error);
  }
};
