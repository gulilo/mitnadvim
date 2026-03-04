import { EmailClient } from "@azure/communication-email";

const connectionString = process.env.AZURE_COMMUNICATION_CONNECTION_STRING!;

export async function POST(req: Request) {
  const { email, tempPassword } = await req.json();

  const client = new EmailClient(connectionString);

  const message = {
    senderAddress: "DoNotReply@febafe15-c673-4678-8d8d-8da6c4fa90c3.azurecomm.net",
    content: {
      subject: "test email",
      html: `
        can you see this email?
      `,
    },
    recipients: {
      to: [{ address: email }],
    },
  };

  try {
    const poller = await client.beginSend(message);
    await poller.pollUntilDone();

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: "Email failed" }, { status: 500 });
  }
}