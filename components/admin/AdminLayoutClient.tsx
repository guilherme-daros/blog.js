"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { AdminHeaderProvider, useAdminHeader } from "@/lib/contexts/AdminHeaderContext";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  FileText,
  Mail,
  Users,
  Share2,
  UserCog,
} from "lucide-react";

export default function AdminLayoutClient({
  children,
  role,
  username,
}: {
  children: React.ReactNode;
  role: string;
  username: string;
}) {
  return (
    <AdminHeaderProvider>
      <AdminLayoutInner role={role} username={username}>
        {children}
      </AdminLayoutInner>
    </AdminHeaderProvider>
  );
}

function AdminLayoutInner({
  children,
  role,
  username,
}: {
  children: React.ReactNode;
  role: string;
  username: string;
}) {
  const pathname = usePathname();
  const { headerData } = useAdminHeader();

  const isLinkActive = (href: string) => {
    return href === "/admin"
      ? pathname === "/admin"
      : pathname.startsWith(href);
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-background text-foreground overflow-hidden">
        <Sidebar className="border-r border-border bg-sidebar" collapsible="none">
          <SidebarHeader className="h-14 border-b border-border flex flex-row items-center justify-center px-6 p-0 shrink-0">
            <Link
              href="/"
              className="font-mono text-sm font-medium text-neutral-950 dark:text-white no-underline tracking-[1.92px] uppercase flex items-center"
            >
              Terminal<span className="text-primary">.</span>admin
            </Link>
          </SidebarHeader>

          <SidebarContent>
            <SidebarGroup className="p-0">
              <SidebarGroupContent>
                <SidebarMenu className="gap-0">
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      isActive={isLinkActive("/admin")}
                      className={cn(
                        "font-mono text-xs uppercase tracking-[1.92px] px-6 py-[10px] h-auto rounded-none transition-all duration-150 text-muted-foreground hover:text-neutral-950 dark:hover:text-white hover:bg-panel data-[active=true]:bg-transparent data-[active=true]:text-primary data-[active=true]:border-r-2 data-[active=true]:border-primary"
                      )}
                    >
                      <Link href="/admin" className="flex items-center gap-3">
                        <LayoutDashboard className="size-4 shrink-0" />
                        <span>Dashboard</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      isActive={isLinkActive("/admin/posts")}
                      className={cn(
                        "font-mono text-xs uppercase tracking-[1.92px] px-6 py-[10px] h-auto rounded-none transition-all duration-150 text-muted-foreground hover:text-neutral-950 dark:hover:text-white hover:bg-panel data-[active=true]:bg-transparent data-[active=true]:text-primary data-[active=true]:border-r-2 data-[active=true]:border-primary"
                      )}
                    >
                      <Link href="/admin/posts" className="flex items-center gap-3">
                        <FileText className="size-4 shrink-0" />
                        <span>Posts</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      isActive={isLinkActive("/admin/messages")}
                      className={cn(
                        "font-mono text-xs uppercase tracking-[1.92px] px-6 py-[10px] h-auto rounded-none transition-all duration-150 text-muted-foreground hover:text-neutral-950 dark:hover:text-white hover:bg-panel data-[active=true]:bg-transparent data-[active=true]:text-primary data-[active=true]:border-r-2 data-[active=true]:border-primary"
                      )}
                    >
                      <Link href="/admin/messages" className="flex items-center gap-3">
                        <Mail className="size-4 shrink-0" />
                        <span>Messages</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      isActive={isLinkActive("/admin/subscribers")}
                      className={cn(
                        "font-mono text-xs uppercase tracking-[1.92px] px-6 py-[10px] h-auto rounded-none transition-all duration-150 text-muted-foreground hover:text-neutral-950 dark:hover:text-white hover:bg-panel data-[active=true]:bg-transparent data-[active=true]:text-primary data-[active=true]:border-r-2 data-[active=true]:border-primary"
                      )}
                    >
                      <Link href="/admin/subscribers" className="flex items-center gap-3">
                        <Users className="size-4 shrink-0" />
                        <span>Subscribers</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      isActive={isLinkActive("/admin/social")}
                      className={cn(
                        "font-mono text-xs uppercase tracking-[1.92px] px-6 py-[10px] h-auto rounded-none transition-all duration-150 text-muted-foreground hover:text-neutral-950 dark:hover:text-white hover:bg-panel data-[active=true]:bg-transparent data-[active=true]:text-primary data-[active=true]:border-r-2 data-[active=true]:border-primary"
                      )}
                    >
                      <Link href="/admin/social" className="flex items-center gap-3">
                        <Share2 className="size-4 shrink-0" />
                        <span>Social Links</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  {role === "admin" && (
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        asChild
                        isActive={isLinkActive("/admin/users")}
                        className={cn(
                          "font-mono text-xs uppercase tracking-[1.92px] px-6 py-[10px] h-auto rounded-none transition-all duration-150 text-muted-foreground hover:text-neutral-950 dark:hover:text-white hover:bg-panel data-[active=true]:bg-transparent data-[active=true]:text-primary data-[active=true]:border-r-2 data-[active=true]:border-primary"
                        )}
                      >
                        <Link href="/admin/users" className="flex items-center gap-3">
                          <UserCog className="size-4 shrink-0" />
                          <span>Users</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="p-0 border-t border-border mt-auto">
            <div className="p-3 px-6 border-b border-border flex items-center gap-2 bg-panel/10">
              <span className="font-mono text-[10px] tracking-[1px] uppercase text-primary border border-[#ff6b00]/30 px-[6px] py-[1px] rounded-[var(--radius)]">
                {role}
              </span>
              <span className="font-mono text-xs text-neutral-950 dark:text-white truncate max-w-[80px]">{username}</span>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="font-mono text-[10px] text-muted-foreground no-underline ml-auto transition-colors duration-150 hover:text-destructive bg-transparent border-none cursor-pointer p-0 text-left"
              >
                Logout
              </button>
            </div>

            <Link
              href="/"
              className="font-mono text-[11px] text-muted-foreground no-underline p-4 px-6 transition-colors duration-150 hover:text-primary"
            >
              ← Back to site
            </Link>
          </SidebarFooter>
        </Sidebar>

        <SidebarInset className="flex-1 flex flex-col min-w-0 max-w-full h-screen max-h-screen overflow-hidden">
          <header className="flex items-center justify-between px-8 max-[1024px]:px-4 h-14 border-b border-border bg-surface shrink-0">
            <div className="flex items-center gap-3">
              <SidebarTrigger />
              <div id="admin-page-title" className="text-xl font-normal text-neutral-950 dark:text-white flex items-center gap-3">
                {headerData.title}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2" id="admin-actions">
                {headerData.actions}
              </div>
              <ThemeToggle />
            </div>
          </header>
          <div className="p-8 max-[1024px]:p-4 flex-1 overflow-y-auto overflow-x-hidden">{children}</div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
