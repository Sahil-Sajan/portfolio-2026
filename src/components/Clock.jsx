import { useState, useEffect } from "react";

function Clock() {
  const getIndiaTime = () =>
    new Date().toLocaleTimeString([], {
      timeZone: "Asia/Kolkata", // Forces India Standard Time (IST)
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

  const [time, setTime] = useState(getIndiaTime());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(getIndiaTime());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return <span style={{paddingLeft: "9px"}}>{time}</span>;
}

export default Clock;
