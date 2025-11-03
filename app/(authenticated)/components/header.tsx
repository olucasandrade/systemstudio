"use client";

import { UserButton } from "@/app/auth/client";
import { ModeToggle } from "@/app/design-system/components/mode-toggle";
import { Button } from "@/app/design-system/components/ui/button";
import { Input } from "@/app/design-system/components/ui/input";
import { ArrowRightIcon, SearchIcon, Menu, Home, Trophy, Users } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { SearchModal } from "./search-modal";
import { AnimatedLink } from "./animated-link";
import Image from "next/image";

export const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60" data-animate="fadeInUp">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-6" data-animate="fadeInLeft">
          <AnimatedLink href="/" className="flex items-center gap-0.5" transitionType="scale">
            <Image src="/systemstudio.png" alt="SystemStudio" width={48} height={48} />
            <span className="font-bold text-lg">SystemStudio</span>
          </AnimatedLink>
          
          <nav className="hidden md:flex items-center gap-6" data-animate="fadeInLeft" style={{ animationDelay: '100ms' }}>
            <AnimatedLink 
              href="/challenges" 
              className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              transitionType="fade"
            >
              <Home className="h-4 w-4" />
              Challenges
            </AnimatedLink>
            <AnimatedLink 
              href="/leaderboard" 
              className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              transitionType="fade"
            >
              <Trophy className="h-4 w-4" />
              Leaderboard
            </AnimatedLink>
            <AnimatedLink 
              href="/community" 
              className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              transitionType="fade"
            >
              <Users className="h-4 w-4" />
              Community
            </AnimatedLink>
          </nav>
        </div>

        <div className="hidden lg:flex flex-1 max-w-2xl mx-8">
          <div className="flex w-full items-center gap-2">
            <div className="relative flex-1">
              <div className="absolute top-px bottom-px left-px flex h-8 w-8 items-center justify-center">
                <SearchIcon className="text-muted-foreground" size={16} />
              </div>
              <Input
                className="h-auto bg-background py-1.5 pr-3 pl-8 text-xs cursor-pointer w-full"
                placeholder="Search challenges..."
                type="text"
                readOnly
                onClick={() => setIsSearchModalOpen(true)}
              />
              <Button
                className="absolute top-px right-px bottom-px h-8 w-8"
                size="icon"
                variant="ghost"
                onClick={() => setIsSearchModalOpen(true)}
              >
                <ArrowRightIcon className="text-muted-foreground" size={16} />
              </Button>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2" data-animate="fadeInRight" style={{ animationDelay: '300ms' }}>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden button-hover"
            onClick={() => setIsSearchModalOpen(true)}
          >
            <SearchIcon className="h-4 w-4" />
          </Button>

          <div className="button-hover">
            <ModeToggle />
          </div>

          <div className="button-hover">
            <UserButton
              appearance={{
                elements: {
                  rootBox: "flex overflow-hidden",
                  userButtonBox: "flex-row-reverse",
                  userButtonOuterIdentifier: "truncate pl-0",
                },
              }}
              showName
            />
          </div>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden button-hover"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Menu className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden border-t bg-background">
          <div className="container px-4 py-4">
            <nav className="flex flex-col gap-4">
              <Link 
                href="/challenges" 
                className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Home className="h-4 w-4" />
                Challenges
              </Link>
              <Link 
                href="/leaderboard" 
                className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Trophy className="h-4 w-4" />
                Leaderboard
              </Link>
              <Link 
                href="/community" 
                className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Users className="h-4 w-4" />
                Community
              </Link>
            </nav>
            
          </div>
        </div>
      )}

      <SearchModal 
        isOpen={isSearchModalOpen} 
        onClose={() => setIsSearchModalOpen(false)} 
      />
    </header>
  );
};