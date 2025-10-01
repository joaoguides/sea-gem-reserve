import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const SearchBar = () => {
  const navigate = useNavigate();
  const [boatType, setBoatType] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [year, setYear] = useState("");

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (boatType) params.set("type", boatType);
    if (priceRange) params.set("priceRange", priceRange);
    if (year) params.set("year", year);
    navigate(`/produtos?${params.toString()}`);
  };

  const handleQuickFilter = (filter: string) => {
    navigate(`/produtos?type=${filter}`);
  };
  return (
    <div className="w-full rounded-2xl bg-card/95 p-6 shadow-luxury-xl backdrop-blur-sm">
      <div className="grid gap-4 md:grid-cols-4">
        {/* Type Select */}
        <Select value={boatType} onValueChange={setBoatType}>
          <SelectTrigger className="h-12 border-input bg-background">
            <SelectValue placeholder="Tipo de embarcação" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="lancha">Lancha</SelectItem>
            <SelectItem value="veleiro">Veleiro</SelectItem>
            <SelectItem value="jetski">Jet Ski</SelectItem>
          </SelectContent>
        </Select>

        {/* Price Range Select */}
        <Select value={priceRange} onValueChange={setPriceRange}>
          <SelectTrigger className="h-12 border-input bg-background">
            <SelectValue placeholder="Faixa de preço" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0-500k">Até R$ 500mil</SelectItem>
            <SelectItem value="500k-1m">R$ 500mil - R$ 1mi</SelectItem>
            <SelectItem value="1m+">Acima de R$ 1mi</SelectItem>
          </SelectContent>
        </Select>

        {/* Year Input */}
        <Input
          type="text"
          placeholder="Ano (ex: 2024)"
          className="h-12 border-input bg-background"
          value={year}
          onChange={(e) => setYear(e.target.value)}
        />

        {/* Search Button */}
        <Button 
          className="h-12 bg-accent text-accent-foreground hover:bg-accent/90"
          onClick={handleSearch}
        >
          <Search className="mr-2 h-5 w-5" />
          Buscar
        </Button>
      </div>

      {/* Quick Filters */}
      <div className="mt-4 flex flex-wrap gap-2">
        <span className="text-sm text-muted-foreground">Popular:</span>
        <Button 
          variant="outline" 
          size="sm" 
          className="h-8 rounded-full"
          onClick={() => handleQuickFilter("lancha")}
        >
          Lanchas Novas
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className="h-8 rounded-full"
          onClick={() => handleQuickFilter("veleiro")}
        >
          Veleiros Premium
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className="h-8 rounded-full"
          onClick={() => handleQuickFilter("jetski")}
        >
          Jet Skis 2025
        </Button>
      </div>
    </div>
  );
};

export default SearchBar;
