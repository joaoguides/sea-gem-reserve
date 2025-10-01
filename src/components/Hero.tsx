import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";
import heroImage from "@/assets/hero-boat.jpg";
import SearchBar from "./SearchBar";

const Hero = () => {
  return (
    <section className="relative min-h-[90vh] w-full overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Luxury yacht at sunset"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/60 via-primary/40 to-background/90" />
      </div>

      {/* Content */}
      <div className="container relative mx-auto px-4 pt-24 pb-12">
        <div className="flex flex-col items-center text-center">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-accent/20 px-4 py-2 backdrop-blur-sm animate-fade-in">
            <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
            <span className="text-sm font-medium text-background">Lançamentos 2025</span>
          </div>

          {/* Heading */}
          <h1 className="mb-6 max-w-4xl text-5xl font-bold leading-tight text-background md:text-7xl lg:text-8xl animate-slide-up">
            Navegue Seus
            <span className="block text-gradient-sunset">Sonhos</span>
          </h1>

          {/* Description */}
          <p className="mb-8 max-w-2xl text-lg text-background/90 md:text-xl animate-fade-in">
            Descubra as mais exclusivas lanchas, veleiros e jet skis. Reserve com sinal,
            agende seu test drive e navegue com segurança e estilo.
          </p>

          {/* CTA Buttons */}
          <div className="mb-12 flex flex-col gap-4 sm:flex-row animate-fade-in">
            <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-luxury">
              Ver Modelos
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-background/40 bg-background/10 text-background backdrop-blur-sm hover:bg-background/20"
            >
              <Play className="mr-2 h-5 w-5" />
              Assistir Vídeo
            </Button>
          </div>

          {/* Search Bar */}
          <div className="w-full max-w-4xl animate-slide-up">
            <SearchBar />
          </div>

          {/* Trust Indicators */}
          <div className="mt-16 grid grid-cols-2 gap-6 md:grid-cols-4 animate-fade-in">
            <div className="flex flex-col items-center">
              <span className="text-3xl font-bold text-background md:text-4xl">500+</span>
              <span className="text-sm text-background/80">Embarcações Vendidas</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-3xl font-bold text-background md:text-4xl">15+</span>
              <span className="text-sm text-background/80">Anos de Mercado</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-3xl font-bold text-background md:text-4xl">98%</span>
              <span className="text-sm text-background/80">Satisfação</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-3xl font-bold text-background md:text-4xl">24/7</span>
              <span className="text-sm text-background/80">Suporte</span>
            </div>
          </div>
        </div>
      </div>

      {/* Wave Divider */}
      <div className="absolute bottom-0 left-0 w-full">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full"
        >
          <path
            d="M0 0L60 10C120 20 240 40 360 46.7C480 53 600 47 720 43.3C840 40 960 40 1080 46.7C1200 53 1320 67 1380 73.3L1440 80V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V0Z"
            fill="hsl(var(--background))"
          />
        </svg>
      </div>
    </section>
  );
};

export default Hero;
