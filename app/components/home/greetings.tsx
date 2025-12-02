"use client";

function getCurrentTime(): Date {
  return new Date();
}

function getTimeOfDay(): string {
  const hour = getCurrentTime().getHours();

  if (hour >= 7 && hour < 12) {
    return "בוקר טוב";
  } else if (hour >= 12 && hour < 15) {
    return "צהריים טובים";
  } else if (hour >= 17 && hour < 23) {
    return "ערב טוב";
  } else {
    return "לילה טוב";
  }
}

export default function Greeting({ userName }: { userName: string }) {
  const timeOfDay = getTimeOfDay();

  return (
    <h2>
      {timeOfDay} {userName}
    </h2>
  );
}
