import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

serve(async (req) => {
  const { email, title, scheduledAt } = await req.json();

  const res = await fetch("https://api.mailgun.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${Deno.env.get("RESEND_API_KEY")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "onboarding@resend.dev",
      to: email,
      subject: `⏰ Reminder: ${title}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px;">
          <h2>⏰ Activity Reminder</h2>
          <p>Your activity <strong>${title}</strong> is due now!</p>
          <p>Scheduled at: ${new Date(scheduledAt).toLocaleTimeString()}</p>
          <p>Stay focused — Zendue</p>
        </div>
      `,
    }),
  });

  const data = await res.json();
  return new Response(JSON.stringify(data), { status: 200 });
});