"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface CodeBlockProps {
  code: string;
  language?: string;
  className?: string;
}

export function CodeBlock({ code, language = "typescript", className }: CodeBlockProps) {
  const lines = code.split("\n");

  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-[#0a0a0a] p-6 font-mono text-sm overflow-x-auto",
        className
      )}
    >
      <div className="flex items-center gap-2 mb-4">
        <div className="w-3 h-3 rounded-full bg-red-500" />
        <div className="w-3 h-3 rounded-full bg-yellow-500" />
        <div className="w-3 h-3 rounded-full bg-green-500" />
        <span className="ml-2 text-xs text-zinc-500">{language}</span>
      </div>
      <pre className="text-zinc-300">
        {lines.map((line, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, filter: "blur(4px)", y: 4 }}
            whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }}
            transition={{
              duration: 0.6,
              delay: i * 0.08,
              ease: [0.22, 1, 0.36, 1],
            }}
            viewport={{ once: true }}
          >
            <span className="text-zinc-600 mr-4 select-none">
              {String(i + 1).padStart(2, " ")}
            </span>
            <span
              dangerouslySetInnerHTML={{
                __html: highlightSyntax(line),
              }}
            />
          </motion.div>
        ))}
      </pre>
    </div>
  );
}

function highlightSyntax(line: string): string {
  return line
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(
      /\b(import|from|const|await|async|export|default|function|return|type|interface)\b/g,
      '<span style="color:#c084fc">$1</span>'
    )
    .replace(
      /\b(true|false|null|undefined)\b/g,
      '<span style="color:#f59e0b">$1</span>'
    )
    .replace(
      /'([^']*)'/g,
      '\'<span style="color:#34d399">$1</span>\''
    )
    .replace(
      /\/\/.*/g,
      '<span style="color:#525252">$&</span>'
    );
}
