import prisma from "@/lib/prisma";
import Header from "@/components/public/Header";
import Footer from "@/components/public/Footer";
import BackToTop from "@/components/public/BackToTop";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const socialLinks = await prisma.socialLink.findMany({
    orderBy: { sort_order: "asc" },
  });

  return (
    <>
      <Header />
      {children}
      <Footer socialLinks={socialLinks} />
      <BackToTop />
    </>
  );
}
