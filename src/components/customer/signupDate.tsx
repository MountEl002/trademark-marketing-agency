"use client";

import React, { useEffect, useState } from "react";
import { format, parseISO } from "date-fns";
import { useAuth } from "@/contexts/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

const SignupDate = () => {
  const [createdAt, setCreatedAt] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const date = parseISO(userDoc.data().createdAt);
          setCreatedAt(format(date, "MMM d, yyyy, h:mm a"));
        }
      }
    };

    fetchUserData();
  }, [user]);

  return <div>{createdAt && <h2>Member since: {createdAt}</h2>}</div>;
};

export default SignupDate;
