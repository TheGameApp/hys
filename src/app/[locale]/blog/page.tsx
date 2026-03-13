"use client";

import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { getAllPosts } from "@/lib/blog";
import { ArrowRight, Calendar } from "lucide-react";

const tagColors: Record<string, "default" | "secondary" | "info" | "success"> = {
  announcement: "secondary",
  company: "info",
  tech: "success",
  guide: "default",
  architecture: "info",
};

export default function BlogPage() {
  const t = useTranslations("blog");
  const locale = useLocale();
  const posts = getAllPosts();

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background pt-16">
        <section className="py-20 px-6 md:px-8">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <span className="text-sm font-medium text-primary tracking-wider uppercase">
                Blog
              </span>
              <h1 className="text-4xl md:text-5xl font-bold mt-4 tracking-tight">
                {t("title")} <span className="text-primary">{t("title_accent")}</span>
              </h1>
              <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
                {t("subtitle")}
              </p>
            </motion.div>

            <div className="space-y-6">
              {posts.map((post, i) => {
                const title = locale === "es" ? post.title_es : post.title_en;
                const excerpt = locale === "es" ? post.excerpt_es : post.excerpt_en;
                const formattedDate = new Date(post.date).toLocaleDateString(
                  locale === "es" ? "es-ES" : "en-US",
                  { year: "numeric", month: "long", day: "numeric" }
                );

                return (
                  <motion.div
                    key={post.slug}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, duration: 0.5 }}
                  >
                    <Link href={`/blog/${post.slug}`}>
                      <Card className="p-6 md:p-8 hover:border-primary/50 transition-colors group cursor-pointer">
                        <div className="flex flex-wrap gap-2 mb-3">
                          {post.tags.map((tag) => (
                            <Badge key={tag} variant={tagColors[tag] || "default"} className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <h2 className="text-xl md:text-2xl font-bold group-hover:text-primary transition-colors">
                          {title}
                        </h2>
                        <p className="text-muted-foreground mt-2 leading-relaxed">{excerpt}</p>
                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            {formattedDate}
                          </div>
                          <span className="flex items-center gap-1 text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                            {t("read_more")} <ArrowRight className="h-4 w-4" />
                          </span>
                        </div>
                      </Card>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
