import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import logoUrl from "../../assets/img/logo.jpg";

export const LoadingScreen = ({ isLoading }: { isLoading: boolean }) => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => setShow(false), 800);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.1, filter: "blur(20px)" }}
          transition={{ duration: 0.8 }}
          className="fixed inset-0 z-100 flex flex-col items-center justify-center bg-white"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              duration: 0.5,
              repeat: Infinity,
              repeatType: "reverse",
            }}
            className="relative mb-8"
          >
            <div className="absolute inset-0 rounded-2xl bg-primary-500/20 blur-2xl animate-pulse" />
            <img
              src={logoUrl}
              alt="Curexal"
              className="relative h-20 w-20 rounded-2xl shadow-2xl border border-slate-100"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center"
          >
            <h1 className="text-3xl font-bold tracking-tighter text-slate-900 mb-2">
              CUREXAL
            </h1>
            <div className="w-48 h-1 bg-slate-100 rounded-full overflow-hidden relative">
              <motion.div
                initial={{ left: "-100%" }}
                animate={{ left: "100%" }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                }}
                className="absolute top-0 bottom-0 w-1/2 bg-linear-to-r from-transparent via-primary-600 to-transparent"
              />
            </div>
            <p className="text-xs font-semibold text-slate-400 mt-4 tracking-[0.25em] uppercase">
              Next-Gen Health System
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
