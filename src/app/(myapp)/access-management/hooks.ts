import { useEffect, useState } from "react";
import { getApplications } from "./applications";
import type { Application } from "./types";

export const useAccessManagement = () => {
  const [applications, setApplications] = useState<Application[]>([]);

  useEffect(() => {
    getApplications().then((applications) => {
      setApplications(applications);
    });
  }, []);

  //i want to return the list map applciatipns code, name to value and label
  const applicationsOptions = applications.map((application) => ({
    value: application.code,
    label: application.name,
  }));

  return { applications, applicationsOptions };
};
