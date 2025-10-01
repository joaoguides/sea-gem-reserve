import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone, Youtube } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-gradient-to-b from-background to-secondary/20">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary-light">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="h-6 w-6 text-primary-foreground"
                >
                  <path d="M2 12L7 17L12 12L17 17L22 12" />
                  <path d="M2 12V6L12 2L22 6V12" />
                </svg>
              </div>
              <span className="text-lg font-bold text-foreground">Luxury Boats</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Há mais de 15 anos oferecendo as melhores embarcações de luxo do mercado.
              Qualidade, confiança e excelência em cada navegação.
            </p>
            <div className="flex gap-2">
              <Button size="icon" variant="outline" className="rounded-full">
                <Facebook className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="outline" className="rounded-full">
                <Instagram className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="outline" className="rounded-full">
                <Youtube className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="outline" className="rounded-full">
                <Linkedin className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-foreground">
              Produtos
            </h3>
            <ul className="space-y-3">
              <li>
                <a href="/produtos?type=lancha" className="text-sm text-muted-foreground transition-colors hover:text-primary">
                  Lanchas
                </a>
              </li>
              <li>
                <a href="/produtos?type=veleiro" className="text-sm text-muted-foreground transition-colors hover:text-primary">
                  Veleiros
                </a>
              </li>
              <li>
                <a href="/produtos?type=jetski" className="text-sm text-muted-foreground transition-colors hover:text-primary">
                  Jet Skis
                </a>
              </li>
              <li>
                <a href="/produtos?status=seminovo" className="text-sm text-muted-foreground transition-colors hover:text-primary">
                  Seminovos
                </a>
              </li>
              <li>
                <a href="/acessorios" className="text-sm text-muted-foreground transition-colors hover:text-primary">
                  Acessórios
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-foreground">
              Suporte
            </h3>
            <ul className="space-y-3">
              <li>
                <a href="/faq" className="text-sm text-muted-foreground transition-colors hover:text-primary">
                  Perguntas Frequentes
                </a>
              </li>
              <li>
                <a href="/politica-de-reserva" className="text-sm text-muted-foreground transition-colors hover:text-primary">
                  Política de Reserva
                </a>
              </li>
              <li>
                <a href="/termos" className="text-sm text-muted-foreground transition-colors hover:text-primary">
                  Termos de Uso
                </a>
              </li>
              <li>
                <a href="#contato" className="text-sm text-muted-foreground transition-colors hover:text-primary">
                  Contato
                </a>
              </li>
              <li>
                <a href="/conta" className="text-sm text-muted-foreground transition-colors hover:text-primary">
                  Minha Conta
                </a>
              </li>
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-foreground">
              Contato
            </h3>
            <ul className="mb-6 space-y-3">
              <li className="flex items-start gap-2 text-sm text-muted-foreground">
                <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                <span>Marina Premium, Av. Atlântica 1000, Rio de Janeiro - RJ</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4 flex-shrink-0 text-primary" />
                <span>(21) 3000-0000</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4 flex-shrink-0 text-primary" />
                <span>contato@luxuryboats.com.br</span>
              </li>
            </ul>

            <div>
              <p className="mb-2 text-sm font-medium text-foreground">Newsletter</p>
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Seu e-mail"
                  className="h-10"
                />
                <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90">
                  Enviar
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-sm text-muted-foreground">
              © 2025 Luxury Boats. Todos os direitos reservados.
            </p>
            <div className="flex gap-6">
              <a href="/politica-de-reserva" className="text-sm text-muted-foreground transition-colors hover:text-primary">
                Política de Reserva
              </a>
              <a href="/termos" className="text-sm text-muted-foreground transition-colors hover:text-primary">
                Termos de Uso
              </a>
              <a href="/faq" className="text-sm text-muted-foreground transition-colors hover:text-primary">
                FAQ
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
