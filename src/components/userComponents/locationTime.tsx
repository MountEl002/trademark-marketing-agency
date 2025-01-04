"use client";

import React, { useState, useEffect } from "react";

interface LocationData {
  country: string;
  city?: string;
}

const LocationTime = () => {
  const [locationData, setLocationData] = useState<LocationData | null>(null);
  const [currentTime, setCurrentTime] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch location data
    fetch("/api/location")
      .then((res) => res.json())
      .then((data) => {
        setLocationData(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });

    // Set up time update
    const updateTime = () => {
      const time = new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
      setCurrentTime(time);
    };

    updateTime();
    const timer = setInterval(updateTime, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center space-x-2 text-gray-500">
        <div className="animate-ping h-4 w-4 border-2 border-b-transparent border-gray-500 rounded-full border-t-transparent" />
        <span>Loading location...</span>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-4 text-sm text-gray-600">
      <div className="flex items-center space-x-1">
        <span>
          {locationData?.city ? `${locationData.city}, ` : ""}
          {locationData?.country || "Unknown"}
        </span>
      </div>
      <div className="flex items-center space-x-1">
        <span>{currentTime}</span>
      </div>
    </div>
  );
};

export default LocationTime;
