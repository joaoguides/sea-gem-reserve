import { Button } from "@/components/ui/button";
import { Menu, Phone, Search, User, Heart, ShoppingCart } from "lucide-react";
import { useState } from "react";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <a href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center">
              <svg
                viewBox="0 0 120 40"
                fill="none"
                className="h-10 w-auto"
              >
                <path 
                  d="M10 20 L30 8 L50 20 L70 8 L90 20" 
                  stroke="currentColor" 
                  strokeWidth="2.5" 
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-primary"
                />
                <path 
                  d="M10 24 L30 12 L50 24 L70 12 L90 24" 
                  stroke="currentColor" 
                  strokeWidth="1.8" 
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-primary/60"
                  opacity="0.7"
                />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-light tracking-[0.2em] text-foreground uppercase" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', letterSpacing: '0.3em' }}>
                AZURE
              </span>
              <span className="text-[9px] text-muted-foreground tracking-[0.15em] uppercase -mt-0.5" style={{ letterSpacing: '0.25em' }}>
                Yachts Brasil
              </span>
            </div>
          </a>

          {/* Desktop Menu */}
          <div className="hidden items-center gap-8 md:flex">
            <a href="/" className="text-sm font-medium text-foreground transition-colors hover:text-primary">
              Home
            </a>
            <a href="/produtos" className="text-sm font-medium text-foreground transition-colors hover:text-primary">
              Catálogo
            </a>
            <a href="/acessorios" className="text-sm font-medium text-foreground transition-colors hover:text-primary">
              Acessórios
            </a>
            <a href="/blog" className="text-sm font-medium text-foreground transition-colors hover:text-primary">
              Blog
            </a>
            <a href="/agendar-visita" className="text-sm font-medium text-foreground transition-colors hover:text-primary">
              Agendar Visita
            </a>
          </div>

          {/* Desktop Actions */}
          <div className="hidden items-center gap-3 md:flex">
            <Button variant="ghost" size="icon" className="text-foreground" onClick={() => window.location.href = '/favoritos'}>
              <Heart className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-foreground" onClick={() => window.location.href = '/carrinho'}>
              <ShoppingCart className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-foreground" onClick={() => window.location.href = '/conta'}>
              <User className="h-5 w-5" />
            </Button>
            <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
              <Phone className="mr-2 h-4 w-4" />
              Fale Conosco
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="h-6 w-6" />
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="border-t border-border py-4 md:hidden">
            <div className="flex flex-col gap-4">
              <a href="/" className="text-sm font-medium text-foreground">
                Home
              </a>
              <a href="/produtos" className="text-sm font-medium text-foreground">
                Catálogo
              </a>
              <a href="/acessorios" className="text-sm font-medium text-foreground">
                Acessórios
              </a>
              <a href="/favoritos" className="text-sm font-medium text-foreground">
                Favoritos
              </a>
              <a href="/carrinho" className="text-sm font-medium text-foreground">
                Carrinho
              </a>
              <a href="/conta" className="text-sm font-medium text-foreground">
                Minha Conta
              </a>
              <Button className="mt-2 w-full bg-accent text-accent-foreground hover:bg-accent/90">
                <Phone className="mr-2 h-4 w-4" />
                Fale Conosco
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
