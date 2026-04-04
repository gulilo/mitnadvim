import ResetPasswordEmail from "@/emails/resetPassword";
import { EmailClient } from "@azure/communication-email";
import { render } from "@react-email/components";

const connectionString = process.env.AZURE_COMMUNICATION_CONNECTION_STRING!;

export async function POST(req: Request) {
  const { email, fullName, token } = await req.json();

  const client = new EmailClient(connectionString);

  const forgotPasswordUrl = `${process.env.NEXT_PUBLIC_APP_URL}/changePassword?token=${token}`;
  const message = {
    senderAddress:
      "DoNotReply@febafe15-c673-4678-8d8d-8da6c4fa90c3.azurecomm.net",
    content: {
      subject: "שחזור סיסמא למערכת השיבוצים של מד״א מרחב דן",
      html: await render(
        ResetPasswordEmail({
          name: fullName,
          setPasswordUrl: forgotPasswordUrl,
        }),
      ),
    },
    recipients: {
      to: [{ address: email }],
    },
  };

  try {
    const poller = await client.beginSend(message);
    const response = await poller.pollUntilDone();
    return response.status === "succeeded" ? Response.json({ success: true }) : Response.json({ error: "Email failed" }, { status: 500 });
  } catch (error) {
    console.log("error", error);
    return Response.json({ error: "Email failed" }, { status: 500 });
  }
}
