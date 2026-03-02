import { useEffect, useState } from "react";
import { AppRoutes } from "./routes";
import { ToastContainer } from "react-toastify";
import { LoadingScreen } from "./components/ui/LoadingScreen";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate initial asset/data loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000); // 2-second minimum for "wow" effect
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <LoadingScreen isLoading={loading} />
      <div
        className={
          loading ? "opacity-0" : "opacity-100 transition-opacity duration-1000"
        }
      >
        <AppRoutes />
      </div>
      <ToastContainer position="top-right" autoClose={5000} />
    </>
  );
}

export default App;
