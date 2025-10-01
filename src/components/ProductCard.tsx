import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Gauge, Heart, Ruler } from "lucide-react";

interface ProductCardProps {
  id: string;
  image: string;
  title: string;
  price: string;
  year: string;
  type: string;
  length: string;
  motorization: string;
  badge?: string;
  isNew?: boolean;
}

const ProductCard = ({
  image,
  title,
  price,
  year,
  type,
  length,
  motorization,
  badge,
  isNew = false,
}: ProductCardProps) => {
  return (
    <div className="group relative overflow-hidden rounded-2xl bg-card shadow-luxury transition-all hover:shadow-luxury-xl">
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={image}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        {/* Badges */}
        <div className="absolute left-4 top-4 flex gap-2">
          {badge && (
            <Badge className="bg-accent text-accent-foreground">
              {badge}
            </Badge>
          )}
          {isNew && (
            <Badge className="bg-primary text-primary-foreground">
              Novo
            </Badge>
          )}
        </div>

        {/* Favorite Button */}
        <Button
          size="icon"
          variant="secondary"
          className="absolute right-4 top-4 h-10 w-10 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background"
        >
          <Heart className="h-5 w-5" />
        </Button>

        {/* Overlay on Hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        
        {/* Quick View Button */}
        <Button
          variant="secondary"
          className="absolute bottom-4 left-1/2 -translate-x-1/2 translate-y-4 bg-background text-foreground opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"
        >
          Ver Detalhes
        </Button>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Type */}
        <p className="mb-2 text-sm font-medium text-muted-foreground">{type}</p>

        {/* Title */}
        <h3 className="mb-3 text-xl font-bold text-card-foreground line-clamp-1">
          {title}
        </h3>

        {/* Specifications */}
        <div className="mb-4 grid grid-cols-3 gap-3">
          <div className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">{year}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Ruler className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">{length}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Gauge className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">{motorization}</span>
          </div>
        </div>

        {/* Price and CTA */}
        <div className="flex items-center justify-between border-t border-border pt-4">
          <div>
            <p className="text-xs text-muted-foreground">A partir de</p>
            <p className="text-2xl font-bold text-primary">{price}</p>
          </div>
          <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
            Reservar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
