import prisma from "@/lib/prisma";

export const socialService = {
  async getAllSocialLinks() {
    return prisma.socialLink.findMany({
      orderBy: { sort_order: "asc" },
    });
  },

  async updateSocialLinks(links: { id?: number, platform: string, url: string, handle?: string, sort_order?: number }[]) {
    return prisma.$transaction(async (tx) => {
      // Get all existing IDs
      const existingLinks = await tx.socialLink.findMany({ select: { id: true } });
      const existingIds = existingLinks.map(l => l.id);
      
      const incomingIds = links.filter(l => l.id).map(l => l.id as number);
      const idsToDelete = existingIds.filter(id => !incomingIds.includes(id));
      
      // Delete removed links
      if (idsToDelete.length > 0) {
        await tx.socialLink.deleteMany({
          where: { id: { in: idsToDelete } }
        });
      }
      
      // Upsert remaining/new links
      const operations = links.map((link, index) => {
        const data = {
          platform: link.platform,
          url: link.url,
          handle: link.handle,
          sort_order: link.sort_order ?? index,
        };
        
        if (link.id) {
          return tx.socialLink.update({
            where: { id: link.id },
            data
          });
        } else {
          return tx.socialLink.create({
            data
          });
        }
      });
      
      return Promise.all(operations);
    });
  },
};
