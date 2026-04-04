import ResetPasswordEmail from "@/emails/resetPassword";
import { EmailClient } from "@azure/communication-email";
import { render } from "@react-email/components";

const connectionString = process.env.AZURE_COMMUNICATION_CONNECTION_STRING!;

export async function POST(req: Request) {
  const { email, fullName, token } = await req.json();
  console.log("email", email);
  console.log("fullName", fullName);
  console.log("token", token);

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
  console.log("message", message);
  try {
    const poller = await client.beginSend(message);
    console.log("poller", poller);
    const response = await poller.pollUntilDone();
    console.log("response", response);
    return Response.json({ success: true });
  } catch (error) {
    console.log("error", error);
    return Response.json({ error: "Email failed" }, { status: 500 });
  }
}
