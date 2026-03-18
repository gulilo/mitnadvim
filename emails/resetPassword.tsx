import {
    Body,
    Button,
    Container,
    Head,
    Hr,
    Html,
    Img,
    Link,
    Section,
    Text,
    Tailwind,
    Heading,
} from "@react-email/components";
import * as React from "react";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export interface CreateUserEmailProps {
    name: string;
    setPasswordUrl: string;
}

export default function CreateUserEmail({
    name,
    setPasswordUrl,
}: CreateUserEmailProps) {
    return (
        <Html lang="he" dir="rtl">
            <Head />
            <Tailwind>
                <Body className="bg-white font-sans text-base leading-relaxed text-black">
                    <Container className="mx-auto max-w-[600px] px-6 py-10">
                        <Section className="pb-8 text-center">
                            <Img
                                src={`${baseUrl}/MDA-Dan-Logo.png`}
                                alt="מד״א מרחב דן"
                                width={302}
                                height={189}
                                className="block max-w-full h-auto mx-auto"
                            />
                        </Section>

                        <Section className="px-6">
                            <Heading as="h1" className="mb-3 text-base">שלום {name},</Heading >

                            <Text className="whitespace-pre-line">
                                {`התקבלה בקשה לאיפוס הסיסמא שלך למערכת השיבוצים של מד״א מרחב דן.
                                 כדי ליצור סיסמא חדשה יש להיכנס לקישור הבא:`}
                            </Text>

                            <Section className="my-6 text-center">
                                <Button
                                    href={setPasswordUrl}
                                    className="rounded-lg border border-[#E31837] bg-[#E31837] px-8 py-3 text-lg font-bold text-white no-underline"
                                >
                                    איפוס סיסמא
                                </Button>
                            </Section>

                            <Text className="mb-3 text-base whitespace-pre-line">
                                {`הקישור תקף לזמן מוגבל וישמש אותך ליצירת סיסמה חדשה לחשבון.
אם לא ביקשת לאפס את הסיסמה, ניתן להתעלם ממייל זה.`}
                            </Text>
                        </Section>
                        {/* 
              <Text className="mb-3 text-base">
                אם נתקלת בבעיה בהתחברות או שיש שאלה כלשהי – אפשר פשוט{" "}
                <Link href={contactUrl} className="text-black underline">ליצור קשר</Link> עם{" "}
                <Link href={contactUrl} className="text-black underline">רכזי השיבוצים</Link> שישמחו
                לעזור.
              </Text>

              <Section className="my-6 text-center">
                <Button
                  href={contactUrl}
                  className="rounded-lg border border-[#2c2c2c] bg-[#25d366] px-6 py-3 text-base font-bold text-[#2c2c2c] no-underline"
                >
                  יצירת קשר עם הרכז שלך
                </Button>
              </Section> */}

                        <Section className="px-6">
                            <Hr className="my-8 border-gray-200" />

                            <Text className="text-base whitespace-pre-line">
                                {`בברכה,`}
                            </Text>
                            <Text className="text-base whitespace-pre-line">
                                {`אחראי שיבוצים
                                מד״א מרחב דן`}
                            </Text>
                        </Section>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
}
