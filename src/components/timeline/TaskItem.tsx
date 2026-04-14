import { motion } from 'framer-motion';

interface Props {
  id: string;
  text: string;
  checked: boolean;
  onToggle: () => void;
  accentColor: string;
}

export function TaskItem({ text, checked, onToggle, accentColor }: Props) {
  return (
    <motion.label
      layout
      className="group flex cursor-pointer items-start gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-slate-50 dark:hover:bg-white/[0.02]"
    >
      <motion.div
        className="relative mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-md border-2 transition-colors"
        style={{
          borderColor: checked ? accentColor : undefined,
          backgroundColor: checked ? accentColor : 'transparent',
        }}
        animate={checked ? { scale: [1, 1.2, 1] } : { scale: 1 }}
        transition={{ duration: 0.3, type: 'spring', stiffness: 300 }}
      >
        <input
          type="checkbox"
          checked={checked}
          onChange={onToggle}
          className="sr-only"
        />
        {checked && (
          <motion.svg
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            xmlns="http://www.w3.org/2000/svg"
            className="h-3.5 w-3.5 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={3}
          >
            <motion.path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            />
          </motion.svg>
        )}
        {!checked && (
          <div className="h-full w-full rounded-[4px] border-slate-300 dark:border-slate-600" />
        )}
      </motion.div>
      <motion.span
        className="text-sm leading-relaxed text-slate-700 transition-colors dark:text-slate-300"
        animate={{
          opacity: checked ? 0.5 : 1,
          textDecoration: checked ? 'line-through' : 'none',
        }}
        transition={{ duration: 0.2 }}
      >
        {text}
      </motion.span>
    </motion.label>
  );
}
