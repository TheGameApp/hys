"use client";

import { useTranslations, useLocale } from "next-intl";
import { useParams } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { getPostBySlug } from "@/lib/blog";
import { ArrowLeft, Calendar } from "lucide-react";

const tagColors: Record<string, "default" | "secondary" | "info" | "success"> = {
  announcement: "secondary",
  company: "info",
  tech: "success",
  guide: "default",
  architecture: "info",
};

function renderMarkdown(content: string) {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let inList = false;
  let listItems: React.ReactNode[] = [];
  let inBlockquote = false;
  let blockquoteText: string[] = [];
  let inTable = false;
  let tableRows: string[][] = [];

  function flushList() {
    if (listItems.length > 0) {
      elements.push(
        <ul key={`list-${elements.length}`} className="space-y-2 my-4 ml-6 list-disc">
          {listItems}
        </ul>
      );
      listItems = [];
      inList = false;
    }
  }

  function flushBlockquote() {
    if (blockquoteText.length > 0) {
      elements.push(
        <blockquote
          key={`bq-${elements.length}`}
          className="border-l-4 border-primary pl-4 py-2 my-6 text-muted-foreground italic"
        >
          {blockquoteText.join(" ")}
        </blockquote>
      );
      blockquoteText = [];
      inBlockquote = false;
    }
  }

  function flushTable() {
    if (tableRows.length > 0) {
      const header = tableRows[0];
      const body = tableRows.slice(1);
      elements.push(
        <div key={`table-${elements.length}`} className="my-6 overflow-x-auto">
          <table className="w-full text-sm border border-border rounded-lg">
            <thead>
              <tr className="bg-muted">
                {header.map((cell, i) => (
                  <th key={i} className="text-left px-4 py-2 font-semibold border-b border-border">
                    {cell}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {body.map((row, ri) => (
                <tr key={ri} className="border-b border-border last:border-0">
                  {row.map((cell, ci) => (
                    <td key={ci} className="px-4 py-2">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      tableRows = [];
      inTable = false;
    }
  }

  function formatInline(text: string): React.ReactNode {
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={i}>{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.startsWith("|") && line.endsWith("|")) {
      if (!inBlockquote && !inList) {
        flushList();
        flushBlockquote();
        const cells = line
          .split("|")
          .slice(1, -1)
          .map((c) => c.trim());
        if (cells.every((c) => /^[-:]+$/.test(c))) {
          continue;
        }
        inTable = true;
        tableRows.push(cells);
        continue;
      }
    } else if (inTable) {
      flushTable();
    }

    if (line.startsWith("> ")) {
      flushList();
      inBlockquote = true;
      blockquoteText.push(line.slice(2).replace(/^"|"$/g, ""));
      continue;
    } else if (inBlockquote) {
      flushBlockquote();
    }

    if (line.startsWith("- ") || line.startsWith("  - ")) {
      inList = true;
      const text = line.replace(/^\s*- /, "");
      listItems.push(
        <li key={`li-${listItems.length}`} className="text-muted-foreground">
          {formatInline(text)}
        </li>
      );
      continue;
    } else if (inList) {
      flushList();
    }

    if (line.startsWith("### ")) {
      elements.push(
        <h3 key={`h3-${i}`} className="text-lg font-bold mt-8 mb-3">
          {line.slice(4)}
        </h3>
      );
    } else if (line.startsWith("## ")) {
      elements.push(
        <h2 key={`h2-${i}`} className="text-xl md:text-2xl font-bold mt-10 mb-4">
          {line.slice(3)}
        </h2>
      );
    } else if (line.trim() === "") {
      continue;
    } else {
      const numberedMatch = line.match(/^(\d+)\.\s+(.+)$/);
      if (numberedMatch) {
        elements.push(
          <p key={`p-${i}`} className="text-muted-foreground leading-relaxed my-2 ml-4">
            <span className="font-semibold text-foreground">{numberedMatch[1]}.</span>{" "}
            {formatInline(numberedMatch[2])}
          </p>
        );
      } else {
        elements.push(
          <p key={`p-${i}`} className="text-muted-foreground leading-relaxed my-3">
            {formatInline(line)}
          </p>
        );
      }
    }
  }

  flushList();
  flushBlockquote();
  flushTable();

  return elements;
}

export default function BlogPostPage() {
  const t = useTranslations("blog");
  const locale = useLocale();
  const params = useParams();
  const slug = params.slug as string;
  const post = getPostBySlug(slug);

  if (!post) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen flex items-center justify-center bg-background pt-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">{t("not_found")}</h1>
            <Link href="/blog">
              <Button variant="outline">{t("back_to_blog")}</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const title = locale === "es" ? post.title_es : post.title_en;
  const content = locale === "es" ? post.content_es : post.content_en;
  const formattedDate = new Date(post.date).toLocaleDateString(
    locale === "es" ? "es-ES" : "en-US",
    { year: "numeric", month: "long", day: "numeric" }
  );

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background pt-16">
        <article className="py-16 px-6 md:px-8">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
              >
                <ArrowLeft className="h-4 w-4" />
                {t("back_to_blog")}
              </Link>

              <div className="flex flex-wrap gap-2 mb-4">
                {post.tags.map((tag) => (
                  <Badge key={tag} variant={tagColors[tag] || "default"} className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>

              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{title}</h1>

              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-4 mb-10 pb-8 border-b border-border">
                <Calendar className="h-4 w-4" />
                {t("published_on")} {formattedDate}
              </div>

              <div className="prose-custom">{renderMarkdown(content)}</div>

              <div className="mt-12 pt-8 border-t border-border">
                <Link href="/blog">
                  <Button variant="outline" className="gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    {t("back_to_blog")}
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
