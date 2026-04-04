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
            <div className="absolute inset-0 rounded-[28px] bg-primary-400/20 blur-3xl animate-pulse" />
            <img
              src={logoUrl}
              alt="curexal"
              className="relative h-24 w-24 rounded-[28px] shadow-2xl border-4 border-white object-contain p-2 bg-white"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center"
          >
            <h1 className="text-4xl font-extrabold tracking-tighter text-accent-500 mb-2 lowercase">
              curexal
            </h1>
            <div className="w-48 h-1 bg-slate-100 rounded-full overflow-hidden relative">
              <motion.div
                initial={{ left: "-100%" }}
                animate={{ left: "100%" }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                }}
                className="absolute top-0 bottom-0 w-1/2 bg-linear-to-r from-transparent via-primary-400 to-transparent"
              />
            </div>
            <p className="text-[10px] font-bold text-accent-300 mt-6 tracking-[0.4em] uppercase">
              Trust in Care
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
