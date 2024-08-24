import { motion } from "framer-motion";
/**
 * Backdrop component that displays a semi-transparent overlay on top of other elements. The component is used as a background to pop up modals.
 *
 * @param children - The components to be displayed on top of the backdrop
 * @param onClick - The click handler function
 * @returns The Backdrop component
 */
export function Backdrop({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: (e: React.MouseEvent) => void;
}) {
  return (
    // Motion div component that creates a backdrop overlay
    <motion.div
      // CSS classes for styling the backdrop
      className="fixed top-0 left-0 h-full w-full flex items-center justify-center bg-black bg-opacity-10 overflow-hidden "
      // Click event handler
      onClick={onClick}
      // Transition properties for animating the backdrop
      transition={{ duration: 0.1 }}
      // Initial state properties for animating the backdrop
      initial={{ opacity: 0 }}
      // Animate properties for animating the backdrop
      animate={{ opacity: 1 }}
      // Exit state properties for animating the backdrop
      exit={{ opacity: 0 }}
    >
      {/* Children components to be displayed on top of the backdrop */}
      {children}
    </motion.div>
  );
}
