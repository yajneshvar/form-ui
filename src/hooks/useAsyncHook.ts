import { useEffect, useState } from "react";

type Status = "loading" | "success" | "failed";

export function useAsync<T>(cb: () => Promise<T>) {
  const [status, setStatus] = useState<Status>("loading");
  const [result, setResult] = useState<T | null>(null);
  const [error, setError] = useState<any | null>(null);

  useEffect(() => {
    cb()
      .then((outcome) => {
        setResult(outcome);
        setStatus("success");
      })
      .catch((err) => {
        setStatus("failed");
        setError(err);
      });
  }, []);

  return { status, result, error };
}
